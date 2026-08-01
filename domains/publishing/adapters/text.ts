import { OUTPUTS, OutputKind } from "@/domains/knowledge/asset-kinds";
import { MissingApiKeyError } from "@/domains/publishing/providers/anthropic";
import { EngineContext, GenerationResult, KnowledgeAssetInput, OutputAdapter } from "../types";

function chapterHeader(input: KnowledgeAssetInput) {
  return `Chapter title: ${input.chapterTitle || "Untitled chapter"}\n\nChapter text:\n"""\n${input.chapterText}\n"""\n\n`;
}

/** Every text output is "how do we transform this chapter into X" — the
 * prompt is the entire difference between them. Everything else
 * (calling Claude, turning a missing key into a clear error, returning
 * the right shape) is identical, so it lives here once. */
function createTextAdapter(
  kind: OutputKind,
  buildPrompt: (input: KnowledgeAssetInput) => string,
  maxTokens = 1024
): OutputAdapter {
  return {
    kind,
    isAvailable: () => Boolean(process.env.ANTHROPIC_API_KEY),
    generate: async (input: KnowledgeAssetInput, ctx: EngineContext): Promise<GenerationResult> => {
      try {
        const content = await ctx.callClaude(buildPrompt(input), maxTokens);
        return { status: "done", content };
      } catch (err) {
        if (err instanceof MissingApiKeyError) {
          return { status: "error", error: err.message, httpStatus: 500 };
        }
        return {
          status: "error",
          error: err instanceof Error ? err.message : "Generation failed.",
          httpStatus: 502,
        };
      }
    },
  };
}

export const evidenceCardsAdapter = createTextAdapter(
  "evidence_cards",
  (input) =>
    chapterHeader(input) +
    "List the factual, scriptural, or historical claims made in this chapter. " +
    "For each claim, produce an evidence card with: the claim (one sentence), " +
    "the type of source that would support it (e.g. scripture reference, historical " +
    "record, data source), and a note on what a reader should look up to verify it. " +
    "Do not invent citations you cannot support from the text itself — where the " +
    "chapter doesn't specify a source, say so explicitly. Format as a numbered list."
);

export const blogArticleAdapter = createTextAdapter(
  "blog_article",
  (input) =>
    chapterHeader(input) +
    "Adapt this chapter into a standalone blog article of about 500-700 words. " +
    "It should work for a reader who hasn't read the book: give it its own hook, " +
    "argument, and conclusion. Match a clear, direct, non-academic voice. Return " +
    "the article with a headline on the first line."
);

export const youtubeShortAdapter = createTextAdapter(
  "youtube_short",
  (input) =>
    chapterHeader(input) +
    "Write a script for a vertical YouTube Short (under 60 seconds spoken, " +
    "roughly 130-150 words) based on this chapter's central idea. Include brief " +
    "on-screen text cues in brackets."
);

export const instagramReelAdapter = createTextAdapter(
  "instagram_reel",
  (input) =>
    chapterHeader(input) +
    "Write a script for a 30-45 second Instagram Reel based on this chapter. " +
    "Include on-screen text cues in brackets and a caption with 3-5 relevant " +
    "hashtags at the end."
);

export const facebookPostAdapter = createTextAdapter(
  "facebook_post",
  (input) =>
    chapterHeader(input) +
    "Write a Facebook post (100-150 words) sharing the central idea of this " +
    "chapter, written to prompt discussion in the comments. End with a question."
);

export const podcastScriptAdapter = createTextAdapter(
  "podcast_script",
  (input) =>
    chapterHeader(input) +
    "Write a 2-3 minute solo podcast narration script adapting this chapter for " +
    "audio. Write it to be read aloud: short sentences, natural spoken rhythm, a " +
    "brief intro and outro."
);

export const newsletterAdapter = createTextAdapter(
  "newsletter",
  (input) =>
    chapterHeader(input) +
    "Write a short newsletter email (150-200 words) announcing this chapter to " +
    "subscribers. Include a subject line on the first line, then the body. Warm, " +
    "direct tone, one clear call to action to read the full chapter."
);

export const seoMetadataAdapter = createTextAdapter(
  "seo_metadata",
  (input) =>
    chapterHeader(input) +
    "Generate SEO metadata for a web page built from this chapter: a title tag " +
    "(under 60 characters), a meta description (under 155 characters), and 6-10 " +
    "relevant keywords/phrases. Label each clearly."
);

// Sanity check that every text kind declared in domains/knowledge/asset-kinds.ts has an
// adapter here — catches drift between the UI-facing list and the Engine
// at import time rather than silently at request time.
const TEXT_ADAPTERS = [
  evidenceCardsAdapter,
  blogArticleAdapter,
  youtubeShortAdapter,
  instagramReelAdapter,
  facebookPostAdapter,
  podcastScriptAdapter,
  newsletterAdapter,
  seoMetadataAdapter,
];

for (const kind of TEXT_ADAPTERS.map((a) => a.kind)) {
  const def = OUTPUTS.find((o) => o.kind === kind);
  if (!def) throw new Error(`Text adapter "${kind}" has no matching entry in domains/knowledge/asset-kinds.ts`);
}

export default TEXT_ADAPTERS;
