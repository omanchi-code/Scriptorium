"use client";

import { useRef, useState } from "react";
import { OUTPUTS, OutputKind } from "@/domains/knowledge/asset-kinds";
import { StudioCardViewModel } from "../types";
import { SAMPLE_TITLE, SAMPLE_TEXT } from "../constants";

const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 60; // ~4 minutes

function initialCards(): Record<OutputKind, StudioCardViewModel> {
  return Object.fromEntries(
    OUTPUTS.map((o) => [
      o.kind,
      { kind: o.kind, label: o.label, description: o.description, status: "idle" as const },
    ])
  ) as Record<OutputKind, StudioCardViewModel>;
}

export function useStudioGeneration() {
  const [chapterTitle, setChapterTitle] = useState(SAMPLE_TITLE);
  const [bookLabel, setBookLabel] = useState("Book I");
  const [chapterText, setChapterText] = useState("");
  const [cards, setCards] = useState<Record<OutputKind, StudioCardViewModel>>(initialCards);
  const [expanded, setExpanded] = useState<OutputKind | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);

  // A ref, not state: generateAll awaits generateOne in a sequential
  // loop within one render, so state set by an earlier iteration
  // wouldn't be visible to a later one in the same closure — a ref reads
  // the latest value immediately, which is what "all these outputs
  // belong to the same publishing session" actually requires.
  const sessionIdRef = useRef<string | undefined>(undefined);

  function patchCard(kind: OutputKind, patch: Partial<StudioCardViewModel>) {
    setCards((prev) => ({ ...prev, [kind]: { ...prev[kind], ...patch } }));
  }

  async function pollTask(kind: OutputKind, taskId: string, provider: string, attempt = 0) {
    if (attempt >= MAX_POLLS) {
      patchCard(kind, { status: "error", error: "Timed out waiting for the render. Try again." });
      return;
    }
    try {
      const res = await fetch(
        `/api/generate/status?taskId=${encodeURIComponent(taskId)}&provider=${encodeURIComponent(provider)}`
      );
      const data = await res.json();

      if (data.status === "done") {
        patchCard(kind, { status: "done", mediaUrl: data.mediaUrl, mediaType: data.mediaType });
        setExpanded(kind);
        return;
      }
      if (data.status === "error") {
        patchCard(kind, { status: "error", error: data.error });
        return;
      }
      setTimeout(() => pollTask(kind, taskId, provider, attempt + 1), POLL_INTERVAL_MS);
    } catch (err) {
      patchCard(kind, {
        status: "error",
        error: err instanceof Error ? err.message : "Status check failed.",
      });
    }
  }

  async function generateOne(kind: OutputKind) {
    patchCard(kind, { status: "loading", error: undefined });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          chapterTitle,
          bookLabel,
          chapterText: chapterText.trim() || SAMPLE_TEXT,
          sessionId: sessionIdRef.current,
        }),
      });
      const data = await res.json();

      // The engine always resolves/returns a session id, success or
      // failure — capture it either way so every output for this
      // chapter, including retries after an error, lands in one session.
      if (data.sessionId) sessionIdRef.current = data.sessionId;

      if (res.status === 401) {
        patchCard(kind, { status: "error", error: "Session expired. Sign in again at /login." });
        return;
      }
      if (!res.ok) {
        patchCard(kind, { status: "error", error: data.error ?? "Generation failed." });
        return;
      }
      if (data.status === "processing") {
        patchCard(kind, { status: "processing" });
        pollTask(kind, data.taskId, data.provider);
        return;
      }
      patchCard(
        kind,
        data.mediaUrl
          ? { status: "done", mediaUrl: data.mediaUrl, mediaType: data.mediaType }
          : { status: "done", content: data.content }
      );
      setExpanded(kind);
    } catch (err) {
      patchCard(kind, {
        status: "error",
        error: err instanceof Error ? err.message : "Generation failed.",
      });
    }
  }

  async function generateAll() {
    setGeneratingAll(true);
    for (const o of OUTPUTS) {
      await generateOne(o.kind);
    }
    setGeneratingAll(false);
  }

  return {
    chapterTitle,
    setChapterTitle,
    bookLabel,
    setBookLabel,
    chapterText,
    setChapterText,
    cards: Object.values(cards),
    expandedKind: expanded,
    toggleExpanded: (kind: OutputKind) => setExpanded((prev) => (prev === kind ? null : kind)),
    generateOne,
    generateAll,
    generatingAll,
  };
}
