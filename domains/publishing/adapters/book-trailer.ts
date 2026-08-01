import { createRunwayImage, createRunwayVideo, getRunwayTask, buildTrailerPrompt } from "@/domains/publishing/providers/runway";
import { EngineContext, GenerationResult, KnowledgeAssetInput, OutputAdapter } from "../types";

const bookTrailerAdapter: OutputAdapter = {
  kind: "book_trailer",
  isAvailable: () => Boolean(process.env.RUNWAY_API_KEY),
  generate: async (input: KnowledgeAssetInput, _ctx: EngineContext): Promise<GenerationResult> => {
    const runwayKey = process.env.RUNWAY_API_KEY;
    if (!runwayKey) {
      return {
        status: "error",
        httpStatus: 500,
        error:
          "RUNWAY_API_KEY is not set. Add it to your .env.local file (see .env.example) and restart the dev server.",
      };
    }

    try {
      const keyframePrompt = buildTrailerPrompt(input.chapterTitle, input.chapterText);
      const imageTaskId = await createRunwayImage(runwayKey, keyframePrompt);

      // Image generation is comparatively fast — poll briefly for it here
      // so the video task can start with a real keyframe.
      let keyframeUrl: string | undefined;
      for (let attempt = 0; attempt < 15; attempt++) {
        await new Promise((r) => setTimeout(r, 2000));
        const result = await getRunwayTask(runwayKey, imageTaskId);
        if (result.state === "done") {
          keyframeUrl = result.url;
          break;
        }
        if (result.state === "error") {
          return { status: "error", httpStatus: 502, error: `Keyframe generation failed: ${result.message}` };
        }
      }
      if (!keyframeUrl) {
        return { status: "error", httpStatus: 504, error: "Keyframe image took too long to generate. Try again." };
      }

      const videoTaskId = await createRunwayVideo(
        runwayKey,
        keyframeUrl,
        `Slow, cinematic camera movement over this scene, suited to a book trailer for "${input.chapterTitle || "this chapter"}."`
      );

      return { status: "processing", provider: "runway", taskId: videoTaskId };
    } catch (err) {
      return {
        status: "error",
        httpStatus: 500,
        error: err instanceof Error ? err.message : "Trailer generation failed.",
      };
    }
  },
};

export default bookTrailerAdapter;
