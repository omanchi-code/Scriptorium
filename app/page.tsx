import Link from "next/link";
import { BOOKS } from "@/domains/books/data";
import BookCard from "@/domains/books/components/BookCard";
import { CATEGORIES } from "@/domains/knowledge/taxonomy";
import TransformationDiagram from "@/domains/publishing/components/TransformationDiagram";
import { BLOG_POSTS } from "@/domains/blog/posts";

const WORKFLOW = ["Research", "Writing", "Publishing", "Media", "Learning", "Impact"];

const FOUNDER_ROLES = ["Founder", "Author", "Economist", "Researcher", "Bible Teacher"];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="container-page pt-20 sm:pt-32 pb-16 sm:pb-24">
        <p className="eyebrow mb-6">Welcome to Scriptorium</p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] mb-8 max-w-4xl">
          The AI Operating System for Evidence&#8209;Driven Publishing
        </h1>
        <p className="font-display text-2xl sm:text-3xl leading-snug text-ink-dim mb-8 max-w-3xl">
          Where research becomes books. Books become ideas. Ideas become
          impact.
        </p>
        <p className="max-w-prose text-lg leading-relaxed text-ink/90 mb-12">
          Scriptorium transforms rigorous research into books, articles,
          Evidence Cards, multimedia, educational resources, and enduring
          knowledge &mdash; preserving one body of work across every
          meaningful publishing format.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <a href="#how-it-works" className="bracket-link text-base">
            How Scriptorium Works
          </a>
          <Link href="/evidence-library" className="bracket-link text-base">
            Enter the Evidence Library
          </Link>
        </div>
      </section>

      {/* IDENTITY — one consolidated narrative, no keyword list */}
      <section className="hairline">
        <div className="container-page py-16 sm:py-24">
          <p className="eyebrow mb-5">What Scriptorium Is</p>
          <p className="max-w-prose text-lg leading-relaxed text-ink/90 mb-6">
            Scriptorium combines a research repository, an Evidence
            Library, a publishing workflow, and a multimedia studio into
            one cohesive platform designed for evidence&#8209;driven
            authors. Not a blog, and not a features list &mdash; an
            operating system for research to become a lasting, published
            body of work.
          </p>
          <p className="max-w-prose text-lg leading-relaxed text-ink-dim">
            Every book, article, Evidence Card, podcast, video, and
            educational resource begins from the same source of truth
            &mdash; your original research. Knowledge is not duplicated
            here. It is transformed.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="hairline scroll-mt-16">
        <div className="container-page py-16 sm:py-24">
          <p className="eyebrow mb-5">How It Works</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-14 leading-tight max-w-2xl">
            From research to impact.
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-stretch">
            {WORKFLOW.map((step, i) => (
              <div key={step} className="flex sm:flex-1 items-center">
                <div className="flex flex-col py-4 sm:py-0">
                  <span className="font-mono text-xs text-ink-dim mb-2">
                    0{i + 1}
                  </span>
                  <span className="font-display text-2xl sm:text-xl">{step}</span>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden sm:flex flex-1 items-center justify-center text-brass text-lg px-2"
                  >
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONE CHAPTER. INFINITE POSSIBILITIES. — Scriptorium's signature interactive experience */}
      <section className="hairline">
        <div className="container-page py-16 sm:py-24">
          <p className="eyebrow mb-5">The Transformation</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-14 leading-tight max-w-2xl">
            One chapter. Infinite possibilities.
          </h2>

          <TransformationDiagram />

          <p className="text-center font-display italic text-xl sm:text-2xl text-ink-dim mt-16 max-w-xl mx-auto">
            One carefully researched chapter can become an entire ecosystem
            of enduring knowledge.
          </p>
        </div>
      </section>

      {/* AI STUDIO — the engine that performs the transformation */}
      <section className="hairline">
        <div className="container-page py-16 sm:py-24">
          <p className="eyebrow mb-5">The Studio</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-5 leading-tight max-w-2xl">
            The engine behind the transformation.
          </h2>
          <p className="text-ink-dim leading-relaxed mb-8 max-w-prose">
            Every output above starts the same way: one chapter, generated
            into its evidence cards, its own article, social scripts, a
            podcast read, artwork, and a newsletter draft &mdash; from the
            source text, not written from scratch each time.
          </p>
          <Link href="/studio" className="bracket-link">
            Open the Studio
          </Link>
        </div>
      </section>

      {/* BOOKS */}
      <section className="hairline">
        <div className="container-page py-16 sm:py-24">
          <div className="flex items-baseline justify-between mb-10">
            <p className="eyebrow">Books</p>
            <Link href="/books" className="bracket-link">
              View all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-px bg-rule">
            {BOOKS.map((book) => (
              <BookCard key={book.slug} book={book} variant="card" />
            ))}
          </div>
        </div>
      </section>

      {/* BLOG CATEGORIES */}
      <section className="hairline">
        <div className="container-page py-16 sm:py-24">
          <div className="flex items-baseline justify-between mb-10">
            <p className="eyebrow">The Blog</p>
            <Link href="/blog" className="bracket-link">
              View all
            </Link>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug} className="hairline">
                <Link
                  href={`/blog?category=${cat.slug}`}
                  className="group flex items-center justify-between py-5"
                >
                  <span className="font-display text-xl group-hover:text-brass transition-colors duration-300">
                    {cat.label}
                  </span>
                  <span className="font-mono text-xs text-ink-dim">
                    {cat.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* EVIDENCE LIBRARY + NEWSLETTER */}
      <section className="hairline">
        <div className="container-page py-16 sm:py-24 grid gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-5">Evidence Library</p>
            <h2 className="font-display text-3xl sm:text-4xl mb-5 leading-tight">
              Claims worth their sources.
            </h2>
            <p className="text-ink-dim leading-relaxed mb-8 max-w-prose">
              Every argument in Scriptorium&rsquo;s writing traces back to a
              citation. The Evidence Library collects the scripture
              references, data, and sources behind each book and article in
              one searchable place.
            </p>
            <Link href="/evidence-library" className="bracket-link">
              Browse the Library
            </Link>
          </div>
          <div>
            <p className="eyebrow mb-5">Newsletter</p>
            <h2 className="font-display text-3xl sm:text-4xl mb-5 leading-tight">
              New writing, sent plainly.
            </h2>
            <p className="text-ink-dim leading-relaxed mb-8 max-w-prose">
              One email when there&rsquo;s something worth reading &mdash; new
              chapters, essays, and evidence cards. No noise in between.
            </p>
            <Link href="/newsletter" className="bracket-link">
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      {/* WHO CREATED IT — founder, introduced last, within the platform */}
      <section className="hairline">
        <div className="container-page py-16 sm:py-24">
          <p className="eyebrow mb-5">Who Created It</p>
          <h2 className="font-display text-4xl sm:text-5xl mb-6">
            Omanchi&#8209;Job Agbo
          </h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {FOUNDER_ROLES.map((role) => (
              <span key={role} className="tag-pill">
                {role}
              </span>
            ))}
          </div>
          <p className="max-w-prose text-lg leading-relaxed text-ink/90 mb-8">
            Omanchi&#8209;Job Agbo founded Scriptorium on the conviction that
            ideas deserve their sources, and that clarity is a form of
            respect for the reader. The platform is the outlet for that
            conviction &mdash; his research, argued in full, published in
            every form a reader might need it.
          </p>
          <Link href="/about" className="bracket-link">
            Read the Full Story
          </Link>
        </div>
      </section>
    </>
  );
}
