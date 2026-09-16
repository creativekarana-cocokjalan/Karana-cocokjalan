import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Sign in — KARANA Admin" };

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "/admin";

  return (
    <div className="admin-auth">
      <div className="admin-auth__card">
        <div className="admin-auth__mark">KARANA</div>
        <p className="admin-auth__lede">Sign in to manage your site content.</p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
