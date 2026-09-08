import { BOOK_REVIEWS } from "@/domains/book-reviews/reviews";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";

export function generateStaticParams() {
  return BOOK_REVIEWS.map((review) => ({ slug: review.slug }));
}

function renderContent(raw: string) {
  const blocks = raw.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return <h2 key={i} className="font-display text-3xl mt-12 mb-4">{block.slice(3)}</h2>;
    }
    if (block.startsWith("# ")) {
      return <p key={i} className="font-display italic text-2xl text-ink-dim mb-8">{block.slice(2)}</p>;
    }
    if (block.trim() === "---") {
      return <hr key={i} className="border-rule my-10" />;
    }
    const parts = block.split(/(\*[^*]+\*|https?:\/\/\S+)/g).filter(Boolean);
    return (
      <p key={i} className="mb-6">
        {parts.map((part, j) => {
          if (part.startsWith("*") && part.endsWith("*")) return <em key={j}>{part.slice(1, -1)}</em>;
          if (part.startsWith("http")) {
            const clean = part.replace(/[.,]$/, "");
            return <a key={j} href={clean} className="text-brass underline underline-offset-4">{clean}</a>;
          }
          return <Fragment key={j}>{part}</Fragment>;
        })}
      </p>
    );
  });
}

export default function BookReviewPage({ params }: { params: { slug: string } }) {
  const review = BOOK_REVIEWS.find((r) => r.slug === params.slug);
  if (!review) return notFound();

  return (
    <div className="container-page py-16 sm:py-24 max-w-prose">
      <Link href="/book-reviews" className="bracket-link mb-12 inline-block">
        All reviews
      </Link>
      <p className="eyebrow mb-5">{review.publishedAt}</p>
      <h1 className="font-display text-4xl sm:text-6xl leading-tight mb-3">
        {review.bookTitle}
      </h1>
      <p className="eyebrow mb-10">by {review.bookAuthor}</p>
      <div className="text-lg leading-relaxed text-ink/90">
        {renderContent(review.content)}
      </div>
    </div>
  );
  }
