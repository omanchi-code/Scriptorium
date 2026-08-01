import { parseJsonLoose, MissingApiKeyError } from "@/domains/publishing/providers/anthropic";
import { buildPollinationsImageUrl } from "@/domains/publishing/providers/pollinations";
import { EngineContext, GenerationResult, KnowledgeAssetInput, OutputAdapter } from "../types";

type ExtractedCard = {
  quote: string;
  principles: { word: string; rest: string }[];
  backgroundPrompt: string;
};

function buildExtractionPrompt(input: KnowledgeAssetInput) {
  return (
    `Chapter title: ${input.chapterTitle || "Untitled chapter"}\n\nChapter text:\n"""\n${input.chapterText}\n"""\n\n` +
    "You are extracting content for a branded 'Evidence Card' social graphic. " +
    "From the chapter text above:\n" +
    "1. Pick ONE compelling claim and phrase it as a short, punchy quote (8-14 words). " +
    "Wrap the 2-4 most important words in double asterisks so they can be styled " +
    "differently, e.g. \"A page **is not** the whole story.\"\n" +
    "2. Write exactly three short guiding principles as imperative fragments, each " +
    "split into a lead word and the rest, e.g. {\"word\":\"Read\",\"rest\":\"before.\"}.\n" +
    "3. Describe, in one sentence, a moody, photographic, text-free background scene " +
    "(objects/setting/lighting only — no words, no logos, no people's faces) that " +
    "visually evokes the claim.\n\n" +
    "Return ONLY valid JSON, no markdown fences, no commentary, matching exactly:\n" +
    '{"quote": string, "principles": [{"word": string, "rest": string}, {"word": string, "rest": string}, {"word": string, "rest": string}], "backgroundPrompt": string}'
  );
}

const evidenceCardImageAdapter: OutputAdapter = {
  kind: "evidence_card_image",
  isAvailable: () => Boolean(process.env.ANTHROPIC_API_KEY),
  generate: async (input: KnowledgeAssetInput, ctx: EngineContext): Promise<GenerationResult> => {
    try {
      const raw = await ctx.callClaude(buildExtractionPrompt(input), 512);

      let extracted: ExtractedCard;
      try {
        extracted = parseJsonLoose<ExtractedCard>(raw);
      } catch {
        return {
          status: "error",
          httpStatus: 502,
          error:
            "Claude's response wasn't valid JSON. Try regenerating — this occasionally happens with structured extraction.",
        };
      }

      const evidenceNumber = await ctx.nextEvidenceCardNumber();
      const backgroundImageUrl = buildPollinationsImageUrl(
        `${extracted.backgroundPrompt}, cinematic, moody lighting, amber and black tones, no text, no watermark, no logo`
      );

      const cardData = {
        evidenceNumber,
        bookLabel: input.bookLabel,
        chapterTitle: input.chapterTitle,
        quote: extracted.quote,
        principles: extracted.principles,
        backgroundImageUrl,
      };

      // This adapter needs its row's id before it can build the
      // mediaUrl, so it creates the draft itself rather than letting the
      // engine create it afterward.
      const assetId = await ctx.createDraftAsset("evidence_card_image", input);
      const mediaUrl = `/api/evidence-card/${assetId}`;

      return {
        status: "done",
        assetId,
        content: JSON.stringify(cardData),
        mediaUrl,
        mediaType: "image",
      };
    } catch (err) {
      if (err instanceof MissingApiKeyError) {
        return { status: "error", httpStatus: 500, error: err.message };
      }
      return {
        status: "error",
        httpStatus: 500,
        error: err instanceof Error ? err.message : "Card generation failed.",
      };
    }
  },
};

export default evidenceCardImageAdapter;
