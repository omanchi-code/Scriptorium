import { CATEGORIES } from "@/domains/knowledge/taxonomy";
import { BOOK_REVIEWS } from "@/domains/book-reviews/reviews";
import Link from "next/link";

export default function BookReviewsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const active = CATEGORIES.find((c) => c.slug === searchParams.category);
  const reviews = active ? BOOK_REVIEWS.filter((r) => r.category === active.slug) : BOOK_REVIEWS;

  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">Book Reviews</p>
      <h1 className="font-display text-5xl sm:text-6xl mb-16">
        {active ? active.label : "Reviews and recommendations."}
      </h1>

      <div className="grid lg:grid-cols-[16rem_1fr] gap-12">
        <nav className="hairline lg:border-t-0">
          <p className="eyebrow mb-4 hidden lg:block">Categories</p>
          <ul>
            <li className="hairline lg:border-t-0">
              <Link
                href="/book-reviews"
                className={`block py-3 font-display text-lg transition-colors duration-300 ${
                  !active ? "text-brass" : "hover:text-brass"
                }`}
              >
                All reviews
              </Link>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.slug} className="hairline">
                <Link
                  href={`/book-reviews?category=${cat.slug}`}
                  className={`block py-3 font-display text-lg transition-colors duration-300 ${
                    active?.slug === cat.slug ? "text-brass" : "hover:text-brass"
                  }`}
                >
                  {cat.label} ({BOOK_REVIEWS.filter((r) => r.category === cat.slug).length})
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hairline pt-10 lg:border-t-0 lg:pt-0">
          {reviews.length === 0 ? (
            <p className="text-ink-dim leading-relaxed max-w-prose">
              No reviews published in this category yet.
            </p>
          ) : (
            <ul className="space-y-10">
              {reviews.map((review) => (
                <li key={review.slug} className="hairline pt-8 first:pt-0 first:border-0">
                  <Link href={`/book-reviews/${review.slug}`} className="group block">
                    <h2 className="font-display text-2xl group-hover:text-brass transition-colors duration-300 mb-1">
                      {review.bookTitle}
                    </h2>
                    <p className="eyebrow mb-3">by {review.bookAuthor}</p>
                    <p className="text-ink-dim text-sm leading-relaxed">{review.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
