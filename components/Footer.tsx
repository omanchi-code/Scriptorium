import Link from "next/link";

const LINKS = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Blog", href: "/blog" },
  { label: "Evidence Library", href: "/evidence-library" },
  { label: "AI Studio", href: "/studio" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Resources", href: "/resources" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="hairline mt-24">
      <div className="container-page py-14 grid gap-10 sm:grid-cols-2">
        <div>
          <p className="font-display text-2xl mb-3">Scriptorium</p>
          <p className="text-ink-dim max-w-prose text-sm leading-relaxed">
            The digital publishing platform of Omanchi-Job Agbo. To publish
            ideas with clarity, preserve knowledge with integrity, and
            connect readers through evidence-driven writing.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 sm:justify-end sm:content-start">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="bracket-link">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="hairline">
        <div className="container-page py-5 flex flex-col sm:flex-row gap-2 justify-between text-xs text-ink-dim font-mono">
          <span>© {new Date().getFullYear()} Omanchi-Job Agbo</span>
          <span>Built with the Scriptorium platform</span>
        </div>
      </div>
    </footer>
  );
}
