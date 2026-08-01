import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderEvidenceCard, EvidenceCardData } from "@/domains/media/evidence-card/renderer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// This row's content is immutable once created — regenerating an
// Evidence Card creates a *new* Generation row with a new id (see
// StudioResults' "Regenerate" flow and persistence.ts), it never
// rewrites an existing one's content after the client can have received
// its id. That makes the composited image at a given id safe to cache
// forever: it avoids re-running the Satori composition, re-fetching
// Google Fonts, and re-fetching the Pollinations background on every
// view of a card that's been shared or embedded elsewhere.
const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const generation = await prisma.generation.findUnique({ where: { id: params.id } });

  if (!generation || generation.kind !== "evidence_card_image" || !generation.content) {
    return new Response("Card not found.", { status: 404 });
  }

  let data: EvidenceCardData;
  try {
    data = JSON.parse(generation.content);
  } catch {
    return new Response("Stored card data is corrupted.", { status: 500 });
  }

  try {
    const image = await renderEvidenceCard(data);
    image.headers.set("Cache-Control", IMMUTABLE_CACHE);
    return image;
  } catch (err) {
    return new Response(
      `Card rendering failed: ${err instanceof Error ? err.message : "unknown error"}`,
      { status: 500 }
    );
  }
}
