"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signIn(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// Sends a password-reset email via Supabase Auth. The link routes through
// /auth/confirm (which verifies the token and creates a temporary "recovery"
// session) before landing on /admin/reset-password, where the admin actually
// picks a new password.
export async function requestPasswordReset(prevState, formData) {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    return { error: "Enter your email address.", success: false };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/admin/reset-password`,
  });

  // Always show the same success message, whether or not that email
  // actually has an account — avoids leaking which emails are registered.
  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true };
}

// Called from /admin/reset-password once the admin has a valid recovery
// session (established by /auth/confirm after clicking the emailed link).
export async function updatePassword(prevState, formData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}
