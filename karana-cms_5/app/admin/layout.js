import "./admin.css";

export const metadata = {
  title: "KARANA Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <>{children}</>;
}
