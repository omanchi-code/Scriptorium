"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/lib/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bracket-link disabled:opacity-40">
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginForm() {
  const [errorMessage, formAction] = useFormState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className="eyebrow block mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-transparent border border-rule px-4 py-3 text-ink focus:border-brass outline-none transition-colors duration-300"
        />
      </div>
      <div>
        <label htmlFor="password" className="eyebrow block mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full bg-transparent border border-rule px-4 py-3 text-ink focus:border-brass outline-none transition-colors duration-300"
        />
      </div>
      {errorMessage && (
        <p className="font-mono text-xs text-crimson">{errorMessage}</p>
      )}
      <SubmitButton />
    </form>
  );
}
