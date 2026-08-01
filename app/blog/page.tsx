import { CATEGORIES } from "@/domains/knowledge/taxonomy";
import Link from "next/link";

export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const active = CATEGORIES.find((c) => c.slug === searchParams.category);

  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">Blog</p>
      <h1 className="font-display text-5xl sm:text-6xl mb-16">
        {active ? active.label : "Essays and evidence."}
      </h1>

      <div className="grid lg:grid-cols-[16rem_1fr] gap-12">
        <nav className="hairline lg:border-t-0">
          <p className="eyebrow mb-4 hidden lg:block">Categories</p>
          <ul>
            <li className="hairline lg:border-t-0">
              <Link
                href="/blog"
                className={`block py-3 font-display text-lg transition-colors duration-300 ${
                  !active ? "text-brass" : "hover:text-brass"
                }`}
              >
                All posts
              </Link>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.slug} className="hairline">
                <Link
                  href={`/blog?category=${cat.slug}`}
                  className={`block py-3 font-display text-lg transition-colors duration-300 ${
                    active?.slug === cat.slug ? "text-brass" : "hover:text-brass"
                  }`}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hairline pt-10 lg:border-t-0 lg:pt-0">
          <p className="text-ink-dim leading-relaxed max-w-prose mb-2">
            {active
              ? active.description
              : "No essays published yet. New writing in Biblical Studies, Theology, Economics & Public Policy, Business & Leadership, Psychology, and Fiction Worth Reading will appear here first."}
          </p>
          <p className="font-mono text-xs text-ink-dim mt-8">
            Want to know the moment something new goes up?{" "}
            <Link href="/newsletter" className="text-brass underline underline-offset-4">
              Subscribe to the newsletter
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
