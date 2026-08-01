import { prisma } from "@/lib/prisma";
import { KnowledgeAssetInput } from "./types";
import { OutputKind } from "@/domains/knowledge/asset-kinds";

/**
 * Session creation is deliberately an Engine/persistence concern, not a
 * UI one (Refinement 3 — the UI expresses intent, the engine decides
 * persistence). The client never invents its own session id; it only
 * ever echoes back the id the engine already gave it on a prior call.
 */
export async function resolveSession(
  input: KnowledgeAssetInput,
  existingSessionId?: string
): Promise<string> {
  if (existingSessionId) {
    const existing = await prisma.publishingSession.findFirst({
      where: { id: existingSessionId, userId: input.userId },
    });
    if (existing) return existing.id;
    // Client sent an id that's missing or belongs to someone else —
    // silently fall through to creating a fresh session rather than
    // erroring the whole generation over it.
  }

  const session = await prisma.publishingSession.create({
    data: {
      userId: input.userId,
      chapterTitle: input.chapterTitle,
      chapterText: input.chapterText,
      bookLabel: input.bookLabel,
    },
  });
  return session.id;
}

/** Appends a requested output kind to the session's permanent record,
 * if it isn't already there. Best-effort: a failure here shouldn't fail
 * the generation itself, since the actual Generation row (with its own
 * kind, plan, and status) is the source of truth either way — this is
 * a denormalized convenience field for "what has this session touched
 * so far" without a join. */
export async function recordRequestedOutput(sessionId: string, kind: OutputKind) {
  try {
    const session = await prisma.publishingSession.findUnique({ where: { id: sessionId } });
    if (!session) return;
    const existing = (session.requestedOutputs as string[] | null) ?? [];
    if (existing.includes(kind)) return;
    await prisma.publishingSession.update({
      where: { id: sessionId },
      data: { requestedOutputs: [...existing, kind] },
    });
  } catch {
    // best-effort — see comment above
  }
}
