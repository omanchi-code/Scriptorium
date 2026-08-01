# Knowledge domain

Scriptorium's intellectual model — Layer 1 of the Three-Layer
Transformation Model (Knowledge Asset → Publishing Asset → Distribution
Adaptation; see `domains/publishing/publishing-asset.ts` and
`distribution-adaptation.ts` for the other two). This domain owns only
what the author creates directly: chapters, books, sources, and
taxonomy — not what those get transformed into.

**A correction, stated plainly:** this file used to open with "Books,
articles, videos, Evidence Cards, and future formats are all expressions
of knowledge." Under the Three-Layer Model that's wrong — an article or
an Evidence Card is a *transformation* of knowledge (Layer 2 or 3), not
knowledge itself. See `domains/knowledge/knowledge-asset.ts` for the
corrected definition.

## What's here (real code, in use today)

- **`asset-kinds.ts`** — the taxonomy of output kinds Scriptorium can
  produce (`OUTPUTS`), consumed by both the Studio UI and the Publishing
  domain's adapter registry. Note: these are Layer 2/3 outputs, not
  Layer 1 Knowledge Assets — this file's presence in the Knowledge
  domain is about it being shared taxonomy data, not a claim about which
  layer its contents belong to.
- **`taxonomy.ts`** — blog category taxonomy (`CATEGORIES`).
- **`sources.ts`** — the categories of sourcing the Evidence Library
  organizes around (`SOURCE_TYPES`).
- **`knowledge-asset.ts`** — the corrected Layer 1 definition: the
  chapter, the book, sources/citations, taxonomy — author-created,
  pre-publication. Reserves space for structured future Layer 1 kinds
  (research note, citation record, timeline, annotation, concept) that
  aren't built yet. This is *not* where course/lecture/white paper/
  research paper live anymore — those moved to
  `domains/publishing/publishing-asset.ts` as Layer 2 reserved kinds,
  since they're publishing formats, not raw knowledge.

## What's reserved, not built

The brief this domain was built against names Sources, Citations,
Relationships, Taxonomy, Search, and Metadata as Knowledge's eventual
territory. Today, only Sources (as categories, not individual citation
records) and Taxonomy (blog categories) have real code. The rest are
deliberately not represented as empty folders:

- **Citations** — individual claim-to-source records (e.g. "this
  specific sentence in Chapter 7 cites this specific verse"). Right now
  citations only exist as prose inside generated text (see the
  `evidence_cards` output in `domains/publishing/adapters/text.ts`) —
  there's no structured record of them yet.
- **Relationships** — e.g. a source reused across multiple books, or
  articles that share a citation. Doesn't exist yet; would need
  Citations to exist first.
- **Search** — over the Evidence Library or the knowledge base generally.
  Doesn't exist yet; the Evidence Library page is currently static.

When any of these get built, they belong in this domain, alongside
`sources.ts`, not as a new top-level folder — the folder isn't created
now because there's no code to put in it yet, not because the concept
doesn't matter.

The brief this domain was built against names Sources, Citations,
Relationships, Taxonomy, Search, and Metadata as Knowledge's eventual
territory. Today, only Sources (as categories, not individual citation
records) and Taxonomy (blog categories) have real code. The rest are
deliberately not represented as empty folders:

- **Citations** — individual claim-to-source records (e.g. "this
  specific sentence in Chapter 7 cites this specific verse"). Right now
  citations only exist as prose inside generated text (see the
  `evidence_cards` output in `domains/publishing/adapters/text.ts`) —
  there's no structured record of them yet.
- **Relationships** — e.g. a source reused across multiple books, or
  articles that share a citation. Doesn't exist yet; would need
  Citations to exist first.
- **Search** — over the Evidence Library or the knowledge base generally.
  Doesn't exist yet; the Evidence Library page is currently static.

When any of these get built, they belong in this domain, alongside
`sources.ts`, not as a new top-level folder — the folder isn't created
now because there's no code to put in it yet, not because the concept
doesn't matter.
