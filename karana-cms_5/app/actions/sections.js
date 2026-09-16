"use server";

import { createClient } from "@/lib/supabase/server";
import { SECTIONS } from "@/lib/adminSchema";
import { revalidatePath } from "next/cache";

/** Saves one singleton content section (hero, intro, about, moment, contact, site). */
export async function updateSection(sectionId, prevState, formData) {
  const schema = SECTIONS[sectionId];
  if (!schema) return { error: "Unknown section." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You've been signed out — please log in again." };

  const data = {};
  for (const field of schema.fields) {
    data[field.key] = String(formData.get(field.key) ?? "");
  }

  const { error } = await supabase
    .from("sections")
    .upsert({ id: sectionId, data, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/admin/section/${sectionId}`);
  return { success: true, savedAt: Date.now() };
}
