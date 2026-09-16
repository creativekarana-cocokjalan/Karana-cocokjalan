import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export const metadata = { title: "Reset password — KARANA Admin" };

export default function ForgotPasswordPage() {
  return (
    <div className="admin-auth">
      <div className="admin-auth__card">
        <div className="admin-auth__mark">KARANA</div>
        <p className="admin-auth__lede">
          Enter the email on your admin account and we'll send you a link to reset your password.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
