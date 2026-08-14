import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trueHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        request.nextUrl.pathname.startsWith("/studio") ||
        request.nextUrl.pathname.startsWith("/api/generate") ||
        request.nextUrl.pathname.startsWith("/api/generations") ||
        request.nextUrl.pathname.startsWith("/api/ocr");
      return isProtected ? isLoggedIn : true;
    },
  },
  // Providers that need Node APIs (Prisma, bcrypt) are added in auth.ts,
  // which only runs in Node route handlers — not here, since middleware
  // runs on the Edge runtime.
  providers: [],
};
