# Running Scriptorium on Replit (from your phone)

This project includes a `.replit` file, so Replit auto-detects Node.js and
knows how to start the dev server — you shouldn't need to configure
anything by hand.

## 1. Get the code into Replit

Push this project to a GitHub repo (GitHub's mobile web upload works fine
for this), then in your phone's browser open:

```
replit.com/github.com/your-username/your-repo-name
```

That alone triggers an import — Replit clones the repo and opens a
workspace. Takes about 30 seconds.

## 2. Add your environment variables

Open the **Secrets** panel (padlock icon in the left-hand tools list — on
mobile this may be under a "..." or hamburger menu depending on your
screen size). Add each of these as a key/value pair, same names as in
`.env.example`:

- `DATABASE_URL` — a free Postgres connection string (Neon or Supabase,
  both signable-up-for from a phone browser)
- `AUTH_SECRET` — any random string; if you have shell access already you
  can generate one with `npx auth secret`, otherwise any long random
  string works
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — whatever you want to log in with
- `ANTHROPIC_API_KEY`
- `RUNWAY_API_KEY` — only needed for Book Trailer

Secrets you add here become environment variables automatically — no
`.env` file editing required.

## 3. Install, migrate, seed

Open the **Shell** tab (a real terminal, touch-friendly, part of the
Replit workspace) and run:

```bash
npm install
npx prisma migrate dev --name init
npm run seed
```

`npm run seed` creates your one admin account from `ADMIN_EMAIL` /
`ADMIN_PASSWORD`.

## 4. Run it

Tap the **Run** button. Replit starts the dev server and opens a preview
pane with a live URL — that URL is now your site. Sign in at `/login` to
reach `/studio`.

## Things that work differently here than on Vercel

- **No serverless timeout to worry about.** The main README's Vercel
  section mentions Book Trailer needing a Pro plan because Vercel's free
  tier caps functions at 10 seconds — that limit doesn't exist on
  Replit, since your app runs as one persistent process, not short-lived
  functions. Book Trailer's ~30-second keyframe wait is a non-issue here.
- **Free Repls can go idle** when nobody's viewing them, which is fine
  for testing but means the live URL won't always be instantly
  responsive, and isn't meant as a permanent public address. When you're
  ready to actually launch the site, moving to Vercel (see the main
  README) or a paid "Always On"/deployment option on Replit are the two
  paths — happy to walk through either when you get there.
