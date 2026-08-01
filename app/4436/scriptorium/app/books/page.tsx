import { BOOKS } from "@/domains/books/data";
import BookCard from "@/domains/books/components/BookCard";

export default function BooksPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">Books</p>
      <h1 className="font-display text-5xl sm:text-6xl mb-16">
        The complete catalogue.
      </h1>

      <div className="hairline">
        {BOOKS.map((book) => (
          <BookCard key={book.slug} book={book} variant="row" />
        ))}

        <div className="py-8 flex items-baseline justify-between text-ink-dim">
          <span className="font-display text-2xl italic">Future titles</span>
          <span className="font-mono text-xs">In progress</span>
        </div>
      </div>
    </div>
  );
}
