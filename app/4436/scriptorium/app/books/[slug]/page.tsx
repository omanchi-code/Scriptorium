import { BOOKS } from "@/domains/books/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return BOOKS.map((book) => ({ slug: book.slug }));
}

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = BOOKS.find((b) => b.slug === params.slug);
  if (!book) return notFound();

  return (
    <div className="container-page py-16 sm:py-24">
      <Link href="/books" className="bracket-link mb-12 inline-block">
        All books
      </Link>

      <p className="eyebrow mb-5">{book.genre}</p>
      <h1 className="font-display text-5xl sm:text-7xl leading-[0.95] mb-8 max-w-3xl">
        {book.title}
      </h1>
      <p className="max-w-prose text-lg leading-relaxed text-ink/90 mb-12">
        {book.description}
      </p>

      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-20">
        <span className="bracket-link pointer-events-none">
          {book.status}
        </span>
        <Link href="/evidence-library" className="bracket-link">
          View sources for this book
        </Link>
        <Link href="/newsletter" className="bracket-link">
          Get notified of new releases
        </Link>
      </div>

      <div className="hairline pt-10 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="eyebrow mb-3">Sample chapter</p>
          <p className="text-ink-dim leading-relaxed">
            Coming soon &mdash; a free excerpt will be available here.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Reader reviews</p>
          <p className="text-ink-dim leading-relaxed">
            No reviews published yet. Check back after launch.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Related reading</p>
          <p className="text-ink-dim leading-relaxed">
            Related blog posts will be linked here as they&rsquo;re published.
          </p>
        </div>
      </div>
    </div>
  );
}
