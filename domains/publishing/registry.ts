import { OUTPUTS, OutputKind } from "@/domains/knowledge/asset-kinds";
import { OutputAdapter } from "./types";
import TEXT_ADAPTERS from "./adapters/text";
import cinematicArtworkAdapter from "./adapters/cinematic-artwork";
import bookTrailerAdapter from "./adapters/book-trailer";
import evidenceCardImageAdapter from "./adapters/evidence-card-image";

const ADAPTERS: OutputAdapter[] = [
  ...TEXT_ADAPTERS,
  cinematicArtworkAdapter,
  bookTrailerAdapter,
  evidenceCardImageAdapter,
];

const REGISTRY = new Map<OutputKind, OutputAdapter>(ADAPTERS.map((a) => [a.kind, a]));

// Fails fast at startup, not per-request, if a kind is ever added to the
// UI-facing list without a matching adapter (or vice versa) — the two
// are meant to stay in lockstep.
for (const def of OUTPUTS) {
  if (!REGISTRY.has(def.kind)) {
    throw new Error(`No Publishing Engine adapter registered for output kind "${def.kind}"`);
  }
}

export function getAdapter(kind: OutputKind): OutputAdapter | undefined {
  return REGISTRY.get(kind);
}

/** "Which outputs exist, which are available" — per-kind availability
 * without attempting a generation. Not wired into the Studio UI yet
 * (that would be a UX change, out of scope for this refinement), but
 * ready for a future availability indicator or an /api/generate/availability
 * route to use. */
export function listOutputAvailability(): { kind: OutputKind; available: boolean }[] {
  return OUTPUTS.map((def) => ({
    kind: def.kind,
    available: REGISTRY.get(def.kind)?.isAvailable() ?? false,
  }));
}
