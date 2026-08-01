import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">About the Author</p>
      <h1 className="font-display text-5xl sm:text-7xl leading-[0.95] mb-8 max-w-2xl">
        Omanchi&#8209;Job Agbo
      </h1>

      <div className="flex flex-wrap gap-3 mb-10">
        {["Founder", "Author", "Economist", "Researcher", "Bible Teacher"].map((role) => (
          <span key={role} className="tag-pill">
            {role}
          </span>
        ))}
      </div>

      <div className="max-w-prose space-y-6 text-lg leading-relaxed text-ink/90">
        <p>
          Omanchi&#8209;Job Agbo writes at the intersection of theology,
          economics, leadership, and story &mdash; working from the
          conviction that ideas deserve their sources, and that clarity is a
          form of respect for the reader.
        </p>
        <p>
          Scriptorium is the home for that work: books, essays, and an
          evidence library that traces every claim back to where it came
          from, published for readers who want to think alongside the
          argument, not just be told the conclusion.
        </p>
      </div>

      <div className="hairline mt-16 pt-10 flex flex-wrap gap-x-8 gap-y-4">
        <Link href="/books" className="bracket-link">
          Read the books
        </Link>
        <Link href="/blog" className="bracket-link">
          Read the blog
        </Link>
        <Link href="/contact" className="bracket-link">
          Get in touch
        </Link>
      </div>
    </div>
  );
}
