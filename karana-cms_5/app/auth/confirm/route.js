import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Verifies the token from a Supabase auth email (password recovery, invite,
// etc.) and establishes a session, then redirects to `next`. This is the
// standard Supabase + Next.js SSR pattern: the email link points here first,
// not directly at the admin page.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/admin";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      redirect(next);
    }
  }

  redirect("/admin/forgot-password?error=invalid-link");
}
