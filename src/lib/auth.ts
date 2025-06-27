import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { 
  User, 
  UserRole,
  CompanyMember
} from "@/types/custom.types";

// ============================================================================
// Core Authentication Functions
// ============================================================================

/**
 * Get the current authenticated user with profile data
 * @returns User object or null if not authenticated
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error("Error getting server user:", error);
    return null;
  }
}

// ============================================================================
// Protection Functions - require<Condition>(): Promise<User>
// ============================================================================

/**
 * Require user to be authenticated - redirects to login if not
 * @param redirectTo - URL to redirect to after login (optional)
 * @returns User object
 */
export async function requireAuth(redirectTo?: string): Promise<User> {
  const user = await getServerUser();
  
  if (!user) {
    const loginUrl = redirectTo 
      ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : "/login";
    redirect(loginUrl);
  }
  
  return user;
}

/**
 * Require user to be an admin - redirects if not
 * @returns User object with admin role
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  
  if (user.role !== "admin") {
    redirect("/unauthorized?reason=admin_required");
  }
  
  return user;
}

/**
 * Require user to be an employer - redirects if not
 * @returns User object with employer role
 */
export async function requireEmployer(): Promise<User> {
  const user = await requireAuth();
  
  if (user.role !== "employer") {
    redirect("/unauthorized?reason=employer_required");
  }
  
  return user;
}

/**
 * Require user to be a candidate - redirects if not
 * @returns User object with candidate role
 */
export async function requireCandidate(): Promise<User> {
  const user = await requireAuth();
  
  if (user.role !== "candidate") {
    redirect("/unauthorized?reason=candidate_required");
  }
  
  return user;
}

/**
 * Require user to be a company member - redirects if not
 * @param companyId - Company ID to check membership for
 * @returns User object and company member info
 */
export async function requireCompanyMember(companyId: string): Promise<{
  user: User;
  membership: CompanyMember;
}> {
  const user = await requireEmployer();
  
  try {
    const supabase = await createClient();
    
    const { data: membership, error } = await supabase
      .from("company_members")
      .select("*")
      .eq("user_id", user.id)
      .eq("company_id", companyId)
      .single();

    if (error || !membership) {
      redirect("/unauthorized?reason=not_company_member");
    }

    return { user, membership };
  } catch (error) {
    console.error("Error checking company membership:", error);
    redirect("/unauthorized?reason=membership_check_failed");
  }
}

// ============================================================================
// Check Functions - is<Condition>(): Promise<boolean>
// ============================================================================

/**
 * Check if current user is authenticated
 * @returns boolean
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return user !== null;
}

/**
 * Check if current user has specific role
 * @param role - Role to check for
 * @returns boolean
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getServerUser();
  return user?.role === role;
}

/**
 * Check if current user is a member of specified company
 * @param companyId - Company ID to check
 * @returns boolean
 */
export async function isCompanyMember(companyId: string): Promise<boolean> {
  const user = await getServerUser();
  
  if (!user) return false;
  
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("company_members")
      .select("id")
      .eq("user_id", user.id)
      .eq("company_id", companyId)
      .single();

    return !error && data !== null;
  } catch (error) {
    console.error("Error checking company membership:", error);
    return false;
  }
}

// ============================================================================
// Current Data Getters - getCurrent<Data>(): Promise<Type | null>
// ============================================================================

/**
 * Get current user ID
 * @returns string | null
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getServerUser();
  return user?.id || null;
}

/**
 * Get current user role
 * @returns UserRole | null
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const user = await getServerUser();
  return user?.role || null;
}



