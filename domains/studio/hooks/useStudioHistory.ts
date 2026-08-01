"use client";

import { useEffect, useState } from "react";
import { OUTPUTS } from "@/domains/knowledge/asset-kinds";
import { StudioHistoryItemViewModel } from "../types";

function labelFor(kind: string) {
  return OUTPUTS.find((o) => o.kind === kind)?.label ?? kind;
}

export function useStudioHistory() {
  const [items, setItems] = useState<StudioHistoryItemViewModel[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/generations");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't load history.");
        return;
      }
      type RawGeneration = Omit<StudioHistoryItemViewModel, "kindLabel"> & { kind: string };
      setItems(
        (data.generations as RawGeneration[]).map((g) => ({
          id: g.id,
          sessionId: g.sessionId,
          kindLabel: labelFor(g.kind),
          chapterTitle: g.chapterTitle,
          status: g.status,
          errorMessage: g.errorMessage,
          content: g.content,
          mediaUrl: g.mediaUrl,
          mediaType: g.mediaType,
          createdAt: g.createdAt,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load history.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { items, error, refresh: load };
}
