import { notFound } from "next/navigation";
import { SECTIONS } from "@/lib/adminSchema";
import { getSections } from "@/lib/content";
import SectionForm from "@/components/admin/SectionForm";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const schema = SECTIONS[id];
  return { title: schema ? `${schema.label} — KARANA Admin` : "KARANA Admin" };
}

export default async function SectionEditorPage({ params }) {
  const { id } = await params;
  const schema = SECTIONS[id];
  if (!schema) notFound();

  const sections = await getSections();
  const values = sections[id] || {};

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>{schema.label}</h1>
        {schema.description ? <p>{schema.description}</p> : null}
      </header>

      <SectionForm sectionId={id} schema={schema} values={values} />
    </div>
  );
}
