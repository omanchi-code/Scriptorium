import { OutputKind } from "@/domains/knowledge/asset-kinds";
import { callClaude } from "@/domains/publishing/providers/anthropic";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdapter } from "./registry";
import { createDraftAsset, nextEvidenceCardNumber, persistGenerationResult } from "./persistence";
import { logGenerationEvent } from "./logging";
import { resolveSession, recordRequestedOutput } from "./session";
import { buildGenerationPlan, GenerationPlan } from "./plan";
import { CAPABILITY_PROVIDER } from "./capabilities";
import { PublishingGraph } from "./transformation-graph";
import { EngineContext, EngineExecutionResult, KnowledgeAssetInput } from "./types";

/** Which provider(s) actually ran for this output, derived from the
 * plan's own steps rather than a separate kind→provider switch. */
function providerMetadataForPlan(
  plan: GenerationPlan,
  kind: OutputKind
): Prisma.InputJsonValue {
  const capabilities = Array.from(
    new Set(
      plan.steps
        .filter((s) => s.output === kind)
        .map((s) => s.requiresCapability)
    )
  );
  const providers = capabilities.map((c) => CAPABILITY_PROVIDER[c]);
  return providers.length === 1 ? providers[0] : { steps: providers };
}

/** sessionId and plan are captured in this closure rather than added to
 * the adapter-facing EngineContext type — adapters don't need to know
 * about either. Built from the *original* input, deliberately — even
 * when a Distribution Adaptation is building from a reused Publishing
 * Asset's content, its persisted chapterTitle/chapterText should still
 * describe the real originating chapter, not the substituted text. */
function buildEngineContext(
  input: KnowledgeAssetInput,
  sessionId: string,
  plan: GenerationPlan
): EngineContext {
  return {
    callClaude,
    createDraftAsset: (kind, draftInput) => createDraftAsset(kind, draftInput, sessionId, plan),
    nextEvidenceCardNumber: () => nextEvidenceCardNumber(input.userId),
  };
}

/**
 * The engine owns execution. The graph owns knowledge. This function is
 * the execution half: it asks PublishingGraph what the relationship is
 * and acts on it — it doesn't decide the relationship itself. No switch
 * statement, no per-kind branching; every kind (including the five
 * "root" kinds that always build from the raw chapter) is handled by
 * the same few lines, because the graph is total over every OutputKind.
 *
 * Reuse if an existing source is available; auto-generate the source if
 * the graph says to and none exists; otherwise fall back to the raw
 * chapter (the "Important Clarification" from an earlier brief — not
 * every output needs a forced intermediate).
 *
 * `_depth` is an internal safety valve, not a public parameter. By
 * construction this can't recurse more than two levels deep (chapter →
 * podcast_script → blog_article is the longest chain in the graph
 * today), but a cheap guard against a future graph edit accidentally
 * introducing a cycle is worth having regardless.
 */
async function resolveInputForKind(
  kind: OutputKind,
  input: KnowledgeAssetInput,
  sessionId: string,
  _depth = 0
): Promise<{ effectiveInput: KnowledgeAssetInput; derivedFromId?: string }> {
  const rule = PublishingGraph[kind];

  if (rule.source === "chapter" || _depth > 2) {
    return { effectiveInput: input };
  }

  const sourceKind = rule.source;

  let source = await prisma.generation.findFirst({
    where: { sessionId, userId: input.userId, kind: sourceKind, status: "done" },
    orderBy: { createdAt: "desc" },
  });

  if (!source && rule.autoGenerate) {
    const prerequisite = await runPublishingEngine(sourceKind, input, sessionId, _depth + 1);
    if (prerequisite.result.status === "done" && prerequisite.result.content) {
      source = await prisma.generation.findFirst({
        where: { sessionId, userId: input.userId, kind: sourceKind, status: "done" },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  if (!source?.content) {
    return { effectiveInput: input };
  }

  return {
    effectiveInput: { ...input, chapterText: source.content },
    derivedFromId: source.id,
  };
}

/**
 * Knowledge Asset → Generation Plan → Publishing Engine → Adapters → Providers.
 *
 * Every generated asset runs through this one function:
 *   1. Validate input.
 *   2. Resolve the Publishing Session; record the requested output on it.
 *   3. Build the Generation Plan.
 *   4. Resolve provenance via PublishingGraph.
 *   5. Delegate to the adapter with the resolved input.
 *   6. Persist everything and log throughout.
 *
 * `_depth` is not part of the public contract; existing callers (the
 * route handler) never pass it and don't need to know it exists.
 */
export async function runPublishingEngine(
  kind: OutputKind,
  input: KnowledgeAssetInput,
  existingSessionId?: string,
  _depth = 0
): Promise<EngineExecutionResult> {
  if (!input.chapterText.trim()) {
    return {
      sessionId: existingSessionId ?? "",
      result: { status: "error", httpStatus: 400, error: "Paste chapter text first." },
    };
  }

  const adapter = getAdapter(kind);
  if (!adapter) {
    return {
      sessionId: existingSessionId ?? "",
      result: { status: "error", httpStatus: 400, error: "Unknown output kind." },
    };
  }

  const sessionId = await resolveSession(input, existingSessionId);
  await recordRequestedOutput(sessionId, kind);

  const plan = buildGenerationPlan(kind, sessionId, input);

  logGenerationEvent({ phase: "start", kind, userId: input.userId, sessionId, plan });

  const { effectiveInput, derivedFromId } = await resolveInputForKind(kind, input, sessionId, _depth);

  const result = await adapter.generate(effectiveInput, buildEngineContext(input, sessionId, plan));

  await persistGenerationResult(
    kind,
    input,
    result,
    sessionId,
    plan,
    providerMetadataForPlan(plan, kind),
    derivedFromId
  );

  if (result.status === "error") {
    logGenerationEvent({ phase: "error", kind, userId: input.userId, error: result.error });
  } else {
    logGenerationEvent({ phase: "success", kind, userId: input.userId, status: result.status });
  }

  return { sessionId, result };
}

export { listOutputAvailability } from "./registry";
