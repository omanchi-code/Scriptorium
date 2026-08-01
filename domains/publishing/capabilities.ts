export type Capability =
  | "long_form_reasoning"
  | "image_generation"
  | "cinematic_video"
  | "ocr"
  | "speech_synthesis";

/**
 * Which provider currently satisfies each capability, and with what
 * config. This is the one place in the codebase that names Anthropic,
 * Runway, or Pollinations for planning/metadata purposes — Generation
 * Plans (./plan.ts) only ever declare a `requiresCapability`, never a
 * provider. Swapping a provider later means changing an entry here, not
 * hunting through plan-construction logic.
 *
 * `speech_synthesis` has no provider yet — Podcast Script produces a
 * script, not audio, and nothing in Scriptorium currently synthesizes
 * speech. It's listed anyway so the capability vocabulary matches what
 * the architecture anticipates, not just what's wired up today.
 */
export const CAPABILITY_PROVIDER: Record<Capability, Record<string, unknown>> = {
  long_form_reasoning: {
    provider: "anthropic",
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
  },
  image_generation: { provider: "pollinations" },
  cinematic_video: {
    provider: "runway",
    imageModel: process.env.RUNWAY_IMAGE_MODEL || "gen4_image",
    videoModel: process.env.RUNWAY_VIDEO_MODEL || "gen4_turbo",
  },
  ocr: { provider: "anthropic", model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5" },
  speech_synthesis: { provider: null, note: "No provider connected yet." },
};
