import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isApi = req.nextUrl.pathname.startsWith("/api/");

  if (isLoggedIn) return;

  if (isApi) {
    return NextResponse.json(
      { error: "Unauthorized. Sign in at /login first." },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/login", req.nextUrl.origin);
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: [
    "/studio/:path*",
    "/api/generate/:path*",
    "/api/generations/:path*",
    "/api/ocr/:path*",
  ],
};
