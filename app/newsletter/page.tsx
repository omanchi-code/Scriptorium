import NewsletterForm from "@/components/NewsletterForm";

export default function NewsletterPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">Newsletter</p>
      <h1 className="font-display text-5xl sm:text-6xl mb-8 max-w-2xl">
        New writing, sent plainly.
      </h1>
      <p className="max-w-prose text-lg leading-relaxed text-ink/90 mb-12">
        One email when there&rsquo;s something worth reading &mdash; new
        chapters, essays, and evidence cards. No noise in between, and you
        can leave any time.
      </p>

      <NewsletterForm />
    </div>
  );
}
