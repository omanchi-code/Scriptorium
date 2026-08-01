/**
 * Knowledge Asset (Layer 1)
 * -------------------------
 * A correction, not just a definition. An earlier version of this file
 * said "every output — a book chapter, an article, an Evidence Card, a
 * podcast script — is a Knowledge Asset." Under the Three-Layer
 * Transformation Model, that's wrong: those are transformations *of*
 * knowledge, not the knowledge itself. This file now describes only
 * Layer 1.
 *
 * A Knowledge Asset is the author's intellectual work, existing
 * independently of publication. It is created by the author, never by
 * AI. Its purpose is preservation, organization, and retrieval — not
 * distribution.
 *
 * What's real today:
 *   - The chapter itself (`KnowledgeAssetInput` — chapterTitle,
 *     chapterText, bookLabel, in domains/publishing/types.ts) is the
 *     Knowledge Asset every Generation Plan is built from.
 *   - Book metadata (domains/books/data.ts) — a book is intellectual
 *     work independent of any specific published form of it.
 *   - Source/citation categories (domains/knowledge/sources.ts) and blog
 *     taxonomy (domains/knowledge/taxonomy.ts) — the organizational
 *     structure knowledge is retrieved through.
 *
 * What outputs actually are instead: a book chapter draft becoming a
 * blog article, a podcast script, or an Evidence Card collection is a
 * **Publishing Asset** (Layer 2, see ./publishing-asset.ts) — an
 * editorial transformation of this Knowledge Asset. Repackaging that
 * Publishing Asset for Instagram, YouTube, or an email newsletter is a
 * **Distribution Adaptation** (Layer 3, see
 * domains/publishing/distribution-adaptation.ts). Neither layer belongs
 * in this file anymore.
 *
 * Reserved, not built: structured forms of Knowledge Assets beyond a
 * plain chapter/book — a citation as its own record (rather than prose
 * inside a generated Evidence Cards output), a research note, a
 * timeline, an annotation, a concept/taxonomy entry richer than today's
 * flat category list. These would extend this layer; they are not
 * publishing formats and don't belong in publishing-asset.ts.
 */
export type FutureKnowledgeAssetKind =
  | "research_note"
  | "citation_record"
  | "timeline"
  | "annotation"
  | "concept";
