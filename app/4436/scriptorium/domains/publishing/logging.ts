import { OutputKind } from "@/domains/knowledge/asset-kinds";
import { GenerationPlan } from "./plan";

type GenerationEvent =
  | { phase: "start"; kind: OutputKind; userId: string; sessionId: string; plan: GenerationPlan }
  | { phase: "success"; kind: OutputKind; userId: string; status: "done" | "processing" }
  | { phase: "error"; kind: OutputKind; userId: string; error: string };

/** Structured logging for every generation the Engine runs. This is
 * intentionally just console.log today — the point isn't the log
 * destination, it's that the Engine calls this at one place for every
 * output type, so swapping in a real provider (PostHog, Axiom, Sentry,
 * whatever) later is a one-file change instead of finding every place a
 * generation happens and instrumenting it individually. */
export function logGenerationEvent(event: GenerationEvent) {
  console.log(
    JSON.stringify({
      source: "publishing-engine",
      timestamp: new Date().toISOString(),
      ...event,
    })
  );
}
