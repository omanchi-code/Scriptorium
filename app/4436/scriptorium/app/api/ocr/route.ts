import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { transcribePageImage } from "@/domains/studio/ocr";
import { MissingApiKeyError } from "@/domains/publishing/providers/anthropic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Sign in at /login first." }, { status: 401 });
  }

  const body = await req.json();
  const imageBase64: string = body.imageBase64 ?? "";
  const mediaType: string = body.mediaType ?? "image/jpeg";

  if (!imageBase64) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }

  try {
    const text = await transcribePageImage(imageBase64, mediaType);
    return NextResponse.json({ text });
  } catch (err) {
    if (err instanceof MissingApiKeyError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Transcription failed." },
      { status: 500 }
    );
  }
}
