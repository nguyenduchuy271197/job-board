"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { uploadCVSchema, cvFileValidationSchema } from "@/lib/validations/schemas/cv.schema";
import { CV_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import type { CV } from "@/types/custom.types";

type Result = 
  | { success: true; data: CV }
  | { success: false; error: string };

export async function uploadCV(formData: FormData): Promise<Result> {
  try {
    // 1. Extract data from FormData
    const title = formData.get("title") as string;
    const isPrimaryValue = formData.get("is_primary") as string;
    const is_primary = isPrimaryValue === "true";
    const file = formData.get("file") as File;

    // 2. Validate input data
    const validatedData = uploadCVSchema.parse({
      title,
      is_primary,
    });

    // 3. Validate file
    if (!file) {
      return {
        success: false,
        error: CV_ERRORS.CV_FILE_REQUIRED
      };
    }

    // Validate file format and size
    cvFileValidationSchema.parse({ file });
    
    // 4. Authenticate user and ensure they are a candidate
    const user = await requireAuth();
    
    if (user.role !== "candidate") {
      return {
        success: false,
        error: "Chỉ ứng viên mới có thể tải CV"
      };
    }
    
    // 5. Get Supabase client
    const supabase = await createClient();

    // 6. If setting as primary, unset other primary CVs first
    if (validatedData.is_primary) {
      await supabase
        .from("cvs")
        .update({ is_primary: false })
        .eq("user_id", user.id)
        .eq("is_primary", true);
    }

    // 7. Generate unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // 8. Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading CV file:", uploadError);
      return {
        success: false,
        error: CV_ERRORS.CV_UPLOAD_FAILED
      };
    }

    // 9. Get file URL
    const { data: { publicUrl } } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    // 10. Create CV record in database
    const { data: cvData, error: dbError } = await supabase
      .from("cvs")
      .insert({
        user_id: user.id,
        title: validatedData.title,
        file_url: publicUrl,
        file_name: file.name,
        is_primary: validatedData.is_primary,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error creating CV record:", dbError);
      
      // Clean up uploaded file if database insert fails
      await supabase.storage
        .from("resumes")
        .remove([fileName]);
      
      return {
        success: false,
        error: CV_ERRORS.CV_UPLOAD_FAILED
      };
    }

    // 11. If this is the user's first CV, make it primary
    if (!validatedData.is_primary) {
      const { count } = await supabase
        .from("cvs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (count === 1) {
        const { data: updatedCV } = await supabase
          .from("cvs")
          .update({ is_primary: true })
          .eq("id", cvData.id)
          .select()
          .single();
        
        if (updatedCV) {
          return { success: true, data: updatedCV };
        }
      }
    }

    return {
      success: true,
      data: cvData
    };

  } catch (error) {
    console.error("Error in uploadCV:", error);
    
    if (error instanceof Error && error.message.includes("redirect")) {
      throw error; // Re-throw redirect errors
    }
    
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG
    };
  }
} 