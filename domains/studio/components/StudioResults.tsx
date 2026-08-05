import { OutputKind } from "@/domains/knowledge/asset-kinds";
"use client";

import Panel from "@/components/ui/Panel";
import StatusBadge, { StatusTone } from "@/components/ui/StatusBadge";
import ActionButton from "@/components/ui/ActionButton";
import { StudioCardViewModel, StudioStatus } from "../types";

const STATUS_LABEL: Record<StudioStatus, string> = {
  idle: "Not started",
  loading: "Generating…",
  processing: "Rendering… (can take minutes)",
  done: "Ready",
  error: "Error",
};

const STATUS_TONE: Record<StudioStatus, StatusTone> = {
  idle: "neutral",
  loading: "active",
  processing: "active",
  done: "success",
  error: "error",
};

export default function StudioResults({
  cards,
  expandedKind,
  onToggleExpanded,
  onGenerateOne,
}: {
  cards: StudioCardViewModel[];
  expandedKind: OutputKind | null;
  onToggleExpanded: (kind: OutputKind) => void;
  onGenerateOne: (kind: OutputKind) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-px bg-rule">
      {cards.map((card) => {
        const isOpen = expandedKind === card.kind;
        return (
          <Panel key={card.kind} className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-display text-xl">{card.label}</h3>
              <StatusBadge label={STATUS_LABEL[card.status]} tone={STATUS_TONE[card.status]} />
            </div>
            <p className="text-ink-dim text-sm leading-relaxed mb-4">{card.description}</p>

            <div className="mt-auto flex items-center gap-6">
              <ActionButton
                small
                onClick={() => onGenerateOne(card.kind)}
                disabled={card.status === "loading"}
              >
                {card.status === "idle" ? "Generate" : "Regenerate"}
              </ActionButton>
              {(card.content || card.mediaUrl) && (
                <button
                  onClick={() => onToggleExpanded(card.kind)}
                  className="font-mono text-xs text-ink-dim hover:text-brass transition-colors duration-300"
                >
                  {isOpen ? "Hide" : "View"}
                </button>
              )}
            </div>

            {card.status === "error" && (
              <p className="font-mono text-xs text-crimson mt-4">{card.error}</p>
            )}

            {isOpen && card.content && (
              <pre className="mt-5 whitespace-pre-wrap font-body text-sm leading-relaxed text-ink/90 border-t border-rule pt-5 max-h-72 overflow-y-auto">
                {card.content}
              </pre>
            )}

            {isOpen && card.mediaUrl && card.mediaType === "video" && (
              <video controls src={card.mediaUrl} className="mt-5 w-full border-t border-rule pt-5" />
            )}

            {isOpen && card.mediaUrl && card.mediaType === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.mediaUrl}
                alt={`Generated ${card.label} for this chapter`}
                className="mt-5 w-full border-t border-rule pt-5"
              />
            )}
          </Panel>
        );
      })}
    </div>
  );
}
