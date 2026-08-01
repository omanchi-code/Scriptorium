export type ArtifactKind =
  // Real — actually produced today, by adapters/book-trailer.ts and
  // adapters/evidence-card-image.ts respectively. Their plan steps
  // (see ./plan.ts) reference these, and it's an accurate description
  // of what those two adapters really do internally.
  | "keyframe_image"
  | "card_content"
  | "background_image"
  // Reserved — not produced by any adapter yet. A plan can express a
  // step consuming one of these (see the summary/evidence grouping in
  // ./plan.ts), but nothing currently computes or stores them for
  // reuse — the adapter that "consumes" one today still does the full
  // work itself in one call, same as before this refinement. Wiring an
  // actual artifact store that skips regeneration when one of these
  // already exists for a session is future work, not done here.
  | "chapter_summary"
  | "outline"
  | "key_arguments"
  | "quotations"
  | "extracted_evidence"
  | "keywords"
  | "glossary"
  | "references";
