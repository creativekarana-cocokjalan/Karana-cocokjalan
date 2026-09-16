"use client";

export default function DeleteButton({ action, confirmLabel = "Delete this item?" }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmLabel)) e.preventDefault();
      }}
    >
      <button type="submit" className="admin-btn admin-btn--danger admin-btn--sm">
        Delete
      </button>
    </form>
  );
}
