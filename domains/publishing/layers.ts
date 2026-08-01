import { OutputKind } from "@/domains/knowledge/asset-kinds";

export type TransformationLayer = "publishing_asset" | "distribution_adaptation";

/**
 * See ./publishing-asset.ts and ./distribution-adaptation.ts for what
 * each layer means and why the two judgment-call classifications
 * (seo_metadata, cinematic_artwork) landed where they did. This map is
 * what actually runs — engine.ts persists layerFor(kind) on every
 * Generation row, so this classification is queryable history, not just
 * a comment.
 */
const LAYER_BY_KIND: Record<OutputKind, TransformationLayer> = {
  evidence_cards: "publishing_asset",
  blog_article: "publishing_asset",
  podcast_script: "publishing_asset",

  seo_metadata: "distribution_adaptation",
  newsletter: "distribution_adaptation",
  youtube_short: "distribution_adaptation",
  instagram_reel: "distribution_adaptation",
  facebook_post: "distribution_adaptation",
  cinematic_artwork: "distribution_adaptation",
  book_trailer: "distribution_adaptation",
  evidence_card_image: "distribution_adaptation",
};

export function layerFor(kind: OutputKind): TransformationLayer {
  return LAYER_BY_KIND[kind];
}
