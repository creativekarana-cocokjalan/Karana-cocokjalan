import { listMedia, deleteMedia } from "@/app/actions/media";
import MediaUploadWidget from "@/components/admin/MediaUploadWidget";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Media library — KARANA Admin" };

function isVideo(name) {
  return /\.(mp4|webm|mov|m4v)$/i.test(name);
}

function formatSize(bytes) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default async function MediaLibraryPage() {
  let files = [];
  let loadError = null;
  try {
    files = await listMedia();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Couldn't load the media library.";
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Media library</h1>
        <p>Every image and video you've uploaded through the admin. Upload here, then copy a URL into any field — or upload directly from a content form.</p>
      </header>

      <MediaUploadWidget />

      {loadError ? (
        <p className="admin-form__error">{loadError}</p>
      ) : files.length === 0 ? (
        <p className="admin-empty">No media uploaded yet.</p>
      ) : (
        <div className="admin-media-grid">
          {files.map((f) => (
            <div key={f.name} className="admin-media-grid__item">
              {isVideo(f.name) ? (
                <video src={f.url} className="admin-media-grid__thumb" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt="" className="admin-media-grid__thumb" />
              )}
              <p className="admin-media-grid__name" title={f.name}>
                {f.name}
              </p>
              <p className="admin-media-grid__meta">{formatSize(f.size)}</p>
              <div className="admin-media-grid__actions">
                <input type="text" readOnly value={f.url} onFocus={(e) => e.target.select()} />
                <DeleteButton action={deleteMedia.bind(null, f.name)} confirmLabel={`Delete "${f.name}"? This can't be undone.`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
