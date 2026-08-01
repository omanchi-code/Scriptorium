/**
 * Recommendations & Automation
 * -----------------------------
 * This file tracks which pieces of automated/intelligent publishing are
 * real code today vs. still just named, so it doesn't go stale the way
 * "reserved" documentation tends to.
 *
 * Real, as of the "activate the doctrine" pass:
 * - Publishing Profiles (./profiles.ts) — named output bundles, with a
 *   real expandProfile() function. Nothing calls it yet; the UI still
 *   only ever requests one output at a time.
 * - Capabilities (./capabilities.ts) — Generation Plans express what a
 *   step needs, not which vendor provides it.
 * - Provenance-aware reuse (./transformation-graph.ts's PublishingGraph,
 *   resolveInputForKind() in
 *   ./engine.ts) — this is now genuinely executed, not just described:
 *   six of eleven output kinds prefer building from an existing
 *   Publishing Asset in the session (including podcast_script, a
 *   Publishing Asset itself, deriving from blog_article), the engine
 *   auto-generates that asset if it's missing, and the relationship is
 *   recorded on `Generation.derivedFromId`. This was the biggest
 *   remaining gap between "the plan can describe this" and "the engine
 *   does this" — it's closed for the graph-driven reuse mechanism
 *   specifically.
 * - Optimization policy metadata (`rationale`, `optimizationGoal` on
 *   every PublishingGraph rule) — real, populated for all eleven kinds,
 *   and deliberately inert: the Engine reads only `source` and
 *   `autoGenerate` off each rule (verified — grep engine.ts, plan.ts,
 *   and persistence.ts for `rationale`/`optimizationGoal` and find
 *   nothing). This is the clearest example in the codebase of "real
 *   data, zero behavior" — populated ahead of anything that reads it,
 *   specifically so a future planner can be built by teaching the
 *   Engine to consult these fields, not by re-deriving them from
 *   scratch.
 *
 * Still just named, no code:
 * - Shared multi-output artifacts (groupSharedSteps() in ./plan.ts,
 *   `consumesArtifact`/`chapter_summary`/`extracted_evidence`) — a
 *   *different* mechanism from PublishingGraph above, for when
 *   2+ outputs are requested together in one buildPlan() call sharing
 *   one upstream artifact. Still unexecuted: the Studio only ever
 *   requests one output per call, so this never actually triggers. Not
 *   to be confused with the now-real single-output reuse above.
 * - Suggested outputs: a plan step or profile marked as machine-proposed
 *   rather than user-chosen. Would need a `suggestedBy: "user" |
 *   "recommendation"` field on PlanStep — not added yet because nothing
 *   produces suggestions to mark.
 * - Preferred providers: capabilities.ts already separates "what's
 *   needed" from "who provides it" — a preference system choosing
 *   between multiple providers for the same capability would extend
 *   that file, not restructure it.
 * - User/organization presets: preferences that pick a default profile
 *   or override individual settings without duplicating the profile
 *   itself.
 * - Automation rules: e.g. "generate a Newsletter within an hour of a
 *   Blog Article." Expressible as a rule that watches Generation history
 *   (a permanent, queryable record — the `status`, `plan`, `layer`, and
 *   `providerMetadata` fields on Generation, plus
 *   PublishingSession.requestedOutputs) and calls runPublishingEngine on
 *   a schedule or trigger.
 */
export {};
