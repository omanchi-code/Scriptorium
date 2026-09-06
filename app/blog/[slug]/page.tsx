import { BLOG_POSTS } from "@/domains/blog/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

/** Minimal Markdown-ish formatter — no new dependency for just headers,
 * italics, a horizontal rule, and auto-linked URLs. */
function renderContent(raw: string) {
  const blocks = raw.trim().split(/\n\n+/);

  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display text-3xl mt-12 mb-4">
          {block.slice(3)}
        </h2>
      );
    }
    if (block.startsWith("# ")) {
      return (
        <p key={i} className="font-display italic text-2xl text-ink-dim mb-8">
          {block.slice(2)}
        </p>
      );
    }
    if (block.trim() === "---") {
      return <hr key={i} className="border-rule my-10" />;
    }

    const parts = block.split(/(\*[^*]+\*|https?:\/\/\S+)/g).filter(Boolean);
    return (
      <p key={i} className="mb-6">
        {parts.map((part, j) => {
          if (part.startsWith("*") && part.endsWith("*")) {
            return <em key={j}>{part.slice(1, -1)}</em>;
          }
          if (part.startsWith("http")) {
            const clean = part.replace(/[.,]$/, "");
            return (
              <a key={j} href={clean} className="text-brass underline underline-offset-4">
                {clean}
              </a>
            );
          }
          return <Fragment key={j}>{part}</Fragment>;
        })}
      </p>
    );
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <div className="container-page py-16 sm:py-24 max-w-prose">
      <Link href="/blog" className="bracket-link mb-12 inline-block">
        All essays
      </Link>
      <p className="eyebrow mb-5">{post.publishedAt}</p>
      <h1 className="font-display text-4xl sm:text-6xl leading-tight mb-10">
        {post.title}
      </h1>
      <div className="text-lg leading-relaxed text-ink/90">
        {renderContent(post.content)}
      </div>
    </div>
  );
    }
