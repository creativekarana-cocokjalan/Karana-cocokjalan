"use client";

import { signOut } from "@/app/actions/auth";
import { useTransition } from "react";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="admin-btn admin-btn--ghost admin-sidebar__logout"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
