/**
 * Publishing Asset (Layer 2)
 * ---------------------------
 * An editorial transformation of a Knowledge Asset into a form suitable
 * for human consumption — independent of any distribution channel. A
 * Publishing Asset doesn't know or care whether it'll end up on
 * Instagram, in an email, or nowhere at all; that's Layer 3's job (see
 * distribution-adaptation.ts).
 *
 * Real today (see domains/publishing/layers.ts for the actual
 * kind→layer classification the Engine uses):
 *   - evidence_cards — an Evidence Card collection, in the brief's own
 *     words.
 *   - blog_article — a standalone article.
 *   - podcast_script — a narration script (audio synthesis itself is a
 *     reserved capability — see domains/publishing/capabilities.ts's
 *     `speech_synthesis` entry, which has no provider yet). Still a
 *     Publishing Asset — this classification is about what it *is*
 *     (an editorial transformation, channel-independent), not about
 *     what it's built from. As of transformation-graph.ts, it prefers
 *     building on an existing blog_article rather than always
 *     generating independently from the raw chapter — a Publishing
 *     Asset deriving from another Publishing Asset doesn't change its
 *     layer, the same way a Distribution Adaptation deriving from a
 *     Publishing Asset doesn't make it Layer 2.
 *
 * Reserved, not built (Layer 2 formats the brief names that don't exist
 * as output kinds yet): course, lecture, white_paper, research_paper,
 * presentation, devotional, study_guide, educational_resource,
 * video_script. Adding any of these means a new adapter in
 * domains/publishing/adapters/, a registry entry, and a classification
 * in layers.ts — not a new table or a restructuring of this model.
 */
export type FuturePublishingAssetKind =
  | "course"
  | "lecture"
  | "white_paper"
  | "research_paper"
  | "presentation"
  | "devotional"
  | "study_guide"
  | "educational_resource"
  | "video_script";
