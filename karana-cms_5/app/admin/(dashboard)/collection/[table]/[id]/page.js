import { notFound } from "next/navigation";
import { COLLECTIONS } from "@/lib/adminSchema";
import { createClient } from "@/lib/supabase/server";
import CollectionItemForm from "@/components/admin/CollectionItemForm";

export async function generateMetadata({ params }) {
  const { table } = await params;
  const schema = COLLECTIONS[table];
  return { title: schema ? `Edit ${schema.label.replace(/s$/, "")} — KARANA Admin` : "KARANA Admin" };
}

export default async function EditCollectionItemPage({ params }) {
  const { table, id } = await params;
  const schema = COLLECTIONS[table];
  if (!schema) notFound();

  const supabase = await createClient();
  const { data: item } = await supabase.from(schema.table).select("*").eq("id", id).single();
  if (!item) notFound();

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Edit {schema.itemLabel(item)}</h1>
      </header>
      <CollectionItemForm tableKey={table} fields={schema.fields} item={item} />
    </div>
  );
}
