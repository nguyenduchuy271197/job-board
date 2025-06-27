"use server";

import { createClient } from "@/lib/supabase/server";
import { JOB_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { getCurrentUserId } from "@/lib/auth";
import type { JobDetails } from "@/types/custom.types";

/**
 * Lấy chi tiết công việc theo slug
 * @param slug - Job slug
 * @returns Promise<{ success: boolean; data?: JobDetails; error?: string }>
 */
export async function getJobBySlug(slug: string) {
  try {
    if (!slug) {
      return {
        success: false,
        error: JOB_ERRORS.JOB_NOT_FOUND,
      };
    }

    const supabase = await createClient();
    const currentUserId = await getCurrentUserId();

    const { data: job, error } = await supabase
      .from("jobs")
      .select(`
        *,
        companies (
          id,
          name,
          slug,
          description,
          website,
          logo_url,
          industry,
          location,
          email,
          verified
        ),
        job_skills (
          skills (
            id,
            name,
            category
          )
        )
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !job) {
      console.error("Error fetching job by slug:", error);
      return {
        success: false,
        error: JOB_ERRORS.JOB_NOT_FOUND,
      };
    }

    // Get additional user-specific data if authenticated
    let isSaved = false;
    let hasApplied = false;

    if (currentUserId) {
      // Check if job is saved by current user
      const { data: savedJob } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("job_id", job.id)
        .eq("user_id", currentUserId)
        .single();

      isSaved = !!savedJob;

      // Check if user has applied for this job
      const { data: application } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", job.id)
        .eq("candidate_id", currentUserId)
        .single();

      hasApplied = !!application;
    }

    // Transform data to match expected type
    const companies = job.companies as unknown as {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      website: string | null;
      logo_url: string | null;
      industry: string | null;
      location: string | null;
      email: string | null;
      verified: boolean;
    };
    
    const jobSkills = job.job_skills?.map((js: unknown) => {
      const jsTyped = js as {
        skills: {
          id: string;
          name: string;
          category: string | null;
        };
      };
      return {
        ...jsTyped,
        skills: jsTyped.skills,
      };
    }) || [];

    const jobDetails: JobDetails = {
      ...job,
      companies,
      job_skills: jobSkills,
      applications_count: job.application_count || 0,
      is_saved: isSaved,
      has_applied: hasApplied,
    };

    return {
      success: true,
      data: jobDetails,
    };
  } catch (error) {
    console.error("Error in getJobBySlug:", error);
    return {
      success: false,
      error: GENERIC_ERRORS.SOMETHING_WENT_WRONG,
    };
  }
} 