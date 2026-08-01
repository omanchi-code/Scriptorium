import StudioLayout from "@/domains/studio/components/StudioLayout";
import StudioHistory from "@/domains/studio/components/StudioHistory";
import SignOutButton from "@/components/SignOutButton";

export default function StudioPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <div className="flex items-start justify-between gap-6 mb-5">
        <p className="eyebrow">AI Studio</p>
        <SignOutButton />
      </div>
      <h1 className="font-display text-5xl sm:text-6xl mb-8 max-w-2xl">
        One chapter. Every format.
      </h1>
      <p className="max-w-prose text-lg leading-relaxed text-ink/90 mb-12">
        Paste a chapter below and generate its evidence cards, its own blog
        article, social scripts, a podcast read, a newsletter announcement,
        SEO metadata, key art, and a trailer &mdash; all from a single
        source. The Studio handles the rest.
      </p>

      <StudioLayout />
      <StudioHistory />
    </div>
  );
}
