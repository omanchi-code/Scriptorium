import { buildPollinationsImageUrl } from "@/domains/publishing/providers/pollinations";
import { buildArtworkPrompt } from "@/domains/publishing/providers/runway";
import { EngineContext, GenerationResult, KnowledgeAssetInput, OutputAdapter } from "../types";

const cinematicArtworkAdapter: OutputAdapter = {
  kind: "cinematic_artwork",
  isAvailable: () => true, // Pollinations needs no key
  generate: async (input: KnowledgeAssetInput, _ctx: EngineContext): Promise<GenerationResult> => {
    const prompt = buildArtworkPrompt(input.chapterTitle, input.chapterText);
    const mediaUrl = buildPollinationsImageUrl(prompt);
    return { status: "done", mediaUrl, mediaType: "image" };
  },
};

export default cinematicArtworkAdapter;
