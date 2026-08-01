const CHANNELS = [
  { label: "Video", detail: "Book trailers, talks, and short-form video." },
  { label: "Podcast", detail: "Audio essays and conversations." },
  { label: "Press", detail: "Interviews and features." },
];

export default function MediaPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">Media</p>
      <h1 className="font-display text-5xl sm:text-6xl mb-16 max-w-2xl">
        Watch, listen, read about.
      </h1>

      <div className="grid sm:grid-cols-3 gap-px bg-rule">
        {CHANNELS.map((c) => (
          <div key={c.label} className="bg-vellum p-8 min-h-[12rem] flex flex-col justify-between">
            <h2 className="font-display text-2xl mb-3">{c.label}</h2>
            <p className="text-ink-dim text-sm leading-relaxed">{c.detail}</p>
            <p className="font-mono text-xs text-ink-dim mt-8">Nothing published yet</p>
          </div>
        ))}
      </div>
    </div>
  );
}
