import { OutputKind } from "@/domains/knowledge/asset-kinds";

/** What every adapter receives. This is the "one authoritative source of
 * research" every output is built from (Architectural Principle 2) —
 * adapters never fetch their own chapter data, it's handed to them. */
export type KnowledgeAssetInput = {
  userId: string;
  chapterTitle: string;
  chapterText: string;
  bookLabel: string;
};

export type GenerationResult =
  | {
      status: "done";
      content?: string;
      mediaUrl?: string;
      mediaType?: "image" | "video";
      // Set when the adapter had to create its own Generation row before
      // it could finish (e.g. it needed the row's id to build a URL).
      // The engine's persistence step updates that row instead of
      // creating a new one when this is present.
      assetId?: string;
    }
  | {
      status: "processing";
      provider: string;
      taskId: string;
    }
  | {
      status: "error";
      error: string;
      httpStatus?: number;
    };

export type EngineExecutionResult = {
  sessionId: string;
  result: GenerationResult;
};

/** Every output type implements this. Note what's absent: no auth
 * checking, no persistence, no logging — that's the Engine's job
 * (Architectural Principle 3). An adapter's only responsibility is the
 * transformation itself (Principle 4).
 *
 * label/medium/description intentionally aren't redeclared here — each
 * adapter pulls them from domains/knowledge/asset-kinds.ts (the single place the UI
 * and the Engine both read output metadata from), so the two can't drift
 * out of sync with each other. */
export type OutputAdapter = {
  kind: OutputKind;
  generate: (input: KnowledgeAssetInput, ctx: EngineContext) => Promise<GenerationResult>;
  /** Cheap, synchronous check for whether this adapter can currently run
   * (e.g. its API key is configured) — used to answer "which outputs are
   * available" without attempting a generation. */
  isAvailable: () => boolean;
};

/** Capabilities the Engine hands each adapter, so shared logic (calling
 * Claude, creating a draft asset row, numbering evidence cards) lives in
 * one place instead of being reimplemented per adapter. */
export type EngineContext = {
  callClaude: (prompt: string, maxTokens?: number) => Promise<string>;
  /** Creates a placeholder Generation row and returns its id — for the
   * rare adapter that needs its own row's id before it can finish (e.g.
   * to build a shareable URL from it). Most adapters don't need this;
   * the Engine persists their result automatically after generate()
   * returns. */
  createDraftAsset: (kind: OutputKind, input: KnowledgeAssetInput) => Promise<string>;
  /** Next sequential number for this user's evidence cards, e.g. "005". */
  nextEvidenceCardNumber: () => Promise<string>;
};
