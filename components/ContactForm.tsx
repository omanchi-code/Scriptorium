"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // NOTE: no backend connected yet — wire this up to an email
    // service (e.g. Resend, Formspree) or an API route when ready.
    setSent(true);
  }

  if (sent) {
    return (
      <p className="font-mono text-sm text-brass max-w-prose">
        Message sent. You&rsquo;ll hear back soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <div>
        <label htmlFor="name" className="eyebrow block mb-2">
          Name
        </label>
        <input
          id="name"
          required
          className="w-full bg-transparent border border-rule px-4 py-3 text-ink focus:border-brass outline-none transition-colors duration-300"
        />
      </div>
      <div>
        <label htmlFor="email" className="eyebrow block mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className="w-full bg-transparent border border-rule px-4 py-3 text-ink focus:border-brass outline-none transition-colors duration-300"
        />
      </div>
      <div>
        <label htmlFor="message" className="eyebrow block mb-2">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          className="w-full bg-transparent border border-rule px-4 py-3 text-ink focus:border-brass outline-none transition-colors duration-300 resize-none"
        />
      </div>
      <button type="submit" className="bracket-link">
        Send message
      </button>
    </form>
  );
}
