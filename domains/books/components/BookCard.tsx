import Link from "next/link";
import Card from "@/components/ui/Card";
import type { Book } from "../data";

export default function BookCard({
  book,
  variant = "card",
}: {
  book: Book;
  variant?: "card" | "row";
}) {
  if (variant === "row") {
    return (
      <Link
        href={`/books/${book.slug}`}
        className="group grid sm:grid-cols-[8rem_1fr_auto] gap-4 sm:gap-10 items-baseline py-8 hairline"
      >
        <span className="font-mono text-xs text-ink-dim uppercase tracking-widest2">
          {book.genre}
        </span>
        <div>
          <h2 className="font-display text-3xl sm:text-4xl mb-2 group-hover:text-brass transition-colors duration-300">
            {book.title}
          </h2>
          <p className="text-ink-dim text-sm max-w-prose leading-relaxed">{book.blurb}</p>
        </div>
        <span className="font-mono text-xs text-ink-dim">{book.status}</span>
      </Link>
    );
  }

  return (
    <Card href={`/books/${book.slug}`} className="p-8 sm:p-10 justify-between min-h-[16rem]">
      <div>
        <p className="eyebrow mb-4">{book.genre}</p>
        <h3 className="font-display text-3xl sm:text-4xl leading-tight mb-3 group-hover:text-brass transition-colors duration-300">
          {book.title}
        </h3>
        <p className="text-ink-dim text-sm leading-relaxed max-w-sm">{book.blurb}</p>
      </div>
      <span className="font-mono text-xs text-ink-dim mt-8 group-hover:text-brass transition-colors duration-300">
        Read more &rarr;
      </span>
    </Card>
  );
}
