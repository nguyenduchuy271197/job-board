"use server";

import { createClient } from "@/lib/supabase/server";
import { updateJobSchema, type UpdateJobInput } from "@/lib/validations/schemas/job.schema";
import { JOB_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireEmployer } from "@/lib/auth";
import { createSlugFromTitle } from "@/constants/labels";
import type { Job } from "@/types/custom.types";

/**
 * Cập nhật thông tin công việc (chỉ dành cho thành viên công ty)
 * @param input - Thông tin công việc cần cập nhật
 * @returns Promise<{ success: boolean; data?: Job; error?: string }>
 */
export async function updateJob(input: UpdateJobInput) {
  try {
    // Validate input
    const validatedInput = updateJobSchema.parse(input);

    // Check if user is employer
    const user = await requireEmployer();

    const supabase = await createClient();

    // Get existing job and verify user has access
    const { data: existingJob, error: fetchError } = await supabase
      .from("jobs")
      .select(`
        *,
        companies!inner (
          company_members!inner (
            user_id
          )
        )
      `)
      .eq("id", validatedInput.id)
      .eq("companies.company_members.user_id", user.id)
      .single();

    if (fetchError || !existingJob) {
      console.error("Error fetching job or access denied:", fetchError);
      return {
        success: false,
        error: JOB_ERRORS.JOB_NOT_FOUND,
      };
    }

    // Prepare update data
    const updateData: Partial<Job> = {};

    // Update fields if provided
    if (validatedInput.title !== undefined) {
      updateData.title = validatedInput.title;
      // Update slug if title changed
      if (validatedInput.title !== existingJob.title) {
        const baseSlug = createSlugFromTitle(validatedInput.title);
        
        // Check if new slug exists and make it unique
        let slug = baseSlug;
        let counter = 1;
        
        while (true) {
          const { data: existingSlugJob } = await supabase
            .from("jobs")
            .select("id")
            .eq("slug", slug)
            .neq("id", validatedInput.id)
            .single();

          if (!existingSlugJob) break;
          
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        updateData.slug = slug;
      }
    }

    if (validatedInput.description !== undefined) {
      updateData.description = validatedInput.description;
    }

    if (validatedInput.requirements !== undefined) {
      updateData.requirements = validatedInput.requirements || null;
    }

    if (validatedInput.salary_min !== undefined) {
      updateData.salary_min = validatedInput.salary_min || null;
    }

    if (validatedInput.salary_max !== undefined) {
      updateData.salary_max = validatedInput.salary_max || null;
    }

    if (validatedInput.currency !== undefined) {
      updateData.currency = validatedInput.currency;
    }

    if (validatedInput.employment_type !== undefined) {
      updateData.employment_type = validatedInput.employment_type;
    }

    if (validatedInput.experience_level !== undefined) {
      updateData.experience_level = validatedInput.experience_level;
    }

    if (validatedInput.location !== undefined) {
      updateData.location = validatedInput.location || null;
    }

    if (validatedInput.is_remote !== undefined) {
      updateData.is_remote = validatedInput.is_remote;
    }

    if (validatedInput.status !== undefined) {
      updateData.status = validatedInput.status;
      // Set published_at when status changes to published
      if (validatedInput.status === "published" && existingJob.status !== "published") {
        updateData.published_at = new Date().toISOString();
      }
    }

    // Update job
    const { data: updatedJob, error } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", validatedInput.id)
      .select()
      .single();

    if (error || !updatedJob) {
      console.error("Error updating job:", error);
      return {
        success: false,
        error: JOB_ERRORS.JOB_UPDATE_FAILED,
      };
    }

    // Update job skills if provided
    if (validatedInput.skills !== undefined) {
      // Delete existing job skills
      const { error: deleteSkillsError } = await supabase
        .from("job_skills")
        .delete()
        .eq("job_id", validatedInput.id);

      if (deleteSkillsError) {
        console.error("Error deleting existing job skills:", deleteSkillsError);
      }

      // Add new job skills
      if (validatedInput.skills.length > 0) {
        const jobSkillsData = validatedInput.skills.map(skillId => ({
          job_id: validatedInput.id,
          skill_id: skillId,
          is_required: true,
        }));

        const { error: skillsError } = await supabase
          .from("job_skills")
          .insert(jobSkillsData);

        if (skillsError) {
          console.error("Error adding job skills:", skillsError);
          // Note: We don't fail the job update if skills update fails
        }
      }
    }

    return {
      success: true,
      data: updatedJob,
    };
  } catch (error) {
    console.error("Error in updateJob:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 