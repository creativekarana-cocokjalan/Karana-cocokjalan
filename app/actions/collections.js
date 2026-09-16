"use server";

import { createClient } from "@/lib/supabase/server";
import { COLLECTIONS } from "@/lib/adminSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function coerceValue(field, formData) {
  if (field.type === "checkbox") {
    return formData.get(field.key) === "on";
  }
  if (field.type === "number") {
    const raw = formData.get(field.key);
    const n = Number(raw);
    return Number.isFinite(n) ? n : field.default ?? 0;
  }
  const raw = formData.get(field.key);
  return raw === null ? "" : String(raw);
}

/** Creates or updates one row in a collection table (projects/services/locations/clients). */
export async function upsertItem(tableKey, prevState, formData) {
  const schema = COLLECTIONS[tableKey];
  if (!schema) return { error: "Unknown collection." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You've been signed out — please log in again." };

  const id = formData.get("id");
  const row = {};
  for (const field of schema.fields) {
    row[field.key] = coerceValue(field, formData);
  }

  if (schema.fields.some((f) => f.key === "slug" && f.required) && !row.slug) {
    return { error: "Slug is required." };
  }

  let error;
  if (id) {
    ({ error } = await supabase.from(schema.table).update(row).eq("id", id));
  } else {
    ({ error } = await supabase.from(schema.table).insert(row));
  }

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/admin/collection/${tableKey}`);
  redirect(`/admin/collection/${tableKey}`);
}

/** Deletes one row from a collection table. */
export async function deleteItem(tableKey, id) {
  const schema = COLLECTIONS[tableKey];
  if (!schema) throw new Error("Unknown collection.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You've been signed out — please log in again.");

  await supabase.from(schema.table).delete().eq("id", id);

  revalidatePath("/");
  revalidatePath(`/admin/collection/${tableKey}`);
}
