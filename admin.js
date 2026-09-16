import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client — bypasses Row Level Security entirely.
// NEVER import this from a Client Component or expose SUPABASE_SERVICE_ROLE_KEY
// to the browser. Used only inside Server Actions for writes/uploads once the
// caller has already been confirmed as a logged-in admin.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
