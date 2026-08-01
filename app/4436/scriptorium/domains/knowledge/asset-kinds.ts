export type OutputKind =
  | "evidence_cards"
  | "evidence_card_image"
  | "blog_article"
  | "cinematic_artwork"
  | "book_trailer"
  | "youtube_short"
  | "instagram_reel"
  | "facebook_post"
  | "podcast_script"
  | "newsletter"
  | "seo_metadata";

export type OutputDef = {
  kind: OutputKind;
  label: string;
  medium: "text" | "image" | "video";
  description: string;
};

export const OUTPUTS: OutputDef[] = [
  { kind: "evidence_cards", label: "Evidence Cards", medium: "text", description: "Claims in the chapter paired with their sources." },
  { kind: "evidence_card_image", label: "Evidence Card (Image)", medium: "image", description: "One claim, rendered as your branded numbered card." },
  { kind: "blog_article", label: "Blog Article", medium: "text", description: "A standalone essay adapted from the chapter." },
  { kind: "cinematic_artwork", label: "Cinematic Artwork", medium: "image", description: "A key-art image for the chapter." },
  { kind: "book_trailer", label: "Book Trailer", medium: "video", description: "A short trailer cut for the book." },
  { kind: "youtube_short", label: "YouTube Short Script", medium: "text", description: "A vertical-video script under 60 seconds." },
  { kind: "instagram_reel", label: "Instagram Reel Script", medium: "text", description: "A short-form script with on-screen text cues." },
  { kind: "facebook_post", label: "Facebook Post", medium: "text", description: "A shareable post summarizing the chapter's idea." },
  { kind: "podcast_script", label: "Podcast Script", medium: "text", description: "A narration script for an audio read." },
  { kind: "newsletter", label: "Newsletter Draft", medium: "text", description: "An email announcing this chapter to subscribers." },
  { kind: "seo_metadata", label: "SEO Metadata", medium: "text", description: "Title tag, meta description, and keywords." },
];

/** Runtime guard for the one real untrusted boundary this vocabulary
 * has: an HTTP request body. TypeScript's `kind: OutputKind` typing
 * throughout the codebase protects every call site the compiler can
 * see, but `body.kind` from a parsed JSON request is `any` — casting it
 * to OutputKind doesn't validate anything at runtime. Used at the API
 * route so a bad value gets a clean 400 instead of reaching the
 * database and failing on the Postgres enum constraint. Derived from
 * OUTPUTS rather than a second hardcoded list, so this can't itself
 * drift from the canonical vocabulary. */
const OUTPUT_KIND_SET = new Set<string>(OUTPUTS.map((o) => o.kind));
export function isOutputKind(value: unknown): value is OutputKind {
  return typeof value === "string" && OUTPUT_KIND_SET.has(value);
}

// --- Compile-time sync check against the database's OutputKind enum ---
// prisma/schema.prisma's `enum OutputKind` mirrors the union above by
// necessity (Prisma can't generate a database enum from a TypeScript
// union with this toolchain) — see the comment on that enum for the
// full reasoning. This assertion is what keeps that duplication honest:
// if the two ever disagree, on either side, the build fails here rather
// than at runtime in production.
//
// Not verified against a live `prisma generate` output in this
// environment — no database or network access to run it. Run
// `npx prisma generate && npx tsc --noEmit` after your first real
// migration to confirm this actually compiles against the generated
// client before relying on it.
import type { OutputKind as PrismaOutputKind } from "@prisma/client";

type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;

// If this fails to compile ("Type 'true' is not assignable to type
// 'never'"), domains/knowledge/asset-kinds.ts's OutputKind and
// prisma/schema.prisma's `enum OutputKind` have drifted apart. Fix
// whichever one is missing the other's values, then re-run
// `npx prisma generate`.
type OutputKindsInSync = IsEqual<OutputKind, PrismaOutputKind> extends true ? true : never;
const _outputKindSyncCheck: OutputKindsInSync = true;
void _outputKindSyncCheck;
