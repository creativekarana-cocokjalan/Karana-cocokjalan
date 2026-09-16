"use client";

import { useState, useTransition } from "react";
import { uploadMedia } from "@/app/actions/media";

export default function MediaField({ name, label, kind = "image", defaultValue = "" }) {
  const [url, setUrl] = useState(defaultValue || "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const accept = kind === "video" ? "video/*" : "image/*";

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const res = await uploadMedia(fd);
      if (res?.error) setError(res.error);
      else if (res?.url) setUrl(res.url);
    });
  }

  return (
    <div className="admin-field admin-field--media">
      <span>{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="admin-media-preview-wrap">
        {url ? (
          kind === "video" ? (
            <video src={url} controls className="admin-media-preview" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="admin-media-preview" />
          )
        ) : (
          <p className="admin-field__empty">No {kind} selected.</p>
        )}
      </div>

      <div className="admin-field__row">
        <label className="admin-btn admin-btn--ghost admin-file-btn">
          {pending ? "Uploading…" : url ? "Replace" : "Upload"}
          <input type="file" accept={accept} onChange={handleFile} disabled={pending} hidden />
        </label>
        {url ? (
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setUrl("")} disabled={pending}>
            Remove
          </button>
        ) : null}
      </div>

      {error ? <p className="admin-form__error">{error}</p> : null}

      <details className="admin-field__manual">
        <summary>Or paste a URL</summary>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="admin-field__manual-input"
        />
      </details>
    </div>
  );
}
