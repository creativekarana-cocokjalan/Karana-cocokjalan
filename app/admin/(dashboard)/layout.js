import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SECTIONS, SECTION_ORDER, COLLECTIONS, COLLECTION_ORDER } from "@/lib/adminSchema";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-sidebar__mark">
          KARANA
        </Link>
        <p className="admin-sidebar__sub">Admin</p>

        <nav className="admin-nav">
          <div className="admin-nav__group">
            <p className="admin-nav__label">Content</p>
            {SECTION_ORDER.map((id) => (
              <Link key={id} href={`/admin/section/${id}`} className="admin-nav__link">
                {SECTIONS[id].label}
              </Link>
            ))}
          </div>

          <div className="admin-nav__group">
            <p className="admin-nav__label">Collections</p>
            {COLLECTION_ORDER.map((key) => (
              <Link key={key} href={`/admin/collection/${key}`} className="admin-nav__link">
                {COLLECTIONS[key].label}
              </Link>
            ))}
          </div>

          <div className="admin-nav__group">
            <p className="admin-nav__label">Media</p>
            <Link href="/admin/media" className="admin-nav__link">
              Media library
            </Link>
          </div>
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav__link admin-nav__link--muted">
            View live site ↗
          </a>
          {user?.email ? <p className="admin-sidebar__user">{user.email}</p> : null}
          <LogoutButton />
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
