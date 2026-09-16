import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UpdatePasswordForm from "@/components/admin/UpdatePasswordForm";

export const metadata = { title: "Set new password — KARANA Admin" };

export default async function ResetPasswordPage() {
  // A valid session here means the admin arrived via a working recovery
  // link (verified by /auth/confirm just before this render). No session
  // means the link was missing, already used, or expired.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="admin-auth">
      <div className="admin-auth__card">
        <div className="admin-auth__mark">KARANA</div>
        {user ? (
          <>
            <p className="admin-auth__lede">Choose a new password for your admin account.</p>
            <UpdatePasswordForm />
          </>
        ) : (
          <>
            <p className="admin-auth__lede">
              This reset link is invalid or has expired. Request a new one below.
            </p>
            <Link href="/admin/forgot-password" className="admin-btn admin-btn--primary" style={{ display: "inline-block", textAlign: "center" }}>
              Request a new link
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
