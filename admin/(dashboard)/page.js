import Link from "next/link";
import { SECTIONS, SECTION_ORDER, COLLECTIONS, COLLECTION_ORDER } from "@/lib/adminSchema";

export const metadata = { title: "Dashboard — KARANA Admin" };

export default function AdminHomePage() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Dashboard</h1>
        <p>Edit every piece of text, image and video on the site, and manage your projects, services, locations and clients.</p>
      </header>

      <section className="admin-card-grid">
        {SECTION_ORDER.map((id) => (
          <Link key={id} href={`/admin/section/${id}`} className="admin-card">
            <h2>{SECTIONS[id].label}</h2>
            <p>{SECTIONS[id].description}</p>
          </Link>
        ))}
      </section>

      <h2 className="admin-page__subheading">Collections</h2>
      <section className="admin-card-grid">
        {COLLECTION_ORDER.map((key) => (
          <Link key={key} href={`/admin/collection/${key}`} className="admin-card">
            <h2>{COLLECTIONS[key].label}</h2>
            <p>{COLLECTIONS[key].description}</p>
          </Link>
        ))}
        <Link href="/admin/media" className="admin-card">
          <h2>Media library</h2>
          <p>Every image and video you've uploaded, in one place.</p>
        </Link>
      </section>
    </div>
  );
}
