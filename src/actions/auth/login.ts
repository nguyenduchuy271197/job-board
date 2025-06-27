"use server";


import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { AUTH_ERRORS, USER_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { z } from "zod";

type Result = 
  | { success: true; data: { user: { id: string; email: string; role: string } } }
  | { success: false; error: string };

export async function loginUser(params: LoginInput): Promise<Result> {
  try {
    // 1. Validate input
    const data = loginSchema.parse(params);

    // 2. Create Supabase client
    const supabase = await createClient();

    // 3. Sign in user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      console.error("Auth signin error:", authError);
      
      // Handle specific auth errors
      if (authError.message.includes("Invalid credentials") || 
          authError.message.includes("Invalid login credentials")) {
        return { success: false, error: AUTH_ERRORS.INVALID_CREDENTIALS };
      }
      
      if (authError.message.includes("Email not confirmed")) {
        return { success: false, error: AUTH_ERRORS.EMAIL_NOT_VERIFIED };
      }

      return { success: false, error: AUTH_ERRORS.LOGIN_FAILED };
    }

    if (!authData.user) {
      return { success: false, error: AUTH_ERRORS.LOGIN_FAILED };
    }

    // 4. Get user profile to include role information
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role, is_active")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return { success: false, error: "Không thể tải thông tin người dùng" };
    }

    // 5. Check if user account is active
    if (!profile.is_active) {
      // Sign out the user immediately
      await supabase.auth.signOut();
      return { success: false, error: USER_ERRORS.ACCOUNT_DEACTIVATED };
    }

    return {
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          role: profile.role,
        },
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    return { success: false, error: GENERIC_ERRORS.SOMETHING_WENT_WRONG };
  }
} 