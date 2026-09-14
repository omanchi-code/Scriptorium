"use client";

import { useState, FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong. Try again.");
    }
  }

  if (status === "done") {
    return (
      <p className="font-mono text-sm text-brass max-w-prose">
        You're on the list — I'll be in touch when there's something new.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 bg-transparent border border-rule px-4 py-3 text-ink placeholder:text-ink-dim focus:border-brass outline-none transition-colors duration-300"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bracket-link justify-center px-2 disabled:opacity-40"
      >
        {status === "loading" ? "Joining…" : "Subscribe"}
      </button>
      {status === "error" && <p className="font-mono text-xs text-crimson">{error}</p>}
    </form>
  );
}
