"use client";

import { useActionState } from "react";
import { upsertItem } from "@/app/actions/collections";
import MediaField from "@/components/admin/MediaField";

const initialState = { error: null };

export default function CollectionItemForm({ tableKey, fields, item }) {
  const boundAction = upsertItem.bind(null, tableKey);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="admin-form admin-form--section">
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}

      {fields.map((field) => {
        const raw = item ? item[field.key] : undefined;
        const value = raw ?? field.default ?? "";

        if (field.type === "textarea") {
          return (
            <label key={field.key} className="admin-field">
              <span>
                {field.label}
                {field.required ? " *" : ""}
              </span>
              <textarea name={field.key} defaultValue={value} rows={4} required={field.required} />
            </label>
          );
        }
        if (field.type === "image" || field.type === "video") {
          return (
            <MediaField key={field.key} name={field.key} label={field.label} kind={field.type} defaultValue={value} />
          );
        }
        if (field.type === "select") {
          return (
            <label key={field.key} className="admin-field">
              <span>{field.label}</span>
              <select name={field.key} defaultValue={value || field.default}>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          );
        }
        if (field.type === "checkbox") {
          return (
            <label key={field.key} className="admin-field admin-field--checkbox">
              <input type="checkbox" name={field.key} defaultChecked={raw === undefined ? field.default : Boolean(raw)} />
              <span>{field.label}</span>
            </label>
          );
        }
        if (field.type === "number") {
          return (
            <label key={field.key} className="admin-field">
              <span>{field.label}</span>
              <input type="number" name={field.key} defaultValue={value} />
            </label>
          );
        }
        return (
          <label key={field.key} className="admin-field">
            <span>
              {field.label}
              {field.required ? " *" : ""}
            </span>
            <input type="text" name={field.key} defaultValue={value} required={field.required} />
          </label>
        );
      })}

      {state?.error ? <p className="admin-form__error">{state.error}</p> : null}

      <div className="admin-form__actions">
        <button type="submit" className="admin-btn admin-btn--primary" disabled={pending}>
          {pending ? "Saving…" : item?.id ? "Save changes" : "Create"}
        </button>
      </div>
    </form>
  );
}
