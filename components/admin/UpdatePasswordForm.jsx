"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/actions/auth";

const initialState = { error: null };

export default function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} className="admin-form">
      <label className="admin-field">
        <span>New password</span>
        <input type="password" name="password" required minLength={6} autoComplete="new-password" />
      </label>

      <label className="admin-field">
        <span>Confirm new password</span>
        <input type="password" name="confirmPassword" required minLength={6} autoComplete="new-password" />
      </label>

      {state?.error ? <p className="admin-form__error">{state.error}</p> : null}

      <button type="submit" className="admin-btn admin-btn--primary" disabled={pending}>
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
