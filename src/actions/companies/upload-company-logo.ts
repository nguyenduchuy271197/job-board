"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadCompanyLogoSchema } from "@/lib/validations/schemas/company.schema";
import { COMPANY_ERRORS, GENERIC_ERRORS, FILE_ERRORS } from "@/constants/error-messages";
import { requireEmployer } from "@/lib/auth";

/**
 * Tải logo công ty lên Supabase storage
 * @param formData - FormData chứa company_id và file logo
 * @returns Promise<{ success: boolean; data?: { url: string }; error?: string }>
 */
export async function uploadCompanyLogo(formData: FormData) {
  try {
    const company_id = formData.get("company_id") as string;
    const file = formData.get("logo") as File;

    // Validate input
    const validatedInput = uploadCompanyLogoSchema.parse({ company_id });

    if (!file) {
      return {
        success: false,
        error: "File logo là bắt buộc",
      };
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: FILE_ERRORS.FILE_TOO_LARGE,
      };
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: FILE_ERRORS.FILE_TYPE_NOT_SUPPORTED,
      };
    }

    // Check if user is employer
    const user = await requireEmployer();

    const supabase = await createClient();

    // Check if user is a member of the company
    const { data: membership, error: memberError } = await supabase
      .from("company_members")
      .select("id")
      .eq("company_id", validatedInput.company_id)
      .eq("user_id", user.id)
      .single();

    if (memberError || !membership) {
      return {
        success: false,
        error: COMPANY_ERRORS.NOT_COMPANY_MEMBER,
      };
    }

    // Check if company exists
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id, logo_url")
      .eq("id", validatedInput.company_id)
      .single();

    if (companyError || !company) {
      return {
        success: false,
        error: COMPANY_ERRORS.COMPANY_NOT_FOUND,
      };
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const fileName = `${validatedInput.company_id}/${Date.now()}-logo.${fileExtension}`;

    try {
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return {
          success: false,
          error: FILE_ERRORS.FILE_UPLOAD_FAILED,
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("company-logos")
        .getPublicUrl(uploadData.path);

      const publicUrl = urlData.publicUrl;

      // Update company logo_url
      const { error: updateError } = await supabase
        .from("companies")
        .update({ logo_url: publicUrl })
        .eq("id", validatedInput.company_id);

      if (updateError) {
        console.error("Error updating company logo_url:", updateError);
        // Clean up uploaded file
        await supabase.storage
          .from("company-logos")
          .remove([uploadData.path]);

        return {
          success: false,
          error: COMPANY_ERRORS.COMPANY_UPDATE_FAILED,
        };
      }

      // Clean up old logo if exists
      if (company.logo_url) {
        try {
          const oldPath = company.logo_url.split("/").pop();
          if (oldPath) {
            await supabase.storage
              .from("company-logos")
              .remove([`${validatedInput.company_id}/${oldPath}`]);
          }
        } catch (cleanupError) {
          // Log cleanup error but don't fail the request
          console.warn("Could not clean up old logo:", cleanupError);
        }
      }

      return {
        success: true,
        data: { url: publicUrl },
      };
    } catch (storageError) {
      console.error("Storage operation failed:", storageError);
      return {
        success: false,
        error: FILE_ERRORS.FILE_UPLOAD_FAILED,
      };
    }
  } catch (error) {
    console.error("Error in uploadCompanyLogo:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 