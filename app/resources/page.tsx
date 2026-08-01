const RESOURCES = [
  { label: "Study guide — The Sonship of Jesus", format: "PDF", status: "Coming soon" },
  { label: "Reading group discussion questions — Sequins & Surrender", format: "PDF", status: "Coming soon" },
  { label: "Evidence card template", format: "PDF", status: "Coming soon" },
];

export default function ResourcesPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">Resources</p>
      <h1 className="font-display text-5xl sm:text-6xl mb-8 max-w-2xl">
        Downloadable materials.
      </h1>
      <p className="max-w-prose text-lg leading-relaxed text-ink/90 mb-16">
        Study guides, discussion questions, and companion documents for
        readers, book clubs, and study groups.
      </p>

      <div className="hairline">
        {RESOURCES.map((r) => (
          <div
            key={r.label}
            className="hairline grid sm:grid-cols-[1fr_6rem_9rem] gap-4 items-baseline py-6"
          >
            <span className="font-display text-xl">{r.label}</span>
            <span className="font-mono text-xs text-ink-dim">{r.format}</span>
            <span className="font-mono text-xs text-ink-dim">{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
