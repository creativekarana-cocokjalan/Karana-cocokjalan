import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTIONS } from "@/lib/adminSchema";
import { createClient } from "@/lib/supabase/server";
import { deleteItem } from "@/app/actions/collections";
import DeleteButton from "@/components/admin/DeleteButton";

export async function generateMetadata({ params }) {
  const { table } = await params;
  const schema = COLLECTIONS[table];
  return { title: schema ? `${schema.label} — KARANA Admin` : "KARANA Admin" };
}

export default async function CollectionListPage({ params }) {
  const { table } = await params;
  const schema = COLLECTIONS[table];
  if (!schema) notFound();

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from(schema.table)
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="admin-page">
      <header className="admin-page__header admin-page__header--row">
        <div>
          <h1>{schema.label}</h1>
          {schema.description ? <p>{schema.description}</p> : null}
        </div>
        <Link href={`/admin/collection/${table}/new`} className="admin-btn admin-btn--primary">
          + Add new
        </Link>
      </header>

      {!rows || rows.length === 0 ? (
        <p className="admin-empty">Nothing here yet. Add your first item.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {schema.listFields.map((f) => (
                  <th key={f.key}>{f.label}</th>
                ))}
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {schema.listFields.map((f) => (
                    <td key={f.key}>{String(row[f.key] ?? "")}</td>
                  ))}
                  <td>
                    <span className={`admin-badge ${row.is_published ? "admin-badge--live" : "admin-badge--draft"}`}>
                      {row.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="admin-table__actions">
                    <Link href={`/admin/collection/${table}/${row.id}`} className="admin-btn admin-btn--ghost admin-btn--sm">
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteItem.bind(null, table, row.id)}
                      confirmLabel={`Delete "${schema.itemLabel(row)}"?`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
