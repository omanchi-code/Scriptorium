# Scriptorium

The digital publishing platform of Omanchi-Job Agbo — Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## What's built (Stage 1)

- **Home** — hero, featured books, blog categories, evidence library & newsletter teasers
- **About the Author**
- **Books** — index + dynamic `[slug]` detail page (add new titles in `domains/books/data.ts`, no new routes needed)
- **Blog** — category-filtered index, empty-state ready for posts
- **Evidence Library** — source-type index
- **Newsletter** — working signup form UI (not yet wired to an email provider)
- **Resources** — downloadable materials index
- **Media** — video / podcast / press index
- **Contact** — working contact form UI (not yet wired to a backend)
- **AI Studio** (`/studio`, login required) — paste a chapter (or upload a
  photo of a physical page — Claude transcribes it), generate its
  Evidence Cards (text), a branded Evidence Card image, Blog Article,
  YouTube Short script, Instagram Reel script, Facebook post, Podcast
  script, Newsletter draft, and SEO metadata via the Anthropic API;
  Cinematic Artwork via Pollinations.ai (free); Book Trailer via Runway
  (paid, async — generates a keyframe, then animates it, polling until
  ready). Every generation is saved to Postgres and viewable in the
  History panel below the generator.

Design system: near-black background, warm off-white ink, a single brass
accent, hairline dividers, and a bracket-link (`[ Like this ]`) motif used
throughout for all interactive text. Typefaces: Spectral (display serif),
Inter (body), IBM Plex Mono (labels/metadata). The homepage's signature
interactive element is the "One Chapter. Infinite Possibilities."
animated transformation diagram (`domains/publishing/components/TransformationDiagram.tsx`)
— radial on desktop, vertical flow on mobile, SVG connectors + Framer
Motion, revealed on scroll via `whileInView`, drawing outward one
direction at a time (not a blanket stagger — each line/node computes its
own delay via Framer Motion's `custom` prop). The center node pulses
gently at rest; hovering an output highlights its line back to center.
The component takes `outputs`/`onSelect` props rather than hardcoded data
specifically so it can be reused later as an actual interactive
publishing workflow (pick a chapter → pick a destination → generate →
track status) without a rewrite — that's not built yet, just architected
for. "Every asset shares one source of truth" (your original research) is
now part of the site's core language, not just a one-off line — worth
keeping consistent if you add more copy elsewhere. The site-wide
navigation signature is the full-screen "Table of Contents" index, opened
from the **Index** link in the header.

## Setup

**On a phone with no laptop?** See `REPLIT.md` instead — it covers
running this entirely from Replit's mobile-friendly workspace.

1. **Database.** Create a free Postgres instance — [Neon](https://neon.tech),
   [Supabase](https://supabase.com), and [Vercel Postgres](https://vercel.com/storage/postgres)
   all have no-cost tiers. Copy the connection string.
2. **Environment.** Copy `.env.example` to `.env.local` and fill in
   `DATABASE_URL`. Generate an auth secret with `npx auth secret` (or
   `openssl rand -base64 33`) and set it as `AUTH_SECRET`. Set
   `ADMIN_EMAIL` / `ADMIN_PASSWORD` to whatever you want to log in with.
3. **Install & migrate.**
   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run seed
   ```
   `npm run seed` creates your admin account from `ADMIN_EMAIL` /
   `ADMIN_PASSWORD`. Re-run it any time after changing `ADMIN_PASSWORD` to
   reset it.
4. **Run it.**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000. Sign in at `/login` to reach `/studio`.

If `npm install` complains about the `next-auth` version (it's pinned to
the `beta` dist-tag, since Auth.js v5 is still versioned that way as of
this writing), run `npm install next-auth@beta` directly.

## Login & AI Studio access

`/studio` and its API routes (`/api/generate`, `/api/generate/status`,
`/api/generations`) are gated by `middleware.ts` — signed-out visitors are
redirected to `/login` (or get a 401 for API calls). There's no public
sign-up; this is a single-admin setup by design, since Studio generations
cost real API credits. The account lives in the `User` table and is
created via `npm run seed`, not through the UI.

Auth is [Auth.js v5](https://authjs.dev) with a Credentials (email +
password) provider, JWT sessions, and passwords hashed with bcrypt. The
config is deliberately split into `auth.config.ts` (edge-safe, used by
`middleware.ts`) and `auth.ts` (the full config with Prisma + bcrypt,
which need the Node runtime and can't run in Edge middleware).

## AI Studio: generation providers

### Text (Anthropic) — required for 8 of 10 outputs

Evidence Cards, Blog Article, YouTube Short, Instagram Reel, Facebook
post, Podcast script, Newsletter, SEO metadata all call the Anthropic API
from `app/api/generate/route.ts` — nothing runs client-side, no key is
ever exposed to the browser.

Set `ANTHROPIC_API_KEY` in `.env.local` (get one at
https://console.anthropic.com). Without it, those cards show a clear
error rather than failing silently.

### Cinematic Artwork (Pollinations.ai) — free, no key

Wired to [Pollinations.ai](https://pollinations.ai), a free, open-source
image API that needs no account or key — you fetch a URL and it streams
back a generated image. `domains/publishing/providers/pollinations.ts` builds that URL;
`domains/studio/components/StudioResults.tsx` renders it as an `<img>`, so generation
happens the moment the browser loads the image.

Worth knowing: this is a free community service, not something with an
uptime SLA or commercial terms. Fine for a personal author platform;
worth revisiting if this ever needs guaranteed availability. If you'd
rather use Runway for artwork too (same account as the trailer, paid),
`domains/publishing/providers/runway.ts` already exports `createRunwayImage()` /
`buildArtworkPrompt()` — swap the `cinematic_artwork` branch in
`app/api/generate/route.ts` to call those instead of
`buildPollinationsImageUrl()`.

I looked for a similarly solid *free* option for video and didn't find
one I'd trust wiring into a real backend — the free video generators that
turn up are mostly consumer web apps with watermarks and daily credit
caps, not documented APIs, so quality and reliability are unverified.
Runway remains the video path for that reason.

### Book Trailer (Runway) — paid, required for that one output

1. Get an API key from your Runway developer dashboard
   (https://dev.runwayml.com)
2. Add `RUNWAY_API_KEY=...` to `.env.local`

Book Trailer generates its own keyframe, then animates it — video
rendering is async and can take a minute or more, so the flow is: the
route creates the keyframe, kicks off the video task, and returns
immediately with a task id; the browser polls
`app/api/generate/status/route.ts` every few seconds until Runway reports
the video is ready, then plays it inline and updates the saved row in
Postgres.

Two caveats, both noted in code comments: Runway occasionally
renames/retires model slugs faster than docs can track (override
`RUNWAY_IMAGE_MODEL` / `RUNWAY_VIDEO_MODEL` in `.env.local` if generation
fails with a "model not found" error), and `domains/publishing/providers/runway.ts` parses the
task-status response defensively since I couldn't test it against a live
account from here.

A hosting note: the route waits (briefly) for the keyframe before
returning, which can take up to ~30 seconds — Vercel's free Hobby plan
caps functions at 10 seconds, so this needs at least a Pro plan
(`maxDuration` is set in `app/api/generate/route.ts`) or self-hosting.

## Evidence Card (Image)

This is a real branded-graphic renderer, not a mockup: Claude extracts one
quote and three guiding principles from the chapter, Pollinations
generates a matching background, and `next/og` (Satori) composites the
actual PNG — black/gold frame, numbered header, styled quote, principle
rows, signature, footer link — the same structure as your ChatGPT-designed
originals.

**What it can't do: reproduce those originals exactly.** Three specific
things are approximated, not cloned:

- **Background art** — yours came from a specific AI image tool with its
  own style; this pipeline generates a *new* photographic background per
  card via Pollinations, matched to the claim by prompt, not pixel-identical
  to your originals.
- **Fonts** — `domains/media/evidence-card/fonts.ts` uses Playfair Display (quote),
  Inter (labels), and Great Vibes (signature) from Google Fonts, fetched
  dynamically at render time. Close in spirit to the originals; not
  guaranteed to be the exact typefaces used there.
- **Icons** — rendered as emoji in circular badges (📖 🔗 🎯), since that's
  a built-in, reliably-supported feature of `next/og` — not custom line
  icons matching your originals' exact glyphs.

The layout, numbering system, three-principle format, and color palette
are real and reusable, though — and the whole thing is editable in one
place (`domains/media/evidence-card/renderer.tsx`) if you want to adjust proportions,
swap fonts, or change the icon set once you see the first output.

A technical note on durability: the Google Fonts fetch trick in
`domains/media/evidence-card/fonts.ts` (an old-browser User-Agent makes Google
return TTF instead of WOFF2, which Satori needs) is a known community
technique, not an official API contract — if it breaks, that's the first
place to look. Cards are rendered fresh on every request from stored JSON
(`prisma.generation.content`) rather than saved as image files, so
there's no extra storage to manage — but it also means each view re-fetches
fonts and the background image, which is fine for a personal site's
traffic but worth knowing.

## Scan a page (photo → text)

Above the chapter text box in the Studio, "Scan a page photo" lets you
upload a photo of a physical book page. The browser downscales it
client-side (long edge capped at 1600px, re-encoded as JPEG) before
sending it to `/api/ocr`, where Claude reads the text directly from the
image — no separate OCR service. The downscaling step matters beyond
speed: Vercel's serverless functions cap request bodies around 4.5MB, and
a full-resolution phone photo can exceed that on its own before base64
encoding inflates it further.

## Internal architecture: domains, not framework folders

The codebase is organized around what Scriptorium *is*, not around
Next.js/React conventions. `app/` is Next's routing layer and stays thin
— it holds pages and route handlers, each just a few lines that call into
a domain. Everything with actual logic lives in `domains/`:

```
domains/
  publishing/       The Scriptorium Engine: workflows, output adapters, AI
                    orchestration, asset lifecycle, generation history
    engine.ts         runPublishingEngine() — resolve session, build plan,
                      delegate to an adapter, persist, log. Every output
                      runs through this one function.
    plan.ts           GenerationPlan — requestedOutputs is an array; built
                      before any provider is called; can express cross-output
                      shared-artifact dependencies (see "Section D" below).
    layers.ts         Real kind→layer classification (Publishing Asset vs.
                      Distribution Adaptation), persisted on every Generation.
    transformation-graph.ts  PublishingGraph — the single source of truth
                      for dependency (source/autoGenerate, the only part
                      the Engine reads), rationale (why), and optimization
                      policy (quality/cost/latency priority — inert today).
                      A total, compiler-enforced mapping over every OutputKind.
    publishing-asset.ts       Layer 2 doctrine + reserved future kinds.
    distribution-adaptation.ts  Layer 3 doctrine + reserved future kinds.
    capabilities.ts   Capability → current-provider mapping — plans declare
                      what a step needs, never which vendor provides it.
    artifacts.ts      Named intermediate artifact vocabulary (some real,
                      most reserved — see "Section D" below).
    profiles.ts        Publishing Profiles — named output bundles +
                      expandProfile(). Real code; nothing calls it yet.
    session.ts        resolveSession() — reuses or creates the
                      PublishingSession a generation belongs to; also
                      records every output kind ever requested within it.
    registry.ts       Maps each OutputKind to its adapter; fails fast at
                      import time if one's missing.
    persistence.ts    The only place Generation rows get created/updated
                      (including failed generations — see below).
    logging.ts        logGenerationEvent() — one seam for future analytics.
    async-tasks.ts    Polling logic for async video generation.
    recommendations.ts  Tracks which recommendation/automation pieces are
                      real vs. still just named — see "Section D" below.
    types.ts          The shared contract every adapter implements.
    adapters/         One file per output type — text.ts covers all 8 text
                      outputs via one factory (each just supplies a prompt);
                      cinematic-artwork.ts, book-trailer.ts, and
                      evidence-card-image.ts handle the three that need a
                      media provider or structured extraction.
    providers/        Raw API clients — anthropic.ts, runway.ts,
                      pollinations.ts. No orchestration logic, just the
                      integration itself.
    components/       TransformationDiagram.tsx — a Publishing Workflow
                      visualization, not generic UI.

  knowledge/        Scriptorium's intellectual model, independent of format
    asset-kinds.ts    The taxonomy of output kinds (OUTPUTS) — read by both
                      the Studio UI and the Publishing registry. Also
                      isOutputKind() (runtime validation) and a compile-time
                      check that this stays in sync with the Prisma enum —
                      see "Data layer" below.
    taxonomy.ts       Blog category taxonomy.
    sources.ts        Citation/source categories the Evidence Library
                      organizes around.
    knowledge-asset.ts  Documents the Knowledge Asset abstraction itself
                      and reserves space for future formats (course,
                      lecture, white paper, etc.) that aren't built yet.
    README.md         What's real vs. reserved-but-not-built in this domain
                      (Citations, Relationships, and Search don't have
                      folders yet because there's no code for them —
                      see the README for why that's deliberate).

  books/            data.ts (book metadata) + components/BookCard.tsx
                    (one component, two layout variants — used by both
                    the homepage preview and the /books index, instead of
                    duplicating the markup in both places)

  media/            evidence-card/renderer.tsx + fonts.ts — the actual
                    Evidence Card image-rendering template. Deliberately
                    separate from publishing/adapters/evidence-card-image.ts:
                    the adapter orchestrates *when* to produce a card; this
                    domain owns *how it's actually composited*.

  studio/           components/ (StudioLayout, StudioToolbar, StudioResults,
                    StudioHistory, StudioUpload) + hooks/ (business logic,
                    see "Component architecture" below) + ocr.ts
                    (page-photo transcription — Studio's input side,
                    distinct from Publishing's output side)
```

Each domain has an `index.ts` barrel exporting its public surface, so
`import { runPublishingEngine } from "@/domains/publishing"` works
alongside deeper imports where that's clearer — both are valid, pick
whichever reads better at the call site.

**What's deliberately *not* a top-level domain:** a Dashboard folder
(nothing's built there yet — it'll get one when it exists, not before),
a separate Evidence folder (Evidence Library's data lives in
`domains/knowledge/sources.ts` since it's genuinely a Sources/Citations
concern, not a fourth silo alongside Knowledge), and empty
Citations/Relationships/Search folders (documented as reserved in
`domains/knowledge/README.md` instead of scaffolded empty). The goal was
cohesion, not five equally-sized folders for symmetry's sake.

**What stayed generic, on purpose:** `components/` still holds Nav,
Footer, NewsletterForm, ContactForm, LoginForm, and SignOutButton — site
chrome and simple forms with no business-domain logic in them.
`lib/prisma.ts` (the DB client) and `lib/actions.ts` (auth server
actions) stay put too, since they're framework/infra plumbing every
domain uses, not a domain themselves. `auth.ts`, `auth.config.ts`, and
`middleware.ts` stay at the project root, where Next.js and Auth.js
expect them.

**Adding a new output type** going forward means: one new adapter file in
`domains/publishing/adapters/`, one line in
`domains/publishing/registry.ts`, one entry in
`domains/knowledge/asset-kinds.ts` for the UI. No route changes, no
folder restructuring.

**What didn't change:** the UI, the API's request/response shape, the
database schema, and user-facing behavior are all identical to before
this reorganization.

## Component architecture: composition over monolith

The Studio UI was a single ~270-line component (`StudioClient.tsx`)
mixing state, fetch calls, polling, and rendering. It's now split by
responsibility:

```
components/ui/            Generic primitives, used anywhere
  ActionButton.tsx           The site's bracket-link pattern, as a component
                             instead of a repeated className string
  Panel.tsx / Card.tsx       Static vs. clickable containers
  Section.tsx                The hairline + container-page page-section wrapper
  EmptyState.tsx / LoadingState.tsx
  StatusBadge.tsx             Extracted verbatim from Studio's old inline version

domains/studio/
  types.ts                   StudioCardViewModel, StudioHistoryItemViewModel —
                             clean shapes components receive; never the raw
                             /api/generate response or a Prisma row
  constants.ts                Shared sample text (was duplicated before this pass)
  image-processing.ts         Pure downscaling logic — data processing, not UI
  hooks/
    useStudioGeneration.ts     Owns all generation state, fetches, and polling.
                               The only place in the Studio UI layer that
                               imports the Knowledge domain (for OUTPUTS).
    useStudioHistory.ts         Owns the history fetch and resolves each row's
                               `kind` to a display label — the component
                               never does that lookup itself.
    useStudioUpload.ts          Owns the upload → downscale → transcribe flow.
  components/
    StudioLayout.tsx            Composes Toolbar + Results. ~35 lines, no
                               fetch calls, no domain imports — pure composition.
    StudioToolbar.tsx           The chapter input form. Props in, events out.
    StudioResults.tsx           The output card grid. Props in, events out.
    StudioHistory.tsx           Renders useStudioHistory()'s output.
    StudioUpload.tsx            Renders useStudioUpload()'s output.
```

Every component under `domains/studio/components/` now does one of two
things: render UI from props, or compose other components — none of them
call `fetch` directly anymore, and only `useStudioGeneration.ts` and
`useStudioHistory.ts` import from `domains/knowledge`. That's the concrete
form of "components describe interfaces, not workflows" from the brief
this was built against.

`domains/books/components/BookCard.tsx` was updated to build on the new
`Card` primitive (its `card` variant only — the `row` variant used on
`/books` is a structurally different grid pattern, not forced into the
same primitive just for symmetry).

**Deliberately not done:** the rest of the site (`Nav`, `Footer`,
`NewsletterForm`, `ContactForm`, the homepage, `/about`, the book detail
page) still uses the raw `bracket-link` className directly rather than
`<ActionButton>`. This refinement was scoped to the Studio domain — the
brief's own worked example — not a repo-wide sweep. The primitive is
available; adopting it elsewhere is a mechanical, low-risk change
whenever it's worth doing, not required by this pass.

## Publishing workflow architecture: intent, not tool selection

Before this pass, the Studio worked like a collection of AI tools: click
"Generate," a route calls a provider, done. That's been restructured so
the Studio expresses *intent* ("publish this chapter") and the Engine
owns everything about *how*:

```
Knowledge Asset → Generation Plan → Publishing Engine → Adapters → Providers
```

**Generation Plan** (`domains/publishing/plan.ts`) — built *before* any
provider is called, for every single output, not just the complex ones.
It describes the real execution shape: most outputs are one step with no
dependencies; `book_trailer` and `evidence_card_image` are described as
the two-step chains they actually are internally (keyframe → video;
extract → background), because that's genuinely what happens, not
invented structure. The plan is persisted alongside its result (see
below), so it's inspectable after the fact, not just at request time.

**Publishing Session** (`domains/publishing/session.ts`, new
`PublishingSession` table) — every output generated while working on a
chapter in the Studio now belongs to one session, resolved by the Engine
and echoed back to the client, which threads it into every subsequent
request for that chapter (`useStudioGeneration.ts`). Individual
per-card clicks and "Generate All" both feed the same session as long as
you're on the same Studio page load — outputs are related artifacts now,
not isolated jobs.

**What the UI never does:** `useStudioGeneration.ts` sends `{ kind,
chapterTitle, chapterText, bookLabel, sessionId }` and receives back a
result plus the session id — it has no idea Runway, Pollinations, or
Anthropic exist. The route handler is unchanged in shape; the Engine does
five things in order for every request now (validate → resolve session →
build plan → delegate to adapter → persist + log) instead of three.

**Two real, user-visible changes worth knowing about, not just internal
refactoring:**

1. **Failed generations are now persisted.** Before this pass, an error
   left no trace — nothing was written to the database. Now every
   generation, successful or not, gets a row with an explicit `status`
   (`"done" | "processing" | "error"`) and, on failure, an
   `errorMessage`. The Studio's History panel will now show failed
   attempts (expandable to see why), where it previously wouldn't have
   shown them at all. This is a deliberate change — Refinement 4 treats
   publishing history as a permanent record, and a record that only
   remembers successes isn't one — but it does mean History will look
   different (more populated) than before.
2. **New database columns require a migration.** `PublishingSession` is
   a new table; `Generation` gained `sessionId`, `plan`, `providerMetadata`,
   `status`, and `errorMessage`. Run
   `npx prisma migrate dev --name add_publishing_sessions` before this
   version will work against an existing database.

**Reserved, not implemented as of the prior pass:** suggested outputs,
preferred-provider selection, reusable generation profiles, publishing
templates, and automation rules were named as future extension points.
Section D (below) made some of those real.

## Section D: multi-output plans, capabilities, profiles

The previous pass's Generation Plan represented one requested output at
a time. This pass restructured it to represent many — without adding any
UI to request more than one, and without changing what a single request
does today. Three things are genuinely new code, not just documentation:

**`requestedOutputs: OutputKind[]`** (`domains/publishing/plan.ts`) — the
plan's defining field is an array now. `buildPlan(requestedOutputs,
sessionId, input, profileId?)` is the one real planning algorithm;
`buildGenerationPlan(kind, sessionId, input)` — what the Engine and
Studio actually call today — is a thin wrapper calling `buildPlan([kind],
...)`. There's no second implementation to keep in sync.

**Capabilities, not providers** (`domains/publishing/capabilities.ts`) —
a plan step now declares `requiresCapability` (`long_form_reasoning`,
`image_generation`, `cinematic_video`, `ocr`, `speech_synthesis`), never
a vendor name. `CAPABILITY_PROVIDER` is the one place that maps a
capability to whoever currently satisfies it. The Engine's provider
metadata (persisted on every Generation row) is now *derived* from a
plan's capabilities instead of a separate hardcoded switch statement
that used to live in `engine.ts` — one source of truth instead of two
that could drift apart. `speech_synthesis` has no provider — nothing
synthesizes audio for Podcast Script today — and is listed anyway so the
capability vocabulary reflects what the architecture anticipates, not
just what's wired up.

**Publishing Profiles** (`domains/publishing/profiles.ts`) — six named
output bundles (Book Launch, Academic Paper, Evidence Series, Social
Media Campaign, Course Creation, Sermon Package), each just a list of
`OutputKind`s and a real `expandProfile()` function. Nothing calls it —
there's no profile picker in the Studio — but it's callable, typed code,
not a comment describing an idea. `course_creation` is honest about a
real gap: "Course" isn't an output kind that exists yet, so that
profile's bundle is a placeholder built from kinds that do exist.

**Shared intermediate artifacts** (`domains/publishing/artifacts.ts`) —
ten named artifact kinds: two real (`keyframe_image`, `card_content`,
`background_image` — matching what `book_trailer` and
`evidence_card_image` already produce internally), the rest reserved
(`chapter_summary`, `outline`, `key_arguments`, `quotations`,
`extracted_evidence`, `keywords`, `glossary`, `references`).

**Cross-output dependencies — real in the type system, illustrative in
behavior.** `groupSharedSteps()` in `plan.ts` demonstrates the brief's
own two examples (Summary → Article/Podcast/Newsletter; Evidence
Extraction → Evidence Cards → a social output) using output kinds that
actually exist in this codebase (the brief's own examples, "Discussion
Guide" and "Instagram Carousel," aren't real kinds here — no new output
was added; the brief was explicit that this section shouldn't add
features). If `blog_article`, `podcast_script`, and `newsletter` were
ever requested *together* in one `buildPlan()` call, the plan would show
them sharing one `chapter_summary` step instead of three independent
ones. **Nothing executes that shared step today** — each adapter still
does its own full work in one call, exactly as before. Since the Studio
only ever requests one output at a time, this logic never actually
triggers in current use; it's there so the plan's *shape* is already
correct the day something requests multiple related outputs together.

**Publishing Session as permanent record** — `PublishingSession` gained
a `requestedOutputs` column, appended to (deduplicated) every time a new
kind is generated within that session
(`domains/publishing/session.ts`'s `recordRequestedOutput`). This needs
another migration: `npx prisma migrate dev --name add_requested_outputs`
against an existing database.

**What I want to be direct about:** the honest gap in this whole section
is between "the Generation Plan can describe X" and "the Engine executes
X." Multi-output requests, shared artifacts, and profiles are all real,
typed, callable code — but nothing in the actual request path uses more
than one output per call yet, and nothing reuses a shared artifact
instead of regenerating it. That's not an oversight; the brief explicitly
scoped this to architecture ("no UI implementation required," "the
objective is not to add features"). `domains/publishing/recommendations.ts`
tracks this same real/reserved line for the recommendation-adjacent
pieces specifically.

## The Three-Layer Transformation Model

This pass introduced a formal doctrine for how everything in Scriptorium
relates: **Knowledge Asset → Publishing Asset → Distribution
Adaptation**. Each layer has its own file now:

- `domains/knowledge/knowledge-asset.ts` — Layer 1: the author's raw
  intellectual work (a chapter, a book, sources, taxonomy). Created by
  the author, never by AI.
- `domains/publishing/publishing-asset.ts` — Layer 2: editorial
  transformations of a Knowledge Asset, channel-independent (an article,
  an Evidence Card collection, a podcast script).
- `domains/publishing/distribution-adaptation.ts` — Layer 3:
  channel-specific repackaging of a Publishing Asset (a YouTube Short, a
  newsletter, an Instagram post). Introduces no new knowledge.

**A correction I want to be upfront about, not bury:** the original
`knowledge-asset.ts` (written in an earlier pass) said every output —
articles, podcast scripts, Evidence Cards — was itself a "Knowledge
Asset." Under this corrected doctrine, that's wrong: those are
transformations *of* knowledge, not knowledge itself. I rewrote that
file rather than leave the old, looser terminology in place, and moved
its reserved future kinds (course, white paper, research paper, etc.) to
`publishing-asset.ts`, where they actually belong as Layer 2 formats.
`knowledge-asset.ts` now reserves a different, correct set (research
note, citation record, timeline, annotation, concept).

**Real classification, not just documentation**
(`domains/publishing/layers.ts`) — every existing output kind is
classified as `"publishing_asset"` or `"distribution_adaptation"`, and
that classification is now persisted on every Generation row (`layer`
column), not just implied. Today's split: `evidence_cards`,
`blog_article`, and `podcast_script` are Publishing Assets; everything
else — `seo_metadata`, `newsletter`, `youtube_short`, `instagram_reel`,
`facebook_post`, `cinematic_artwork`, `book_trailer`,
`evidence_card_image` — is a Distribution Adaptation. Two of those
(`seo_metadata`, `cinematic_artwork`) were judgment calls; the reasoning
for each is in `distribution-adaptation.ts`'s comments rather than
buried in a commit message.

**Provenance — schema-ready, not yet wired** (Refinement 3). `Generation`
gained a self-referencing `derivedFromId`, so a Distribution Adaptation
*could* record which Publishing Asset Generation it came from. Nothing
sets it today: every current adapter still generates directly from the
raw chapter, the same way whether it's Layer 2 or Layer 3. This is the
single most honest gap in this whole pass — the doctrine's ideal is
Knowledge → Publishing → Distribution as a real chain; today's actual
execution is still Knowledge → (Publishing *or* Distribution) as two
parallel paths that happen to share a database table. Wiring true
derivation would mean adapters requiring an upstream Generation to
exist first, which is a behavior change this pass deliberately didn't
make (an alignment exercise, not new features, per the brief).

**Publishing Session as aggregate root** (Article V) — checked against
the brief's full field list: source knowledge (chapterTitle/chapterText/
bookLabel), requested outputs (`requestedOutputs`, from the prior pass),
transformation plan (each Generation's `plan`), providers used
(`providerMetadata`), timestamps (`createdAt`), and generation history
(the `generations` relation) are all real. "Revisions" and cross-session
"relationships" are named in the brief but have zero code behind them —
deliberately not added as empty columns, the same discipline applied to
every other reserved concept in this codebase.

**Hiding AI infrastructure** (Refinement 5) — this pass found and fixed
two real leaks, not hypothetical ones: the Studio page's intro copy
named "Claude, Pollinations, and Runway" directly, and the page-scan
helper text said "what Claude reads off the photo." Both now describe
outcomes, not implementation. Also removed: a vestigial `"stub"` status
or its badge label. It stopped being reachable once every output got a
real provider wired up in an earlier pass, but the dead code — including
a status literally labeled *"Needs provider"* — was still sitting in
`StudioResults.tsx`, `useStudioGeneration.ts`, and the `StudioStatus`
type. Confirmed unreachable before removing it, not just deleted on
suspicion.

**Another migration needed** against an existing database:
`npx prisma migrate dev --name add_layer_and_provenance` (adds `layer`
and `derivedFromId` to `Generation`).

## Activating the doctrine: real provenance-aware execution

The previous two passes deliberately left a gap and said so clearly:
`Generation.derivedFromId` existed in the schema, but nothing set it —
every output still generated directly from the raw chapter regardless of
which layer it belonged to. This pass closes that gap for real, without
touching a single adapter file.

**The mechanism, in one sentence:** when an output prefers building from
an existing Publishing Asset, the Engine substitutes that asset's
content *as* the `chapterText` handed to the adapter — the adapter
receives it through the exact same parameter it's always used, and has
no way to know whether it's looking at the raw chapter or something
already transformed. That's what makes this possible without changing
`EngineContext`, `OutputAdapter`, or any of the four adapter files — 
verified by directory modification times, not just asserted, both when
this was first wired up and again in the refactor below.

### The relationships now live in one file, as data

The reuse/auto-generate logic above originally lived partly as
hardcoded lookups inside `engine.ts`. That's been replaced with
`domains/publishing/transformation-graph.ts`'s `PublishingGraph` — a
single, total, compiler-enforced mapping (`Record<OutputKind, ...>`)
that every output kind has an entry in, including the "root" kinds that
just point at the literal chapter. `engine.ts`'s `resolveInputForKind`
now asks the graph what to do instead of encoding any relationship
itself — no switch statement, no per-kind branching. Adding a new output
kind without a graph entry is now a **compile error**, not a runtime gap
someone has to remember to fill in.

**What the graph says today:**

| Output | Prefers building from | Falls back to |
|---|---|---|
| `seo_metadata` | `blog_article` | raw chapter |
| `facebook_post` | `blog_article` | raw chapter |
| `instagram_reel` | `blog_article` | raw chapter |
| `evidence_card_image` | `evidence_cards` | raw chapter |
| `podcast_script` | `blog_article` | raw chapter |
| `youtube_short` | `podcast_script` | raw chapter |
| `blog_article`, `evidence_cards`, `newsletter`, `cinematic_artwork`, `book_trailer` | *(none — always direct from chapter)* | — |

**A real semantic change worth calling out on its own, not folded into
the table:** `podcast_script` used to always generate directly from the
raw chapter — it was a root, the same as `blog_article`. It now prefers
building on an existing `blog_article` instead. That's a genuine change
in what "Generate" on Podcast Script does: writing the article first and
having the podcast script build on it is a defensible, common editorial
workflow, and it's exactly what this graph's own source brief specified
— but it means a solo `podcast_script` request against an empty session
now also auto-generates a `blog_article` first, where it previously
didn't need one at all.

**That change also makes `youtube_short`'s cascade deeper than before.**
Previously, a `youtube_short` request against an empty session could
trigger at most one additional call (`podcast_script`). Now the chain is
chapter → `blog_article` → `podcast_script` → `youtube_short`, so the
same request against a genuinely empty session can trigger **two**
additional provider calls, not one, the first time. Every subsequent
request in the session reusing any part of that chain skips the calls
for whatever already exists — so this is a one-time cost per session,
not a repeated one, but it's a deeper one-time cost than the previous
pass's README claimed, and worth knowing before you click "Generate" on
a fresh chapter expecting exactly one API call.

`newsletter` and `cinematic_artwork` remain deliberately direct —
`cinematic_artwork` matches the brief's own counter-example almost
exactly ("a quote graphic may reasonably derive directly from a
chapter"), and `newsletter` has no single unambiguous Publishing Asset
it's "about." Full reasoning for every entry is in
`transformation-graph.ts`'s comments, not just this table.

**The graph's type still accommodates fields nothing uses yet** —
`cacheable`, `supportsParallelGeneration`, `invalidates` — each
documented in `transformation-graph.ts` with what it's for, none
populated in the actual data. (`required`, `costWeight`, and
`qualityWeight` — mentioned as reserved in the prior pass — were removed
in the policy-metadata pass below: they were never read by anything, and
`optimizationGoal` supersedes what the latter two were reaching for.) If
you want to change the auto-generation behavior entirely (e.g.
reuse-only, never auto-generate), the one place to change it is still
`resolveInputForKind` in `engine.ts` — the graph describes preferences,
the engine decides what to do about them.

**Reuse semantics, unchanged:** the Engine always uses the *most recent*
successful Generation of the preferred kind in the session. Regenerating
`blog_article` means the next thing that derives from it — whether
that's `facebook_post` or now also `podcast_script` — picks up the newer
version automatically, via sorting by `createdAt`.

**No new migration this time** — `layer` and `derivedFromId` were added
to the schema in the prior pass specifically so this one wouldn't need
one. This pass only changed what code *sets* those columns.

**What's still not done, on purpose:** the multi-output shared-artifact
mechanism from the prior pass (`chapter_summary`, `extracted_evidence`,
`groupSharedSteps()`) is a *different* mechanism from the one above, for
when 2+ outputs are requested together in one call — it still never
triggers, since the Studio still only ever requests one output at a
time. Don't conflate it with the derivation-preference reuse described
here; `recommendations.ts` now distinguishes the two explicitly so that
conflation doesn't happen by accident later.

### Every rule now models three concerns, not one

`PublishingGraph`'s rule type — renamed `TransformationRule`, from
`PublishingGraphRule` — now separates three things that used to be
conflated in a single "preferred source" value:

1. **Dependency** (`source`, `autoGenerate`) — what to build from, and
   whether to auto-generate it if missing. The only part any code reads.
2. **Architectural Rationale** (`rationale`) — a real, specific sentence
   per output explaining *why* that source, not a restatement of the
   dependency. `blog_article`'s: "the editorial foundation from which
   multiple downstream publishing assets can be consistently derived."
   `evidence_card_image`'s: "visual rendering should inherit the wording
   and structure of the finalized Evidence Card rather than regenerate
   from the chapter."
3. **Optimization Policy** (`optimizationGoal: { quality, cost, latency }`)
   — a relative-priority profile per output, 0.0–1.0. Populated for all
   eleven kinds. `blog_article` is `{ quality: 1.0, cost: 0.4, latency: 0.2 }`
   — worth taking time over. `seo_metadata` is
   `{ quality: 0.5, cost: 0.9, latency: 1.0 }` — keep it cheap and fast.
   **A polarity note the source brief didn't fully specify, worth
   stating once so the numbers mean the same thing to the next reader:**
   higher = more priority placed on that objective, not a bigger
   absolute amount of it.

**Verified, not just claimed: the Engine ignores #2 and #3 entirely.**
`resolveInputForKind()` in `engine.ts` destructures only `rule.source`
and `rule.autoGenerate`. A repo-wide grep for `rationale` and
`optimizationGoal` across `engine.ts`, `plan.ts`, and `persistence.ts`
turns up nothing. Runtime behavior is unchanged from the prior pass —
same reuse, same auto-generation, same fallback — this pass added data
the engine doesn't look at yet, on purpose, so a future planner can be
built by teaching the Engine to read these fields rather than by
re-deriving quality/cost/latency judgments from scratch at that point.

**One real deviation from the brief this was built against, stated
plainly rather than silently absorbed:** the brief's own
`TransformationRule` sketch didn't include `autoGenerate`. It's kept
anyway, because it's the one field that's actually load-bearing today —
removing it would have silently broken the reuse/auto-generate behavior
from the prior pass, which conflicts with that same brief's explicit
"runtime behavior must remain unchanged." Matching an illustrative
interface exactly lost to preserving working behavior. The two
now-redundant reserved fields from the prior pass (`required`,
`costWeight`/`qualityWeight`) were removed — they were never read by
anything, and `optimizationGoal` supersedes what `costWeight`/
`qualityWeight` were reaching for.

## Data layer: one canonical vocabulary, enforced at the database too

`Generation.kind` used to be an unrestricted `String` — the database
would happily store a typo or a value the rest of the app didn't
recognize. It's now a Postgres enum (`prisma/schema.prisma`'s
`enum OutputKind`), matching `domains/knowledge/asset-kinds.ts`'s
`OutputKind` union exactly.

**The real decision here, not just the implementation:** Prisma has no
way to generate a database enum from a TypeScript union with this
toolchain — some duplication between the two lists is unavoidable. A
naive Prisma enum would have created exactly the second source of truth
this refinement was supposed to prevent. Instead:

- The Prisma enum is named `OutputKind` too — Prisma's generated TS type
  for an enum is a plain string-literal union, not a nominal type, so
  it's structurally identical to the hand-written `OutputKind` union.
  Every existing `kind: OutputKind` parameter throughout the codebase —
  persistence.ts, engine.ts, every adapter, the registry — needed **zero
  changes**.
- `asset-kinds.ts` ends with a compile-time assertion (the
  distributive-conditional type-equality trick) that the Prisma enum and
  the TypeScript union have exactly the same members. If someone adds a
  kind to one and forgets the other, **the build fails**, not "drifts
  silently until it breaks in production."
- A runtime guard, `isOutputKind()`, closes the one real gap the old
  code had: `app/api/generate/route.ts` used to do
  `const kind: OutputKind = body.kind` — a type *assertion* on `any`
  JSON input, which validates nothing at runtime. It's now
  `isOutputKind(kind)`, returning a clean 400 for a bad value instead of
  letting it reach the database and fail on the enum constraint. Derived
  from `OUTPUTS`, not a third hardcoded list.

**Considered and rejected:** a script that generates the Prisma enum
block from `OUTPUTS` automatically, which would have made the two lists
truly one source instead of a checked pair. For 11 values that change
rarely — adding an output kind is already a multi-file change (adapter,
registry, `asset-kinds.ts`, `PublishingGraph`) — a codegen step felt like
more operational complexity than the compile-time assertion buys safety
for. Worth revisiting if the vocabulary starts changing often.

**I could not test this against a live database.** No network or
Postgres access in this environment. Before you rely on this:

1. Run `npx prisma generate && npx tsc --noEmit` first, to confirm the
   sync-check actually compiles against the real generated client.
2. **Audit existing data before migrating**, if you have any: connect to
   your database and run
   ```sql
   SELECT DISTINCT kind FROM "Generation"
   WHERE kind NOT IN (
     'evidence_cards','evidence_card_image','blog_article','cinematic_artwork',
     'book_trailer','youtube_short','instagram_reel','facebook_post',
     'podcast_script','newsletter','seo_metadata'
   );
   ```
   If that returns any rows, the enum migration will fail on the column
   type conversion — fix or remove those rows first. It should return
   nothing, since every write path has always gone through TypeScript's
   `OutputKind` typing, but "should" isn't "verified," and this is
   exactly the kind of check worth running rather than assuming.
3. Then: `npx prisma migrate dev --name add_output_kind_enum`.

## Section H: performance review

A review across seven dimensions, and one recommendation implemented —
everything else considered and deliberately left alone, with reasons,
not just left unexamined.

**Rendering strategy.** Already sound. Every content page (Home, Books,
Blog, Evidence Library, Newsletter, Resources, Media) is a Server
Component by default; interactivity is isolated to genuinely interactive
leaves (`Nav`, `TransformationDiagram`, the forms, all of Studio). No
change warranted.

**AI orchestration.** The provenance-aware execution added in an earlier
pass means a single request can now trigger a *sequential* chain of
Claude calls — `youtube_short` with nothing cached yet awaits
`blog_article`, then `podcast_script`, then itself. This is a real
latency cost, and it's inherent to the feature working correctly (each
step genuinely needs the previous one's output) — not something to
"fix" without changing what the feature does. Noted, not changed.

**Caching — the one refinement.** `/api/evidence-card/[id]` had zero
cache headers, despite the underlying data being provably immutable:
regenerating an Evidence Card creates a *new* `Generation` row with a
new id (confirmed — no code path updates an existing row's `content`
after it's ever been servable). Every view of a shared or embedded card
was re-running the full Satori composition, re-fetching Google Fonts,
and re-fetching the Pollinations background, from scratch, forever. Now
sends `Cache-Control: public, max-age=31536000, immutable`. Contained to
one file, zero risk (the immutability was verified, not assumed), and
it's the kind of fix that makes the *next* optimization easier too —
the same reasoning would apply cleanly to caching `cinematic_artwork`
the same way, whenever that's worth doing.

**Database access.** Real but minor: `resolveSession`,
`recordRequestedOutput`, and `resolveInputForKind` are 3–5 sequential,
unbatched Postgres round-trips before an adapter is even called, and
none of the `findFirst`/`findMany` calls narrow with `select` — a query
that only needs `content` and `id` still pulls `chapterText`, `plan`,
and `providerMetadata` too. Each round-trip is maybe 20–100ms; against
AI provider calls that take several seconds, this isn't where the time
actually goes. Not worth a change on its own.

**Parallel execution.** "Generate All" runs all outputs sequentially,
`await`ed one at a time — the most *visible* inefficiency in the app,
since a user watches it take the sum of every output's time instead of
something closer to the slowest one. Deliberately not fixed here: naively
parallelizing it would race two independent requests that both need a
missing `blog_article`, since nothing deduplicates in-flight generations
per session+kind — that's a correctness problem (a real duplicate row),
not just a performance one, and fixing it properly means adding some form
of generation-locking, which is exactly the kind of scope-creeping
addition this review was told to avoid absent a clear, contained win. Worth
its own pass, not a rider on this one.

**Bundle size.** No action needed. `framer-motion` is scoped to the
homepage's `TransformationDiagram` and code-split there by Next.js's
routing; Studio's client components load only on `/studio`; `next/og`
never reaches the client bundle at all. Nothing bloated to trim.

**Streaming and background-job readiness.** Book Trailer's async
polling pattern is appropriate for genuinely long-running work at this
scale. Text generation is *not* streamed — Claude's full response is
awaited before anything renders, so "Generating…" sits with no visible
progress for several seconds. This would be the highest-value UX win on
this list, and I'm deliberately not recommending it: it isn't a
contained change. It touches the provider client's return type
(`Promise<string>` → a stream), the route's response contract (JSON →
SSE or a streamed body), the client hook's fetch handling, and — since
every text adapter goes through the same shared `callClaude` — it's
effectively a cross-cutting change to all eight text outputs at once,
not a one-file fix. Real, worth doing eventually, not this review's one
refinement.

## Section G: security review

A review across nine dimensions. One refinement implemented; everything
else named explicitly, with reasoning for why it wasn't — "reviewed and
judged proportionate" is a different claim from "not reviewed," and this
tries to keep those distinguishable.

**Authentication and authorization.** Solid for what this is: bcrypt
password hashing, JWT sessions, no public signup, every protected route
double-checks `auth()` even though middleware already gates it (checked
via directory-wide review, not assumed). Every session-scoped query
filters by `userId` — future-proofed for multi-user even though only one
user exists today. `/api/evidence-card/[id]` is deliberately public
(these are meant to be shared); everything else that mutates or reads
personal data requires auth. No changes.

**API route security.** No permissive CORS headers anywhere, so routes
are same-origin by default. No unintended HTTP verbs exposed (each route
exports only the methods it needs). No changes.

**Input validation.** `isOutputKind()` (added in the prior data-layer
pass) already closes the one real typed-value gap. Two real, lower-
severity gaps remain, deliberately not fixed here: `chapterText` has no
length cap before being embedded in a provider prompt and persisted, and
`/api/ocr` doesn't validate `imageBase64`/`mediaType` server-side (only
the Studio UI's own client-side downscaling limits size, which a direct
API call bypasses entirely). Both are real for "future multi-user
deployments" framing, both are bounded today by the fact that the only
person who can reach either route already has valid admin credentials —
this is authenticated-app hardening, not an open door. Worth a future
pass, specifically if/when this opens to more than one trusted account.

**Secrets and environment variable handling.** Clean. No secret is ever
read outside server-only files; none use the `NEXT_PUBLIC_` prefix that
would bundle them to the client; `ADMIN_PASSWORD` is hashed immediately
in the seed script and never logged. No changes.

**File upload safety.** The OCR upload's blast radius is inherently
narrow — the "file" only ever becomes an image content block in a
Claude Vision API call, never stored or served back to other users, so
there's no code-execution or stored-XSS surface from a malicious image
itself. The real gap is the same one named under Input Validation
(no server-side size/type check) — not a distinct file-handling
vulnerability.

**Prompt injection and AI provider interactions.** Real, and worth
naming plainly rather than glossing over: `chapterText` is fully
user-controlled free text, interpolated directly into every adapter's
prompt. Today's threat model makes this low-severity — the only person
who controls chapter content is the same admin who'd be "attacking"
themselves — but this project's own roadmap (multi-author support,
`domains/publishing/recommendations.ts`) explicitly anticipates a future
where chapter content doesn't originate from a single trusted source.
Not fixed here deliberately: robust prompt-injection mitigation
(delimiter hardening, output validation, sandwiching) is genuinely
open-ended work, and building it now for a single-admin app would be the
premature hardening this review was told to avoid. Flagged so it's a
known, named gap when multi-author support is actually built, not a
surprise discovered then.

**SQL injection / XSS / CSRF.** Checked, not assumed:
`grep -rn '\$queryRaw\|\$executeRaw'` across the entire codebase returns
nothing — Prisma's parameterized queries are used exclusively, so SQL
injection isn't a viable vector regardless of input. `grep -rn
"dangerouslySetInnerHTML"` also returns nothing — every rendered string,
including LLM-generated content in Studio's results and history panels,
goes through React's default JSX escaping. Auth.js's session cookie uses
`SameSite=Lax` by default, which blocks cookie transmission on
cross-site POST requests — the vector that matters here, since every
mutating route in this app is POST. No changes.

**Error handling and information disclosure.** One real, minor finding:
provider error bodies are forwarded to the client largely verbatim
(`` `Anthropic API error (${response.status}): ${errText}` ``, similarly
for Runway). Low severity — the only client is the authenticated admin —
but worth naming as the kind of thing that becomes a real disclosure
concern the moment a route's response is ever consumed by anyone other
than its own operator. Not fixed here: genericizing these would trade
away debugging visibility that's actively useful at this project's
current scale, for a disclosure risk that doesn't yet have a realistic
audience to disclose to.

**Rate limiting and abuse prevention — the one refinement.** This was
the clearest, most conventional gap of the nine: zero throttling
anywhere, including the login endpoint itself. Unlimited password
guesses were possible against the one account that controls every
provider API key this app can spend money through. Fixed with
`failedLoginAttempts`/`lockoutUntil` on `User` (new migration — see
below) and matching logic in `auth.ts`'s `authorize()`: 5 consecutive
failures locks the account for 15 minutes; the lockout check runs
*before* the bcrypt compare, so a locked-out attempt doesn't even spend
the hashing cost; a successful login clears both fields (skipping the
write entirely when they're already clean, so this doesn't add a query
to the common case).

Chose this over rate-limiting `/api/generate` directly, even though that
route is also unthrottled: `/api/generate` already requires a valid
session, so abusing it requires credentials to already be compromised —
which is exactly what login-lockout prevents in the first place. This is
the more foundational of the two, not a replacement for eventually rate-
limiting generation too (worth its own pass if API cost abuse becomes a
real concern once more than one account exists).

Chose a Postgres-backed counter over an in-memory one, deliberately:
this project explicitly supports both Vercel (serverless, ephemeral,
possibly multiple concurrent instances) and Replit (a single persistent
process) as deployment targets — in-memory state would work correctly on
Replit and unreliably on Vercel, and "solid foundation for future
production deployments" ruled that inconsistency out. Chose per-email
tracking over per-IP, deliberately: with one admin account, there's no
user-enumeration concern per-email tracking would create, and per-IP
tracking introduces its own spoofing considerations (naively trusting
`X-Forwarded-For` without a trusted-proxy allowlist) that would be a
second problem introduced while solving the first.

**Another migration needed** against an existing database:
`npx prisma migrate dev --name add_login_lockout` (adds
`failedLoginAttempts` and `lockoutUntil` to `User`). I could not test
this against a live database — same caveat as every schema change in
this project — so the same advice applies: run
`npx prisma generate && npx tsc --noEmit` first.

**Future security evolution.** The lockout above is intentionally scoped
for a single-administrator architecture — that's the whole reason it's
a couple of fields on `User` and a few lines in `authorize()`, not a
subsystem. If Scriptorium ever becomes a multi-user publishing platform,
this mechanism should be *replaced*, not incrementally extended: a
proper authentication/authorization layer at that point means
role-based access control, audit logging, real session management, and
per-user rate limiting — not five more fields bolted onto `User` and a
growing pile of conditionals in `authorize()`. No part of that is built
now, and building it now would be exactly the premature hardening this
review was told to avoid. Named here so it's a planned replacement when
multi-user support is actually designed, not a patch applied under
time pressure to code that was never meant to carry it.

## Section I: code quality review

A review across the eight named dimensions. One refinement implemented;
one larger finding named but deliberately not acted on, with reasoning.

**Naming consistency.** Solid. `OutputKind` values are snake_case
everywhere without exception — TypeScript, Prisma, adapters, the UI.
Functions are verb-first and communicate intent on their own
(`resolveSession`, `recordRequestedOutput`, `layerFor`, `isOutputKind`).
One naming choice worth explaining rather than flagging as inconsistent:
`transformation-graph.ts` exports a const called `PublishingGraph`
built from a type called `TransformationRule`. That mismatch was
requested explicitly, by name, in the brief that introduced it — not an
accident.

**Readability.** Every non-obvious decision throughout this codebase has
a comment explaining *why*, not just *what* — reserved-but-unused
fields, rejected alternatives, honest gaps between what's planned and
what's executed. That's a real, deliberate property of this codebase,
not incidental.

**Maintainability.** Several places use the compiler itself to prevent
drift rather than relying on convention: `Record<OutputKind, ...>`
mappings (the layer classification, the transformation graph) fail to
compile if a kind is missing; the Prisma `OutputKind` enum has a
type-level equality assertion against the TypeScript union. This is the
strongest maintainability property in the project — drift becomes a
build failure, not a runtime surprise discovered later.

**Separation of concerns.** Consistent throughout: adapters only
transform, the Engine only orchestrates, the Graph only describes
relationships, UI components only render (Studio's hooks/components
split enforces this concretely — `StudioResults`/`StudioToolbar` take
props and emit events, `useStudioGeneration` owns all the state and
fetch calls).

**Type safety — the one refinement.** Checked, not assumed: grepped for
every `as {...}` type assertion in the codebase and found six total. Two
are legitimate and well-justified (a defensive parse of an unpredictable
third-party API response shape in `runway.ts`; the standard
global-singleton pattern in `lib/prisma.ts`). The other **four** were
the exact same workaround, copy-pasted: `(session.user as { id?: string
}).id`, because Auth.js's built-in `Session`/`User`/`JWT` types don't
know about the custom `id` field this app adds. Fixed at the source with
a `types/next-auth.d.ts` declaration-merging file, which is the
idiomatic Auth.js fix for exactly this gap — `session.user.id`,
`token.id`, and `user.id` are now real, typed fields everywhere, and
`auth.ts` plus both route handlers that read them had their casts
removed rather than left as now-redundant belt-and-suspenders. This
isn't a style preference; it's a duplicated correctness workaround
replaced by fixing the actual gap once.

**Error handling.** Consistent discriminated-union pattern
(`GenerationResult`'s `"done" | "processing" | "error"`) used throughout
the Publishing domain rather than thrown exceptions crossing layer
boundaries. The few places that swallow an error intentionally
(`recordRequestedOutput`'s best-effort catch,
`pollRunwayVideoTask`'s best-effort persistence update) are commented
with why a failure there shouldn't fail the whole request — not
silent carelessness.

**Documentation — named, not acted on.** This README is 1,087 lines
across 19 sections, accumulated over many sequential review passes.
Every individual addition was justified when it was written, and the
content is accurate — but a new contributor today has to read the
narrative history of every architecture review this project has been
through to find, say, "how do I run this" or "what does the Generation
model look like." That's a real documentation-debt finding. I'm not
acting on it here: splitting or reorganizing this file is a
structural/organizational change, not a code-quality fix in the sense
this review was scoped to (the brief explicitly asks to avoid "cosmetic
refactoring" and prefers "architectural consistency" findings), and
restructuring 1,000+ lines of accurate historical reasoning carries real
risk of losing or garbling something in the move for a benefit that's
about navigation, not correctness. Worth its own dedicated pass —
something like splitting into `docs/architecture.md`,
`docs/setup.md`, and a short top-level `README.md` that links to both —
if and when onboarding friction becomes an actual reported problem
rather than one this review predicts.

**Technical debt, generally.** Low, and mostly by design: nearly every
deferred decision in this codebase was deferred *explicitly*, with a
comment naming what was skipped and why, rather than accumulated
silently. The two real findings above (the auth typing gap, the README's
size) are the only two things this review turned up worth naming.

## Section J: scalability review

Nine future capabilities to assess: multiple authors, editors, reviewers,
organizations, publishing teams, academic institutions, courses,
knowledge graphs, APIs, third-party integrations. Classified as
**prepared for** / **partially prepared** / **not yet needed**, checked
against the actual code rather than reasoned about abstractly — see the
specific evidence cited for each, not just the label.

**Multiple authors — prepared for, further than it looks.** Checked
directly: `auth.ts`'s `authorize()` calls
`prisma.user.findUnique({ where: { email } })` — a generic database
lookup, not a check against a hardcoded admin identity.
`ADMIN_EMAIL`/`ADMIN_PASSWORD` are only ever read by `prisma/seed.ts`,
a one-time bootstrap script, not by the runtime auth path. A second row
in the `User` table would authenticate and use the Studio correctly
today. And every write in the Publishing domain already scopes by
`userId` — `resolveSession`'s ownership check, `resolveInputForKind`'s
provenance lookups, every persisted row — verified by grep, not
assumed. The only real gap is a way to *create* a second account at
runtime (today that's a redeploy-time operation via the seed script),
which is a UI/feature, correctly out of scope for this review.

**Editors / Reviewers — not yet needed.** No `role` field on `User`, no
approval-state concept anywhere (`Generation.status` is
execution-status — done/processing/error — not editorial-status). Adding
an unused `role` enum now, with no logic to read it, would be exactly
the kind of hollow field this project has deliberately avoided
elsewhere (the reserved-but-unpopulated fields in
`transformation-graph.ts` are documented types with zero runtime
presence for the same reason). Genuinely not needed until an editorial
workflow is being designed, at which point the shape of that workflow
should drive the field, not the reverse.

**Organizations / publishing teams / academic institutions — not yet
needed.** No multi-tenancy concept exists, and shouldn't yet — introducing
`Organization` later means adding an optional `organizationId` alongside
existing `userId` fields (a common, low-risk pattern), not restructuring
anything that exists today. Building it now would be pure speculation.

**Courses — prepared for, and this is the strongest item on the list.**
This isn't aspirational: `domains/publishing/publishing-asset.ts`
already reserves `"course"` as a future Layer 2 kind, and
`domains/publishing/profiles.ts`'s `course_creation` profile already
exists (built from today's real kinds as an honest placeholder). More
importantly, the *mechanism* for adding "course" as a real output is
identical to the one used to add all 11 of today's real kinds — one
adapter file, one registry entry, one `asset-kinds.ts` entry, one
`PublishingGraph` entry, one Prisma enum entry, one migration. That
mechanism has been exercised repeatedly throughout this project, not
just designed once and left untested.

**Knowledge graphs — partially prepared.** `Generation.derivedFromId` is
a real, working graph edge today — provenance chains are actual
self-referential foreign keys, not a plan for one. What's genuinely
absent is a *general* knowledge graph at the Knowledge Asset layer
(citation-to-citation, concept-to-concept relationships) —
`domains/knowledge/README.md` already names this honestly as reserved,
not built. Nothing new to add here; this review just confirms that
existing self-assessment still holds.

**APIs — partially prepared, and better than expected.**
`runPublishingEngine(kind, input, sessionId?)` is already fully
decoupled from HTTP — it doesn't know or care whether its caller is
`app/api/generate/route.ts` or something else entirely. A future
API-key-authenticated public route could be a new file calling the same
engine function, with zero changes to the engine, the adapters, or the
existing session-cookie-authenticated routes. What's missing —
API-key auth as a mechanism, rate limiting per external consumer,
response-contract versioning — are real gaps, but they're additive, not
restructuring: today's routes already do their own `auth()` check
independent of middleware, which is exactly the pattern a
differently-authenticated route would follow.

**Third-party integrations — split findings.** For AI-provider-style
integrations specifically, this is close to done:
`domains/publishing/capabilities.ts` already separates "what capability
is needed" from "which vendor provides it," which is the whole
architectural problem a new provider integration would otherwise run
into. For *publish-out* integrations (posting to WordPress, Substack,
social platforms) — genuinely not prepared, and correctly so: Distribution
Adaptations today only produce content, they don't push it anywhere, and
no OAuth or external-API-client pattern has been needed yet because
nothing publishes outward yet.

**The one real architectural gap, named rather than fixed.**
`domains/books/data.ts` is a static, hardcoded array — no database row,
no `authorId`, no relationship to `User` at all. Every other piece of
content in this app (Generations, PublishingSessions) has real,
FK-enforced ownership; a book, the thing multiple authors would most
concretely each have their own catalog of, has none. This is the one
finding on this list that would make several future capabilities
(multiple authors, organizations, even courses if they're organized
under a book) genuinely harder than necessary if left unaddressed.

**Why this isn't this review's "one refinement":** fixing it properly —
a real `Book` table, a migration, an `authorId` relation, rewriting the
Books pages from static-array reads to database queries — is a feature
implementation, which this review was explicitly told to avoid. The
alternative, adding an unused `authorId` field to the *existing static
type* just to gesture at the concept, would be a hollow field with
nothing reading it — the exact anti-pattern this project has
consistently avoided in every prior review (Section I's finding on
avoided hollow fields applies here just as directly). Neither is right.

**So: no code changes in this section.** The honest, disciplined
conclusion here is that most of what was asked about is already
prepared for or correctly not-yet-needed, thanks to work done across
the Three-Layer Model, the capability abstraction, and consistent
per-user scoping in earlier passes — and the one real gap (Books) has a
clear, correct fix that simply isn't this review's job to build. Naming
it precisely, for whoever designs multi-author support next, is the
actual deliverable.

## Persistence

Every generation — text, artwork, or trailer — is saved to the
`Generation` table (`prisma/schema.prisma`) as soon as it's ready, tied to
the logged-in user and to a `PublishingSession` (see above). The Studio
page's History panel
(`domains/studio/components/StudioHistory.tsx`) fetches and lists them via
`/api/generations`. Note this logs *history*, not live session state — a
page refresh clears the in-progress generator cards, but everything
already generated (including failed attempts, as of this pass) is still
in History.

## Where content lives

- `domains/books/data.ts` — book metadata (title, blurb, description, status)
- `domains/knowledge/taxonomy.ts` — blog category metadata
- Blog posts aren't wired up yet — see the roadmap below.

## Suggested next stages

Stages 3/4 from the original brief (the "chapter → generate everything"
workflow, with persistence and login) are now built — see AI Studio
above. What's still open:

1. **Content** — add MDX support and wire the Blog page to real posts
   (either local MDX files under a `content/` directory, or a headless CMS
   like Payload CMS once the library grows). The Studio's generated Blog
   Article output is a natural source for these.
2. **Evidence cards** — publish the Studio's Evidence Cards output into
   the actual Evidence Library page, rather than it only living in
   Studio history.
3. **Newsletter/contact backends** — connect the two client-side forms in
   `components/NewsletterForm.tsx` and `components/ContactForm.tsx` to a
   real provider (e.g. Resend, Buttondown, ConvertKit).
4. **One-click publishing** — once content has somewhere to live (Stage 1
   above), add a "Publish" action to each Studio output that pushes it
   there directly, and eventually out to connected social accounts.
5. **Multi-author support** — the brief mentions other authors eventually
   using the platform. Right now it's intentionally single-admin; opening
   that up means real sign-up, per-user content scoping, and probably
   billing.
6. **Deploy** — push to a git repo, `vercel deploy`, add
   `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `ANTHROPIC_API_KEY`, and `RUNWAY_API_KEY` as environment variables in
   the Vercel dashboard, then run `npx prisma migrate deploy` and
   `npm run seed` against the production database once.

## Project structure

```
app/            Next.js routes (App Router) — thin; calls into domains/
domains/        Business logic, organized by domain — see "Internal
                architecture" above for the full breakdown
components/     Generic shared UI only: Nav, Footer, forms, auth UI
lib/            Framework/infra plumbing only: prisma.ts, actions.ts
prisma/         Database schema + admin seed script
auth.ts         Full Auth.js config (Node runtime)
auth.config.ts  Edge-safe Auth.js config (used by middleware.ts)
middleware.ts   Route protection for /studio and its API routes
.replit         Replit config (auto-detects Node, binds dev server for
                Replit's webview) — see REPLIT.md for the full walkthrough
```
