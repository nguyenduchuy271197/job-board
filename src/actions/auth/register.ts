"use server";

import { createClient } from "@/lib/supabase/server";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { AUTH_ERRORS, GENERIC_ERRORS } from "@/constants/error-messages";
import { z } from "zod";

type Result = 
  | { success: true; data: { user: { id: string; email: string } } }
  | { success: false; error: string };

export async function registerUser(params: RegisterInput): Promise<Result> {
  try {
    // 1. Validate input
    const data = registerSchema.parse(params);

    // 2. Create Supabase client
    const supabase = await createClient();

    // 3. Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", data.email)
      .single();

    if (existingUser) {
      return { success: false, error: AUTH_ERRORS.EMAIL_ALREADY_EXISTS };
    }

    // 4. Create user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role,
        },
      },
    });

    if (authError) {
      console.error("Auth signup error:", authError);
      
      // Handle specific auth errors
      if (authError.message.includes("already registered")) {
        return { success: false, error: AUTH_ERRORS.EMAIL_ALREADY_EXISTS };
      }
      
      if (authError.message.includes("password")) {
        return { success: false, error: AUTH_ERRORS.WEAK_PASSWORD };
      }

      return { success: false, error: AUTH_ERRORS.LOGIN_FAILED };
    }

    if (!authData.user) {
      return { success: false, error: AUTH_ERRORS.LOGIN_FAILED };
    }

    // 5. Update user profile in public.users (trigger should handle initial creation)
    const { error: profileError } = await supabase
      .from("users")
      .update({
        full_name: data.fullName,
        role: data.role,
      })
      .eq("id", authData.user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
      // Non-blocking error - user is created but profile incomplete
    }

    return {
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
        },
      },
    };
  } catch (error) {
    console.error("Register error:", error);
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    return { success: false, error: GENERIC_ERRORS.SOMETHING_WENT_WRONG };
  }
}