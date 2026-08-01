"use client";

import { useState, FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // NOTE: no backend connected yet — wire this up to your email
    // provider (e.g. ConvertKit, Buttondown, Resend) when ready.
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <p className="font-mono text-sm text-brass max-w-prose">
        You&rsquo;re on the list. Confirm the email we just sent to {email}.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 max-w-lg"
    >
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 bg-transparent border border-rule px-4 py-3 text-ink placeholder:text-ink-dim focus:border-brass outline-none transition-colors duration-300"
      />
      <button type="submit" className="bracket-link justify-center px-2">
        Subscribe
      </button>
    </form>
  );
}
