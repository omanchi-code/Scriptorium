import { CATEGORIES } from "@/domains/knowledge/taxonomy";
import { BLOG_POSTS } from "@/domains/blog/posts";
import Link from "next/link";

export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const active = CATEGORIES.find((c) => c.slug === searchParams.category);
  const posts = active ? BLOG_POSTS.filter((p) => p.category === active.slug) : BLOG_POSTS;

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
                  {cat.label} ({BLOG_POSTS.filter((p) => p.category === cat.slug).length})
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hairline pt-10 lg:border-t-0 lg:pt-0">
          {posts.length === 0 ? (
            <p className="text-ink-dim leading-relaxed max-w-prose">
              No essays published in this category yet.
            </p>
          ) : (
            <ul className="space-y-10">
              {posts.map((post) => (
                <li key={post.slug} className="hairline pt-8 first:pt-0 first:border-0">
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h2 className="font-display text-2xl group-hover:text-brass transition-colors duration-300 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-ink-dim text-sm leading-relaxed">{post.excerpt}</p>
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
