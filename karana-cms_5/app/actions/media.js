"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET = "media";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You've been signed out — please log in again.");
}

/** Uploads one file (from a <input type="file"> via FormData) to the `media` storage bucket. */
export async function uploadMedia(formData) {
  try {
    await requireUser();
  } catch (e) {
    return { error: e.message };
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") return { error: "No file provided." };
  if (file.size > 50 * 1024 * 1024) return { error: "File is too large (50MB max)." };

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const safeBase =
    file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file";
  const path = `${Date.now()}-${safeBase}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) return { error: error.message };

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  revalidatePath("/admin/media");
  return { url: data.publicUrl, path };
}

/** Lists everything in the `media` storage bucket, newest first. */
export async function listMedia() {
  await requireUser();
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET).list("", {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error || !data) return [];
  return data
    .filter((f) => f.name && f.id)
    .map((f) => ({
      name: f.name,
      url: admin.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      size: f.metadata?.size ?? null,
      createdAt: f.created_at,
    }));
}

/** Permanently deletes one file from the `media` storage bucket. */
export async function deleteMedia(path) {
  await requireUser();
  const admin = createAdminClient();
  await admin.storage.from(BUCKET).remove([path]);
  revalidatePath("/admin/media");
}
