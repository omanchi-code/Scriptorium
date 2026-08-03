import { Prisma } from 
"@prisma/client";
import { prisma } from 
"@/lib/prisma";
import { OutputKind } from "@/domains/knowledge/asset-kinds";
import { GenerationResult, KnowledgeAssetInput } from "./types";
import { GenerationPlan } from "./plan";
import { layerFor } from "./layers";

/** Creates a placeholder row and returns its id. Used by adapters that
 * need their own row's id before they can finish generating (see
 * EngineContext.createDraftAsset). The session and plan are already
 * known at this point (both are resolved/built before the adapter runs)
 * so they're stamped on immediately rather than added later. */
export async function createDraftAsset(
  kind: OutputKind,
  input: KnowledgeAssetInput,
  sessionId: string,
  plan: GenerationPlan
) {
  const generation = await prisma.generation.create({
    data: {
      userId: input.userId,
      sessionId,
      kind,
      layer: layerFor(kind),
      chapterTitle: input.chapterTitle,
      chapterText: input.chapterText,
      plan: plan as unknown as object,
      status: "processing",
    },
  });
  return generation.id;
}

/** Persists a finished, in-progress, or failed generation. This is the
 * single place that writes to the Generation table — no adapter does
 * this itself. Failures are persisted too: a publishing record that
 * only remembers successes isn't actually a record.
 *
 * `derivedFromId` is accepted but always undefined today — no adapter
 * currently derives one output from another's Generation row (see the
 * honesty note in domains/publishing/distribution-adaptation.ts). It's
 * a parameter here, not bolted on later, so the day an adapter does
 * derive from a prior output, persistence doesn't need to change. */
export async function persistGenerationResult(
  kind: OutputKind,
  input: KnowledgeAssetInput,
  result: GenerationResult,
  sessionId: string,
  plan: GenerationPlan,
 providerMetadata: 
 Prisma.InputJsonValue,
  derivedFromId?: string
) {
  const layer = layerFor(kind);

  if (result.status === "error") {
    await prisma.generation.create({
      data: {
        userId: input.userId,
        sessionId,
        kind,
        layer,
        derivedFromId,
        chapterTitle: input.chapterTitle,
        chapterText: input.chapterText,
        plan: plan as unknown as object,
        providerMetadata,
        status: "error",
        errorMessage: result.error,
      },
    });
    return;
  }

  if (result.status === "processing") {
    await prisma.generation.create({
      data: {
        userId: input.userId,
        sessionId,
        kind,
        layer,
        derivedFromId,
        chapterTitle: input.chapterTitle,
        chapterText: input.chapterText,
        plan: plan as unknown as object,
        providerMetadata,
        status: "processing",
        mediaType: "video",
        taskId: result.taskId,
      },
    });
    return;
  }

  // status === "done"
  if (result.assetId) {
    // The adapter already created its row (via createDraftAsset) because
    // it needed the id before it could finish — just fill in the rest.
    await prisma.generation.update({
      where: { id: result.assetId },
      data: {
        content: result.content,
        mediaUrl: result.mediaUrl,
        mediaType: result.mediaType,
        providerMetadata,
        status: "done",
      },
    });
    return;
  }

  await prisma.generation.create({
    data: {
      userId: input.userId,
      sessionId,
      kind,
      layer,
      derivedFromId,
      chapterTitle: input.chapterTitle,
      chapterText: input.chapterText,
      plan: plan as unknown as object,
      providerMetadata,
      status: "done",
      content: result.content,
      mediaUrl: result.mediaUrl,
      mediaType: result.mediaType,
    },
  });
}

/** Next sequential evidence-card number for this user, e.g. "005". */
export async function nextEvidenceCardNumber(userId: string) {
  const count = await prisma.generation.count({
    where: { userId, kind: "evidence_card_image" },
  });
  return String(count + 1).padStart(3, "0");
}
