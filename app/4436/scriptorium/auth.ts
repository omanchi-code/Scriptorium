import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

// Section G security review: the login endpoint had zero brute-force
// protection — unlimited password guesses against the one account that
// matters. These are deliberately simple, fixed thresholds (not
// exponential backoff, not IP-based, no CAPTCHA) — proportionate to a
// single-admin app today, and a real foundation rather than theater for
// whenever this supports more than one account.
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
          // Locked out — don't even attempt the bcrypt compare. Returns
          // null the same way a wrong password does, rather than a
          // distinct "you're locked out" error: with one account, its
          // owner will notice the lockout from repeated failed attempts
          // regardless, and not distinguishing the response avoids
          // giving an attacker a clean signal for when to stop guessing
          // and start waiting out the lockout window instead.
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) {
          const attempts = user.failedLoginAttempts + 1;
          const lockingOutNow = attempts >= MAX_FAILED_ATTEMPTS;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: lockingOutNow ? 0 : attempts,
              lockoutUntil: lockingOutNow ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
            },
          });
          return null;
        }

        if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockoutUntil: null },
          });
        }

        return { id: user.id, email: user.email };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
