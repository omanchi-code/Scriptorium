/**
 * Distribution Adaptation (Layer 3)
 * -----------------------------------
 * Prepares a Publishing Asset for a specific channel. Introduces no new
 * knowledge — only optimizes presentation for a destination. A YouTube
 * Short is not new knowledge; it's the same underlying material, cut
 * for that platform.
 *
 * Real today (see domains/publishing/layers.ts for the actual
 * kind→layer classification the Engine uses): seo_metadata, newsletter,
 * youtube_short, instagram_reel, facebook_post, cinematic_artwork,
 * book_trailer, evidence_card_image.
 *
 * Two of those are judgment calls worth stating plainly rather than
 * leaving implicit:
 *   - seo_metadata is classified here, not as a Publishing Asset,
 *     because it exists specifically to optimize how a Publishing
 *     Asset (a blog article) performs in a specific distribution
 *     channel (search) — not to add editorial content.
 *   - cinematic_artwork is classified here because it's produced for
 *     sharing/promotional use (a channel-facing purpose), not because
 *     it cleanly matches one of the brief's own Layer 3 examples the
 *     way, say, a YouTube Short does.
 *
 * **Provenance:** most of the eight kinds above now prefer deriving from
 * an existing Publishing Asset instead of the raw chapter, when one
 * exists in the session — see `domains/publishing/transformation-graph.ts`
 * (the single source of truth, `PublishingGraph`) for exactly which, and
 * `Generation.derivedFromId` for where that relationship is recorded.
 * `seo_metadata`, `facebook_post`, and `instagram_reel` prefer
 * `blog_article`; `evidence_card_image` prefers `evidence_cards`;
 * `youtube_short` prefers `podcast_script` — which itself now prefers
 * `blog_article` (see publishing-asset.ts), so a `youtube_short`
 * request against an empty session can cascade through two auto-generated
 * prerequisites, not one. `newsletter`, `cinematic_artwork`, and
 * `book_trailer` still always generate directly from the raw chapter —
 * deliberately, not as a remaining gap (see transformation-graph.ts for
 * why each was left out). The engine auto-generates a missing preferred
 * source when the graph says to, falling back to the raw chapter only
 * if that fails.
 *
 * Reserved, not built: linkedin_article, tiktok_video, epub, kindle,
 * pdf, print_layout, beehiiv_campaign, substack_publication,
 * podcast_episode (the actual audio file — blocked on the same
 * unconnected speech_synthesis capability podcast_script's future
 * audio would need).
 */
export type FutureDistributionAdaptationKind =
  | "linkedin_article"
  | "tiktok_video"
  | "epub"
  | "kindle"
  | "pdf"
  | "print_layout"
  | "beehiiv_campaign"
  | "substack_publication"
  | "podcast_episode";
