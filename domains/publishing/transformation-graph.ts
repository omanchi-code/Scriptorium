import { OutputKind } from "@/domains/knowledge/asset-kinds";

export type OptimizationProfile = {
  /** Relative priority (0.0–1.0) placed on getting the best possible
   * result — worth spending more time/cost for, not a claim about
   * absolute output quality. */
  quality: number;
  /** Relative priority (0.0–1.0) placed on minimizing spend. Higher
   * means "keep this cheap" matters more here than elsewhere in the
   * graph, not an absolute dollar figure. */
  cost: number;
  /** Relative priority (0.0–1.0) placed on responding quickly. Higher
   * means "this should feel fast" matters more here, not a millisecond
   * budget. */
  latency: number;
};

export type ExecutionType = "direct" | "derived" | "pipeline";

/**
 * Every transformation rule models four independent concerns, and
 * they're kept independent on purpose — conflating them is how a graph
 * like this rots into an unreadable pile of tuning knobs:
 *
 *   1. Dependency — source, autoGenerate. What this output should be
 *      generated from, and whether the engine should produce that
 *      source automatically if it's missing. This is the only part any
 *      code reads today.
 *   2. Architectural Rationale — rationale. Why that dependency exists,
 *      in prose a person can evaluate and disagree with, not just a
 *      pointer to follow.
 *   3. Execution Type — executionType. *How* this output is produced,
 *      independent of the dependency chain itself: "direct" (from the
 *      chapter), "derived" (from one other Publishing Asset), or
 *      "pipeline" (the chain itself is two or more hops deep before
 *      this output is reached).
 *   4. Optimization Policy — optimizationGoal. The preferred balance of
 *      quality, cost, and latency for this output, for a future
 *      planner that doesn't exist yet.
 *
 * Version 1.0 (today) consumes only #1. The Engine does not read
 * `rationale`, `executionType`, or `optimizationGoal` — verify this
 * yourself in engine.ts's resolveInputForKind() if in doubt; it
 * destructures only `source` and `autoGenerate` off whatever rule it
 * looks up. #2–#4 exist so future optimization, intelligent planning,
 * and adaptive publishing can be built by *evolving this graph*, not by
 * rewriting the Engine.
 */
export type TransformationRule = {
  /** What this output builds from when it derives from something —
   * another output kind, or the literal chapter (the raw Knowledge
   * Asset, not another Generation). */
  source: OutputKind | "chapter";
  /** Why this source, specifically — the architectural reasoning, not
   * a restatement of the dependency itself. */
  rationale: string;
  /** How this output is produced, independent of *what* it depends on:
   *   - "direct": source is literally "chapter."
   *   - "derived": source is one other output, and that output's own
   *     source is "chapter" — a single hop.
   *   - "pipeline": source is one other output, but *that* output's
   *     source isn't "chapter" either — the real chain is two or more
   *     hops deep before this one is reached (today, only
   *     youtube_short: chapter → blog_article → podcast_script →
   *     youtube_short).
   * This is fully implied by `source` values elsewhere in the graph —
   * it's written here as a literal per-entry field rather than computed,
   * matching this file's existing style (rationale/optimizationGoal are
   * hand-written too), but that means it can drift from `source` if one
   * changes without the other. If you change a `source` value, check
   * whether `executionType` still holds for it and for anything whose
   * chain passes through it. */
  executionType: ExecutionType;
  optimizationGoal: OptimizationProfile;
  /** Whether the engine should generate `source` automatically if it
   * doesn't exist yet in the session. Irrelevant when source is
   * "chapter" — the chapter always exists.
   *
   * A deliberate deviation from this field's originating brief, worth
   * stating plainly: the brief's own TransformationRule sketch omitted
   * `autoGenerate` entirely. It's kept here because it's the one field
   * that's actually load-bearing today — engine.ts reads it to decide
   * whether to generate a missing prerequisite — and the same brief
   * that introduced `rationale`/`optimizationGoal` also required
   * "runtime behavior must remain unchanged." Dropping autoGenerate
   * would have silently broken the reuse/auto-generate behavior from
   * the prior pass, which outranks matching an illustrative interface
   * sketch verbatim. */
  autoGenerate: boolean;
  cacheable?: boolean;
  supportsParallelGeneration?: boolean;
  invalidates?: OutputKind[];
};

/**
 * The graph. A total mapping — `Record<OutputKind, ...>` means
 * TypeScript won't compile if a new output kind is added to
 * asset-kinds.ts without a corresponding entry here.
 *
 * On reading the `optimizationGoal` numbers: higher means *more
 * priority placed on that objective*, not a bigger absolute number of
 * that thing. `seo_metadata`'s `cost: 0.9, latency: 1.0` means "keeping
 * this cheap and fast matters a lot here," the same way
 * `blog_article`'s `quality: 1.0, latency: 0.2` means "worth taking
 * time to get right, speed barely matters." This polarity isn't fully
 * specified in the brief this was built against; it's worth stating
 * explicitly here so the numbers mean the same thing to whoever reads
 * them next.
 */
export const PublishingGraph: Record<OutputKind, TransformationRule> = {
  // Direct — source is literally "chapter."
  blog_article: {
    source: "chapter",
    rationale:
      "The blog article becomes the editorial foundation from which multiple downstream publishing assets can be consistently derived.",
    // The brief this field was built against gave blog_article as
    // "derived" in its own example — that contradicts blog_article's
    // actual `source: "chapter"` above, and contradicts the brief's own
    // definition of "direct" ("generated directly from the chapter").
    // The brief also said "use the current graph relationships as the
    // source of truth," which is what's followed here instead of the
    // example: blog_article has no upstream Publishing Asset, so it's
    // "direct," not "derived."
    executionType: "direct",
    optimizationGoal: { quality: 1.0, cost: 0.4, latency: 0.2 },
    autoGenerate: false,
  },

  evidence_cards: {
    source: "chapter",
    rationale:
      "Evidence extraction is the editorial foundation for citation-backed formats — accuracy here determines whether every downstream evidence-based asset can be trusted, so it should be reasoned over the source chapter directly rather than a secondary retelling of it.",
    executionType: "direct",
    optimizationGoal: { quality: 1.0, cost: 0.5, latency: 0.3 },
    autoGenerate: false,
  },

  cinematic_artwork: {
    source: "chapter",
    rationale:
      "Key art is a visual companion to the chapter's mood, not a repackaging of another asset's wording — it should respond to the chapter directly rather than inherit a text transformation's particular interpretation of it.",
    executionType: "direct",
    optimizationGoal: { quality: 0.6, cost: 0.1, latency: 0.2 },
    autoGenerate: false,
  },

  newsletter: {
    source: "chapter",
    rationale:
      "An announcement email's job is to prompt a click, not stand alone as the content — it doesn't need to inherit the editorial depth of a fully developed article, and no single existing asset among today's outputs is unambiguously what it's 'about.'",
    executionType: "direct",
    optimizationGoal: { quality: 0.5, cost: 0.3, latency: 0.2 },
    autoGenerate: false,
  },

  book_trailer: {
    source: "chapter",
    rationale:
      "A trailer's own two-step pipeline (keyframe, then video) already carries meaningful cost and latency on its own; building it from an intermediate text asset would add a dependency without improving a cinematic result that's driven by the artwork prompt, not by editorial prose.",
    // Its internal keyframe→video chain is an adapter implementation
    // detail, not a cross-output dependency — at the graph level this
    // is still "direct," the same way the brief's own example has it.
    executionType: "direct",
    optimizationGoal: { quality: 0.7, cost: 1.0, latency: 1.0 },
    autoGenerate: false,
  },

  // Derived — one hop from a Publishing Asset whose own source is "chapter."
  podcast_script: {
    source: "blog_article",
    rationale:
      "Long-form editorial prose provides stronger narrative flow and transitions for spoken delivery than raw chapter text.",
    executionType: "derived",
    optimizationGoal: { quality: 0.9, cost: 0.6, latency: 0.5 },
    autoGenerate: true,
  },

  seo_metadata: {
    source: "blog_article",
    rationale:
      "SEO metadata describes a page that has to already exist in some form — deriving it from the finished article keeps the title tag and description accurate to what actually got published, rather than guessed at from source material that may not match the final piece.",
    executionType: "derived",
    optimizationGoal: { quality: 0.5, cost: 0.9, latency: 1.0 },
    autoGenerate: true,
  },

  facebook_post: {
    source: "blog_article",
    rationale:
      "A social post promoting the article should stay consistent with what the article actually says — building from the published article avoids the post over-promising or drifting from the piece it's meant to drive traffic to.",
    executionType: "derived",
    optimizationGoal: { quality: 0.5, cost: 0.8, latency: 0.9 },
    autoGenerate: true,
  },

  instagram_reel: {
    source: "blog_article",
    rationale:
      "Same reasoning as the Facebook post: the on-screen hook and caption should track the published article's actual claims, not reinterpret the raw chapter independently and risk drifting from it.",
    executionType: "derived",
    optimizationGoal: { quality: 0.5, cost: 0.8, latency: 0.9 },
    autoGenerate: true,
  },

  evidence_card_image: {
    source: "evidence_cards",
    rationale:
      "Visual rendering should inherit the wording and structure of the finalized Evidence Card rather than regenerate from the chapter.",
    executionType: "derived",
    optimizationGoal: { quality: 0.8, cost: 0.5, latency: 0.4 },
    autoGenerate: true,
  },

  // Pipeline — the only kind in the graph whose real chain is 2+ hops
  // deep: chapter → blog_article → podcast_script → youtube_short.
  youtube_short: {
    source: "podcast_script",
    rationale:
      "A structured podcast script provides narration and pacing better suited for short-form video.",
    executionType: "pipeline",
    optimizationGoal: { quality: 0.7, cost: 0.4, latency: 0.3 },
    autoGenerate: true,
  },
};
