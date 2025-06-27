"use server";

import { createClient } from "@/lib/supabase/server";
import { createJobSchema, type CreateJobInput } from "@/lib/validations/schemas/job.schema";
import { JOB_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { requireCompanyMember } from "@/lib/auth";
import { createSlugFromTitle } from "@/constants/labels";
import type { Job } from "@/types/custom.types";

/**
 * Tạo công việc mới (chỉ dành cho nhà tuyển dụng)
 * @param input - Thông tin công việc cần tạo
 * @returns Promise<{ success: boolean; data?: Job; error?: string }>
 */
export async function createJob(input: CreateJobInput) {
  try {
    // Validate input
    const validatedInput = createJobSchema.parse(input);

    // Check if user is employer and is a member of the company
    const { user } = await requireCompanyMember(validatedInput.company_id);

    const supabase = await createClient();

    // Generate slug from title
    const baseSlug = createSlugFromTitle(validatedInput.title);
    
    // Check if slug exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existingJob } = await supabase
        .from("jobs")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!existingJob) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create job data
    const jobData = {
      title: validatedInput.title,
      slug,
      description: validatedInput.description,
      requirements: validatedInput.requirements || null,
      salary_min: validatedInput.salary_min || null,
      salary_max: validatedInput.salary_max || null,
      currency: validatedInput.currency,
      employment_type: validatedInput.employment_type,
      experience_level: validatedInput.experience_level,
      location: validatedInput.location || null,
      is_remote: validatedInput.is_remote,
      company_id: validatedInput.company_id,
      created_by: user.id,
      status: "draft" as const,
    };

    const { data: newJob, error } = await supabase
      .from("jobs")
      .insert(jobData)
      .select()
      .single();

    if (error || !newJob) {
      console.error("Error creating job:", error);
      return {
        success: false,
        error: JOB_ERRORS.JOB_CREATE_FAILED,
      };
    }

    // Add job skills if provided
    if (validatedInput.skills && validatedInput.skills.length > 0) {
      const jobSkillsData = validatedInput.skills.map(skillId => ({
        job_id: newJob.id,
        skill_id: skillId,
        is_required: true,
      }));

      const { error: skillsError } = await supabase
        .from("job_skills")
        .insert(jobSkillsData);

      if (skillsError) {
        console.error("Error adding job skills:", skillsError);
        // Note: We don't fail the job creation if skills addition fails
      }
    }

    return {
      success: true,
      data: newJob as Job,
    };
  } catch (error) {
    console.error("Error in createJob:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 