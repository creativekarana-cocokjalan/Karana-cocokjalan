"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia } from "@/app/actions/media";

export default function MediaUploadWidget() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const router = useRouter();

  function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    setError(null);
    startTransition(async () => {
      for (const file of files) {
        const fd = new FormData();
        fd.set("file", file);
        const res = await uploadMedia(fd);
        if (res?.error) {
          setError(res.error);
          break;
        }
      }
      router.refresh();
    });
  }

  return (
    <div className="admin-upload-widget">
      <label className="admin-btn admin-btn--primary admin-file-btn">
        {pending ? "Uploading…" : "Upload files"}
        <input type="file" accept="image/*,video/*" multiple onChange={handleFiles} ref={inputRef} disabled={pending} hidden />
      </label>
      {error ? <p className="admin-form__error">{error}</p> : null}
    </div>
  );
}
