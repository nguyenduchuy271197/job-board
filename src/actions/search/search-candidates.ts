"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId, hasRole } from "@/lib/auth";
import { searchCandidatesSchema, type SearchCandidatesInput } from "@/lib/validations/schemas/search.schema";
import { type CandidateSearchResponse, type CandidateSearchResult } from "@/types/custom.types";
import { SEARCH_ERRORS } from "@/constants/error-messages";

type Result = 
  | { success: true; data: CandidateSearchResponse }
  | { success: false; error: string };

export async function searchCandidates(params: Partial<SearchCandidatesInput> = {}): Promise<Result> {
  try {
    // 1. Validate input
    const validatedParams = searchCandidatesSchema.parse(params);
    const { 
      query,
      page,
      limit,
      sort_by,
      sort_order,
      location,
      experience_level,
      min_years_experience,
      max_years_experience,
      skills,
      required_skills,
      min_skill_level,
      // employment_types,
      is_available,
      // min_salary,
      // max_salary,
      has_cv,
      has_portfolio,
      verified_only
    } = validatedParams;

    // 2. Check authentication and role
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập để tìm kiếm ứng viên" };
    }

    const isEmployer = await hasRole("employer");
    const isAdmin = await hasRole("admin");
    
    if (!isEmployer && !isAdmin) {
      return { success: false, error: "Chỉ nhà tuyển dụng mới có thể tìm kiếm ứng viên" };
    }

    // 3. Get database client
    const supabase = await createClient();

    // 4. Build base query with joins
    let query_builder = supabase
      .from("users")
      .select(`
        id,
        email,
        full_name,
        phone,
        avatar_url,
        location,
        bio,
        linkedin_url,
        portfolio_url,
        is_active,
        created_at,
        updated_at,
        user_skills (
          id,
          proficiency_level,
          years_experience,
          skills (
            id,
            name,
            category
          )
        ),
        cvs (
          id,
          title,
          is_primary,
          created_at
        )
      `)
      .eq("role", "candidate")
      .eq("is_active", true);

    // 5. Apply text search filters
    if (query) {
      query_builder = query_builder.or(`
        full_name.ilike.%${query}%,
        bio.ilike.%${query}%,
        location.ilike.%${query}%,
        user_skills.skills.name.ilike.%${query}%
      `);
    }

    // 6. Apply location filter
    if (location) {
      query_builder = query_builder.ilike("location", `%${location}%`);
    }

    // 7. Apply experience filters
    if (experience_level) {
      // Since experience_level is not directly on users table, we'll need to calculate it based on skills
      // For now, we'll filter by overall years of experience from skills
    }

    // 8. Apply availability filter
    if (is_available !== undefined) {
      // This would require an additional field in the users table or derived logic
      // For now, we'll assume all active candidates are available
    }

    // 9. Apply profile completeness filters
    if (has_cv) {
      query_builder = query_builder.not("cvs", "is", null);
    }

    if (has_portfolio) {
      query_builder = query_builder.not("portfolio_url", "is", null);
    }

    if (verified_only) {
      // If we have a verified field, we'd filter by it
      // For now, we'll skip this or use is_active as a proxy
    }

    // 10. Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "candidate")
      .eq("is_active", true);

    if (countError) {
      console.error("Error getting candidates count:", countError);
      return { success: false, error: SEARCH_ERRORS.SEARCH_FAILED };
    }

    // 11. Apply pagination and sorting
    const offset = (page - 1) * limit;

    // Map sort_by to actual sorting logic
    let orderColumn = "created_at";
    if (sort_by === "updated_at") {
      orderColumn = "updated_at";
    } else if (sort_by === "relevance") {
      // For relevance, we'd use full-text search scoring
      // For now, use updated_at as a proxy for activity
      orderColumn = "updated_at";
    }

    const { data: candidates, error } = await query_builder
      .order(orderColumn, { ascending: sort_order === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error searching candidates:", error);
      return { success: false, error: SEARCH_ERRORS.SEARCH_FAILED };
    }

    // 12. Post-process results to apply complex filters
    let filteredCandidates = candidates || [];

    // Apply skills filters
    if (skills && skills.length > 0) {
      filteredCandidates = filteredCandidates.filter(candidate => {
        const candidateSkillIds = candidate.user_skills?.map(us => (us.skills as unknown as { id: string }).id) || [];
        return skills.some(skillId => candidateSkillIds.includes(skillId));
      });
    }

    if (required_skills && required_skills.length > 0) {
      filteredCandidates = filteredCandidates.filter(candidate => {
        const candidateSkillIds = candidate.user_skills?.map(us => (us.skills as unknown as { id: string }).id) || [];
        return required_skills.every(skillId => candidateSkillIds.includes(skillId));
      });
    }

    if (min_skill_level) {
      filteredCandidates = filteredCandidates.filter(candidate => {
        const maxProficiency = Math.max(
          ...(candidate.user_skills?.map(us => us.proficiency_level || 0) || [0])
        );
        return maxProficiency >= min_skill_level;
      });
    }

    if (min_years_experience || max_years_experience) {
      filteredCandidates = filteredCandidates.filter(candidate => {
        const totalExperience = candidate.user_skills?.reduce(
          (sum, us) => sum + (us.years_experience || 0), 0
        ) || 0;
        const avgExperience = candidate.user_skills?.length 
          ? totalExperience / candidate.user_skills.length 
          : 0;
        
        if (min_years_experience && avgExperience < min_years_experience) return false;
        if (max_years_experience && avgExperience > max_years_experience) return false;
        return true;
      });
    }

    // 13. Calculate pagination metadata
    const total = totalCount || 0;
    const hasNext = offset + limit < total;
    const hasPrevious = page > 1;

    const result: CandidateSearchResponse = {
      candidates: filteredCandidates as unknown as CandidateSearchResult[],
      total,
      page,
      limit,
      has_next: hasNext,
      has_previous: hasPrevious,
    };

    return { success: true, data: result };

  } catch (error) {
    console.error("Error in searchCandidates:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Đã có lỗi xảy ra khi tìm kiếm ứng viên" };
  }
} 