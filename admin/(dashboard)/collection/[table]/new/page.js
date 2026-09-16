import { notFound } from "next/navigation";
import { COLLECTIONS } from "@/lib/adminSchema";
import CollectionItemForm from "@/components/admin/CollectionItemForm";

export async function generateMetadata({ params }) {
  const { table } = await params;
  const schema = COLLECTIONS[table];
  return { title: schema ? `New ${schema.label.replace(/s$/, "")} — KARANA Admin` : "KARANA Admin" };
}

export default async function NewCollectionItemPage({ params }) {
  const { table } = await params;
  const schema = COLLECTIONS[table];
  if (!schema) notFound();

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>New {schema.label.replace(/s$/, "")}</h1>
      </header>
      <CollectionItemForm tableKey={table} fields={schema.fields} item={null} />
    </div>
  );
}
