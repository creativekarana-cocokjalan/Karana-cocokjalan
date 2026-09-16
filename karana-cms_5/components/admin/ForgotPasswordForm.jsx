"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";

const initialState = { error: null, success: false };

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state?.success) {
    return (
      <div className="admin-form">
        <p className="admin-form__success">
          If an account exists for that email, a reset link is on its way. Check your inbox (and spam folder).
        </p>
        <Link href="/admin/login" className="admin-auth__link">
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="admin-form">
      <label className="admin-field">
        <span>Email</span>
        <input type="email" name="email" required autoComplete="username" />
      </label>

      {state?.error ? <p className="admin-form__error">{state.error}</p> : null}

      <button type="submit" className="admin-btn admin-btn--primary" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </button>

      <Link href="/admin/login" className="admin-auth__link">
        ← Back to sign in
      </Link>
    </form>
  );
}
