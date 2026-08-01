import { OutputKind } from "@/domains/knowledge/asset-kinds";
import { KnowledgeAssetInput } from "./types";
import { ArtifactKind } from "./artifacts";
import { Capability } from "./capabilities";
import { PublishingProfileId } from "./profiles";
import { PublishingGraph } from "./transformation-graph";

export type PlanStep = {
  id: string;
  /** Which requested output this step ultimately serves. For a shared
   * step (see below), this is just the first output that needed it —
   * informational, not a claim of exclusive ownership. */
  output: OutputKind;
  dependsOn: string[];
  /** What this step needs, not who provides it (Refinement 7) — see
   * capabilities.ts for the current capability → provider mapping. */
  requiresCapability: Capability;
  producesArtifact?: ArtifactKind;
  consumesArtifact?: ArtifactKind;
  /** The Publishing Asset kind this step prefers to build from, per
   * PublishingGraph (transformation-graph.ts). Purely descriptive as of
   * this pass — engine.ts's resolveInputForKind() reads PublishingGraph
   * directly rather than going through the plan, per the brief this was
   * built against ("remove publishing relationships from
   * resolveInputForKind() and express them as data"). This field exists
   * so the *persisted* plan still shows the dependency for inspection
   * and history, without the engine's execution path needing to consult
   * the plan to find it. */
  dependsOnAsset?: OutputKind;
};

export type GenerationPlan = {
  sessionId: string;
  /** Refinement 1: this is an array from the outset, even though
   * today's real callers (the Studio, one card at a time) only ever
   * pass a single-element array. The planning layer is more capable
   * than the current interface on purpose. */
  requestedOutputs: OutputKind[];
  steps: PlanStep[];
  metadata: {
    chapterTitle: string;
    bookLabel: string;
    plannedAt: string;
    /** Set when this plan came from expandProfile() rather than a
     * manually chosen output list. */
    profileId?: PublishingProfileId;
  };
};

type StepTemplate = {
  id: string;
  dependsOn: string[];
  requiresCapability: Capability;
  producesArtifact?: ArtifactKind;
  dependsOnAsset?: OutputKind;
};

/** The real internal shape of each output in isolation — no cross-output
 * awareness here, that's handled separately below by groupSharedSteps().
 * book_trailer and evidence_card_image are accurate to what those two
 * adapters actually do; everything else is a single step.
 *
 * dependsOnAsset is read from PublishingGraph, the single source of
 * truth for these relationships (transformation-graph.ts) — this file
 * doesn't decide the relationship, it just reflects it into the plan
 * for persistence/inspection. The graph's "chapter" sentinel becomes
 * `undefined` here, since dependsOnAsset specifically means "depends on
 * another Generation," and the raw chapter isn't one. */
function baseStepsFor(kind: OutputKind): StepTemplate[] {
  const rule = PublishingGraph[kind];
  const preferredSource = rule.source === "chapter" ? undefined : rule.source;

  switch (kind) {
    case "book_trailer":
      return [
        { id: "keyframe", dependsOn: [], requiresCapability: "image_generation", producesArtifact: "keyframe_image" },
        { id: "trailer_video", dependsOn: ["keyframe"], requiresCapability: "cinematic_video" },
      ];
    case "evidence_card_image":
      return [
        {
          id: "extract",
          dependsOn: [],
          requiresCapability: "long_form_reasoning",
          producesArtifact: "card_content",
          dependsOnAsset: preferredSource,
        },
        { id: "background", dependsOn: ["extract"], requiresCapability: "image_generation", producesArtifact: "background_image" },
      ];
    case "cinematic_artwork":
      return [{ id: kind, dependsOn: [], requiresCapability: "image_generation" }];
    default:
      return [{ id: kind, dependsOn: [], requiresCapability: "long_form_reasoning", dependsOnAsset: preferredSource }];
  }
}

/** Groups of outputs that, if requested *together*, could share one
 * upstream artifact instead of each reasoning over the raw chapter
 * independently — this is Refinement 3's two worked examples (Summary →
 * Article/Podcast/Newsletter; Evidence Extraction → Evidence Cards →
 * a social output), built from output kinds that actually exist today
 * rather than the brief's illustrative ones that aren't real kinds in
 * this codebase. */
const SHARED_ARTIFACT_GROUPS: { members: OutputKind[]; artifact: ArtifactKind }[] = [
  { members: ["blog_article", "podcast_script", "newsletter"], artifact: "chapter_summary" },
  { members: ["evidence_cards", "instagram_reel"], artifact: "extracted_evidence" },
];

/**
 * Rewires steps so that if 2+ outputs from the same group were actually
 * requested together, they share one step producing the group's
 * artifact instead of each getting their own. If only one (or zero)
 * group member is requested — which is every real request today, since
 * the Studio sends one output at a time — nothing changes: no shared
 * step is inserted, no dependency is added, the plan looks exactly like
 * it did before this refinement.
 *
 * Nothing currently executes these shared steps — see artifacts.ts.
 * This only changes what the *plan* describes, not what the *adapters*
 * do; each output's adapter still does its own full work in one call.
 */
function groupSharedSteps(steps: PlanStep[], requestedOutputs: OutputKind[]): PlanStep[] {
  let result = steps;

  for (const group of SHARED_ARTIFACT_GROUPS) {
    const membersRequested = requestedOutputs.filter((k) => group.members.includes(k));
    if (membersRequested.length < 2) continue;

    const sharedId = `shared:${group.artifact}`;
    const sharedStep: PlanStep = {
      id: sharedId,
      output: membersRequested[0],
      dependsOn: [],
      requiresCapability: "long_form_reasoning",
      producesArtifact: group.artifact,
    };

    result = result.map((step) => {
      // A group member's own primary step has id === its output kind
      // (see baseStepsFor's default case) — that's the one that should
      // depend on the shared step.
      if (membersRequested.includes(step.output) && step.id === step.output) {
        return { ...step, dependsOn: [...step.dependsOn, sharedId], consumesArtifact: group.artifact };
      }
      return step;
    });

    result = [sharedStep, ...result];
  }

  return result;
}

/**
 * Knowledge Asset → Generation Plan → Publishing Engine → Adapters → Providers.
 * Builds a plan for any number of requested outputs — a manual
 * multi-select, a profile's expanded bundle, or (today, always) a
 * single output from the Studio's per-card button.
 */
export function buildPlan(
  requestedOutputs: OutputKind[],
  sessionId: string,
  input: KnowledgeAssetInput,
  profileId?: PublishingProfileId
): GenerationPlan {
  const rawSteps: PlanStep[] = requestedOutputs.flatMap((kind) =>
    baseStepsFor(kind).map((t) => ({
      id: `${kind}:${t.id}`,
      output: kind,
      dependsOn: t.dependsOn.map((d) => `${kind}:${d}`),
      requiresCapability: t.requiresCapability,
      producesArtifact: t.producesArtifact,
      dependsOnAsset: t.dependsOnAsset,
    }))
  );

  // Single-step outputs get an unprefixed id (matches baseStepsFor's
  // `id: kind` for the default/simple case) so groupSharedSteps can spot
  // "this step's id equals its output kind" as "this is that output's
  // one and only step" without needing a separate marker field.
  const steps = rawSteps.map((s) => (s.id === `${s.output}:${s.output}` ? { ...s, id: s.output } : s));

  return {
    sessionId,
    requestedOutputs,
    steps: groupSharedSteps(steps, requestedOutputs),
    metadata: {
      chapterTitle: input.chapterTitle,
      bookLabel: input.bookLabel,
      plannedAt: new Date().toISOString(),
      profileId,
    },
  };
}

/** Backward-compatible single-output entry point — what today's Engine
 * and Studio actually call, since the UI still requests one output at a
 * time. This is a thin wrapper over buildPlan(), not a second planning
 * algorithm: there is exactly one real implementation. */
export function buildGenerationPlan(
  kind: OutputKind,
  sessionId: string,
  input: KnowledgeAssetInput
): GenerationPlan {
  return buildPlan([kind], sessionId, input);
}
