"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";

type Result = 
  | { success: true }
  | { success: false; error: string };

export async function logoutUser(): Promise<Result> {
  try {
    // 1. Create Supabase client
    const supabase = await createClient();

    // 2. Sign out user
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Auth signout error:", error);
      return { success: false, error: AUTH_ERRORS.LOGOUT_FAILED };
    }

    // 3. Redirect to home page
    redirect("/");
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: GENERIC_ERRORS.SOMETHING_WENT_WRONG };
  }
} 