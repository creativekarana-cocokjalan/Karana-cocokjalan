"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";

const initialState = { error: null };

export default function LoginForm({ next }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="admin-form">
      <input type="hidden" name="next" value={next} />

      <label className="admin-field">
        <span>Email</span>
        <input type="email" name="email" required autoComplete="username" />
      </label>

      <label className="admin-field">
        <span>Password</span>
        <input type="password" name="password" required autoComplete="current-password" />
      </label>

      {state?.error ? <p className="admin-form__error">{state.error}</p> : null}

      <button type="submit" className="admin-btn admin-btn--primary" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <Link href="/admin/forgot-password" className="admin-auth__link">
        Forgot password?
      </Link>
    </form>
  );
}
