"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadAvatarSchema } from "@/lib/validations";
import { USER_ERRORS, FILE_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import type { User } from "@/types/custom.types";

type Result = 
  | { success: true; data: { user: User; avatarUrl: string } }
  | { success: false; error: string };

export async function uploadAvatar(formData: FormData): Promise<Result> {
  try {
    // 1. Get file from FormData
    const file = formData.get("avatar") as File;
    if (!file) {
      return { success: false, error: FILE_ERRORS.FILE_UPLOAD_FAILED };
    }

    // 2. Validate input
    const data = uploadAvatarSchema.parse({ avatar: file });
    
    // 3. Require authentication
    const user = await requireAuth();
    
    // 4. Create Supabase client
    const supabase = await createClient();

    // 5. Generate unique filename
    const fileExt = data.avatar.name.split('.').pop();
    const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

    // 6. Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, data.avatar, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { success: false, error: USER_ERRORS.AVATAR_UPLOAD_FAILED };
    }

    // 7. Get public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(uploadData.path);

    // 8. Update user profile with new avatar URL
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: urlData.publicUrl })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("User update error:", updateError);
      // Try to delete uploaded file if user update fails
      await supabase.storage.from("avatars").remove([uploadData.path]);
      return { success: false, error: USER_ERRORS.AVATAR_UPLOAD_FAILED };
    }

    return {
      success: true,
      data: {
        user: updatedUser,
        avatarUrl: urlData.publicUrl,
      },
    };
  } catch (error) {
    console.error("Upload avatar error:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || USER_ERRORS.AVATAR_UPLOAD_FAILED,
      };
    }

    return { success: false, error: GENERIC_ERRORS.SOMETHING_WENT_WRONG };
  }
} 