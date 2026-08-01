import { NextRequest, NextResponse } from "next/server";
import { isOutputKind } from "@/domains/knowledge/asset-kinds";
import { auth } from "@/auth";
import { runPublishingEngine } from "@/domains/publishing/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// book_trailer and evidence_card_image both wait briefly on a provider
// before returning. Vercel's Hobby plan caps functions at 10s — this
// needs at least a Pro plan (or self-hosting) to reliably complete.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Middleware already gates this route; this check is cheap and keeps
  // the route safe even if middleware config ever drifts.
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Sign in at /login first." }, { status: 401 });
  }

  const body = await req.json();
  const kind = body.kind;

  if (!isOutputKind(kind)) {
    return NextResponse.json({ error: `Unknown output kind: ${String(kind)}` }, { status: 400 });
  }

  const { sessionId, result } = await runPublishingEngine(
    kind,
    {
      userId,
      chapterTitle: body.chapterTitle ?? "",
      chapterText: body.chapterText ?? "",
      bookLabel: body.bookLabel || "Book I",
    },
    body.sessionId
  );

  if (result.status === "error") {
    return NextResponse.json({ error: result.error, sessionId }, { status: result.httpStatus ?? 500 });
  }

  return NextResponse.json({ ...result, sessionId });
}
