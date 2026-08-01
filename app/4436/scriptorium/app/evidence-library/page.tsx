import { SOURCE_TYPES } from "@/domains/knowledge/sources";

export default function EvidenceLibraryPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">Evidence Library</p>
      <h1 className="font-display text-5xl sm:text-6xl mb-8 max-w-2xl">
        Claims worth their sources.
      </h1>
      <p className="max-w-prose text-lg leading-relaxed text-ink/90 mb-16">
        Every argument published under Scriptorium traces back to a
        citation. The Evidence Library is where those sources live &mdash;
        searchable, organized by book and topic, so readers can check the
        work themselves.
      </p>

      <div className="hairline">
        {SOURCE_TYPES.map((t) => (
          <div key={t.label} className="hairline grid sm:grid-cols-[14rem_1fr] gap-4 py-8">
            <h2 className="font-display text-2xl">{t.label}</h2>
            <p className="text-ink-dim leading-relaxed max-w-prose">
              {t.detail}
            </p>
          </div>
        ))}
      </div>

      <p className="font-mono text-xs text-ink-dim mt-10">
        The library is being built out alongside each book and essay.
        Evidence cards will appear here as they&rsquo;re published.
      </p>
    </div>
  );
}
