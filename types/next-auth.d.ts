import { DefaultSession } from "next-auth";

/**
 * Auth.js's built-in `Session`/`User`/`JWT` types don't know about the
 * `id` field this app adds in auth.ts's callbacks — every place that
 * read `session.user.id` had to cast around that gap individually
 * (`(session.user as { id?: string }).id`), and that exact cast had
 * drifted into four separate files (see the Section I code quality
 * review in README.md for how this was found). Declaration merging
 * fixes it at the source instead: once these interfaces are extended
 * here, `session.user.id`, `token.id`, and `user.id` are real, typed
 * fields everywhere in the app, and no file needs its own cast again.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
