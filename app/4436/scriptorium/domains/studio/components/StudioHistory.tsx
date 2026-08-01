"use client";

import { useState } from "react";
import { useStudioHistory } from "../hooks/useStudioHistory";
import EmptyState from "@/components/ui/EmptyState";

export default function StudioHistory() {
  const { items, error, refresh } = useStudioHistory();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="hairline pt-10 mt-16">
      <div className="flex items-baseline justify-between mb-6">
        <p className="eyebrow">History</p>
        <button
          onClick={refresh}
          className="font-mono text-xs text-ink-dim hover:text-brass transition-colors duration-300"
        >
          Refresh
        </button>
      </div>

      {error && <p className="font-mono text-xs text-crimson">{error}</p>}

      {items && items.length === 0 && <EmptyState>Nothing generated yet.</EmptyState>}

      {items && items.length > 0 && (
        <ul>
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li key={item.id} className="hairline py-4">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-baseline justify-between gap-4 text-left"
                >
                  <span>
                    <span className="font-display text-lg mr-3">{item.kindLabel}</span>
                    <span className="text-ink-dim text-sm">
                      {item.chapterTitle || "Untitled chapter"}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-ink-dim shrink-0">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </button>

                {isOpen && item.status === "error" && (
                  <p className="mt-4 font-mono text-xs text-crimson">{item.errorMessage}</p>
                )}
                {isOpen && item.content && (
                  <pre className="mt-4 whitespace-pre-wrap font-body text-sm leading-relaxed text-ink/90 max-h-64 overflow-y-auto">
                    {item.content}
                  </pre>
                )}
                {isOpen && item.mediaUrl && item.mediaType === "video" && (
                  <video controls src={item.mediaUrl} className="mt-4 w-full" />
                )}
                {isOpen && item.mediaUrl && item.mediaType === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.mediaUrl} alt={item.chapterTitle} className="mt-4 w-full" />
                )}
                {isOpen && item.status === "processing" && !item.mediaUrl && (
                  <p className="mt-4 font-mono text-xs text-ink-dim">
                    Still rendering when this was saved — refresh to check again.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
