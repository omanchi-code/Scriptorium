import { SAMPLE_CHAPTERS } from "@/domains/books/sample-chapters";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return SAMPLE_CHAPTERS.map((s) => ({ slug: s.bookSlug }));
}

export default function SampleChapterPage({ params }: { params: { slug: string } }) {
  const sample = SAMPLE_CHAPTERS.find((s) => s.bookSlug === params.slug);
  if (!sample) return notFound();

  return (
    <div className="container-page py-16 sm:py-24 max-w-prose">
      <Link href={`/books/${sample.bookSlug}`} className="bracket-link mb-12 inline-block">
        Back to book
      </Link>

      <p className="eyebrow mb-3">Free Sample</p>
      <h1 className="font-display text-4xl sm:text-6xl leading-tight mb-3">
        {sample.bookTitle}
      </h1>
      <p className="font-display italic text-xl text-ink-dim mb-12">
        {sample.bookSubtitle}
      </p>

      <blockquote className="border-l-2 border-brass pl-6 mb-16">
        <p className="font-display italic text-xl leading-relaxed text-ink/90 mb-2">
          {sample.epigraph}
        </p>
        <p className="eyebrow">{sample.epigraphAttribution}</p>
      </blockquote>

      <div className="text-lg leading-relaxed text-ink/90">
        {sample.blocks.map((block, i) => {
          if (block.type === "heading") {
            return (
              <h2 key={i} className="font-display text-3xl mt-16 mb-6">
                {block.text}
              </h2>
            );
          }
          if (block.type === "subheading") {
            return (
              <h3 key={i} className="font-display text-2xl mt-10 mb-4">
                {block.text}
              </h3>
            );
          }
          if (block.type === "citation") {
            return (
              <div key={i} className="border-l-2 border-brass pl-6 my-8">
                <p className="eyebrow mb-2">{block.label}</p>
                <p className="font-display italic text-ink/90">"{block.body}"</p>
              </div>
            );
          }
          return (
            <p key={i} className="mb-6">
              {block.text}
            </p>
          );
        })}
      </div>

      <div className="hairline mt-16 pt-10">
        <p className="text-ink-dim mb-6">Want the rest of the book?</p>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <Link href="/newsletter" className="bracket-link">
            Get notified of new releases
          </Link>
        </div>
      </div>
    </div>
  );
}
