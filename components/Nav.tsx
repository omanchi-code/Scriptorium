"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const INDEX = [
  { n: "01", label: "Home", href: "/" },
  { n: "02", label: "About the Author", href: "/about" },
  { n: "03", label: "Books", href: "/books" },
  { n: "04", label: "Articles", href: "/blog" },
  { n: "05", label: "Book Reviews", href: "/book-reviews" },
  { n: "06", label: "Evidence Library", href: "/evidence-library" },
  { n: "07", label: "AI Studio", href: "/studio" },
  { n: "08", label: "Newsletter", href: "/newsletter" },
  { n: "09", label: "Resources", href: "/resources" },
  { n: "10", label: "Media", href: "/media" },
  { n: "11", label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-vellum/90 backdrop-blur border-b border-rule">
        <div className="container-page flex items-center justify-between h-16">
          <Link href="/" className="font-display text-lg tracking-tight">
            Scriptorium
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="bracket-link"
            aria-expanded={open}
            aria-controls="site-index"
          >
            Index
          </button>
        </div>
      </header>

      <div
        id="site-index"
        className={`fixed inset-0 z-50 bg-vellum transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-page h-full flex flex-col">
          <div className="flex items-center justify-between h-16 border-b border-rule">
            <span className="font-display text-lg">Scriptorium</span>
            <button onClick={() => setOpen(false)} className="bracket-link">
              Close
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-10 sm:py-14">
            <p className="eyebrow mb-8">Table of Contents</p>
            <ul>
              {INDEX.map((item) => (
                <li key={item.href} className="hairline">
                  <Link
                    href={item.href}
                    className="group flex items-baseline gap-4 sm:gap-8 py-4 sm:py-5"
                  >
                    <span className="font-mono text-xs text-ink-dim">{item.n}</span>
                    <span className="font-display text-3xl sm:text-5xl text-ink group-hover:text-brass transition-colors duration-300">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
