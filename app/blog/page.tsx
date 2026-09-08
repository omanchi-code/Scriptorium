import { BLOG_POSTS } from "@/domains/blog/posts";
import Link from "next/link";

export default function ArticlesPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">Articles</p>
      <h1 className="font-display text-5xl sm:text-6xl mb-16">
        Original writing.
      </h1>

      {BLOG_POSTS.length === 0 ? (
        <p className="text-ink-dim leading-relaxed max-w-prose">
          Nothing published yet.
        </p>
      ) : (
        <ul className="hairline max-w-prose">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug} className="hairline py-8 first:border-0 first:pt-0">
              <Link href={`/blog/${post.slug}`} className="group block">
                <p className="eyebrow mb-3">{post.publishedAt}</p>
                <h2 className="font-display text-3xl group-hover:text-brass transition-colors duration-300 mb-3">
                  {post.title}
                </h2>
                <p className="text-ink-dim leading-relaxed">{post.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
