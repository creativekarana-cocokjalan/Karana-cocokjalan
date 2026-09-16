"use client";

import { useActionState } from "react";
import { updateSection } from "@/app/actions/sections";
import MediaField from "@/components/admin/MediaField";

const initialState = { error: null, success: false };

export default function SectionForm({ sectionId, schema, values }) {
  const boundAction = updateSection.bind(null, sectionId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="admin-form admin-form--section">
      {schema.fields.map((field) => {
        const value = values?.[field.key] ?? "";
        if (field.type === "textarea") {
          return (
            <label key={field.key} className="admin-field">
              <span>{field.label}</span>
              <textarea name={field.key} defaultValue={value} rows={4} />
            </label>
          );
        }
        if (field.type === "image" || field.type === "video") {
          return (
            <MediaField key={field.key} name={field.key} label={field.label} kind={field.type} defaultValue={value} />
          );
        }
        return (
          <label key={field.key} className="admin-field">
            <span>{field.label}</span>
            <input type="text" name={field.key} defaultValue={value} />
          </label>
        );
      })}

      {state?.error ? <p className="admin-form__error">{state.error}</p> : null}
      {state?.success ? <p className="admin-form__success">Saved.</p> : null}

      <div className="admin-form__actions">
        <button type="submit" className="admin-btn admin-btn--primary" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
