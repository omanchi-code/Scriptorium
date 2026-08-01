const RUNWAY_BASE = "https://api.dev.runwayml.com";
const RUNWAY_VERSION = process.env.RUNWAY_API_VERSION || "2024-11-06";

// Model slugs are configurable because Runway adds/renames models faster
// than any hardcoded default can track. Check your Runway developer
// dashboard for current model names if generation fails with a "model not
// found" style error.
const RUNWAY_IMAGE_MODEL = process.env.RUNWAY_IMAGE_MODEL || "gen4_image";
const RUNWAY_VIDEO_MODEL = process.env.RUNWAY_VIDEO_MODEL || "gen4_turbo";

function headers(apiKey: string) {
  return {
    "content-type": "application/json",
    authorization: `Bearer ${apiKey}`,
    "X-Runway-Version": RUNWAY_VERSION,
  };
}

async function parseOrThrow(res: Response, action: string) {
  const raw = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    // fall through with empty data; raw text is still surfaced below
  }
  if (!res.ok) {
    throw new Error(`Runway ${action} failed (${res.status}): ${raw.slice(0, 500)}`);
  }
  return data;
}

/** Kicks off a text-to-image task and returns its task id. */
export async function createRunwayImage(
  apiKey: string,
  promptText: string,
  ratio: string = "1024:1024"
) {
  const res = await fetch(`${RUNWAY_BASE}/v1/text_to_image`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({
      model: RUNWAY_IMAGE_MODEL,
      promptText,
      ratio,
    }),
  });
  const data = await parseOrThrow(res, "text_to_image");
  return data.id as string;
}

/** Kicks off an image-to-video task and returns its task id. */
export async function createRunwayVideo(
  apiKey: string,
  promptImage: string,
  promptText: string
) {
  const res = await fetch(`${RUNWAY_BASE}/v1/image_to_video`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({
      model: RUNWAY_VIDEO_MODEL,
      promptImage,
      promptText,
      ratio: "1280:720",
    }),
  });
  const data = await parseOrThrow(res, "image_to_video");
  return data.id as string;
}

export type RunwayTaskResult =
  | { state: "processing" }
  | { state: "done"; url: string }
  | { state: "error"; message: string };

/** Fetches current task status. Field names are normalized defensively
 * since exact response shapes have varied across Runway API versions. */
export async function getRunwayTask(
  apiKey: string,
  taskId: string
): Promise<RunwayTaskResult> {
  const res = await fetch(`${RUNWAY_BASE}/v1/tasks/${taskId}`, {
    headers: headers(apiKey),
  });
  const data = await parseOrThrow(res, "task lookup");

  const status = String(data.status ?? "").toUpperCase();

  if (["FAILED", "ERROR", "CANCELLED"].includes(status)) {
    return {
      state: "error",
      message:
        (typeof data.error === "string" && data.error) ||
        (typeof data.failure === "string" && data.failure) ||
        "Generation failed on Runway's side.",
    };
  }

  if (["SUCCEEDED", "COMPLETED", "SUCCESS"].includes(status)) {
    const output = data.output as unknown;
    const url = Array.isArray(output)
      ? (output[0] as string)
      : (output as { media_url?: string[] } | undefined)?.media_url?.[0];

    if (!url) {
      return {
        state: "error",
        message: "Runway reported success but returned no output URL — check the response shape against current docs.",
      };
    }
    return { state: "done", url };
  }

  // PENDING, RUNNING, QUEUED, PROCESSING, or anything unrecognized: keep polling.
  return { state: "processing" };
}

/** Builds a short cinematic prompt from the chapter so the trailer's
 * keyframe and motion relate to the actual content. */
export function buildTrailerPrompt(chapterTitle: string, chapterText: string) {
  const excerpt = chapterText.trim().slice(0, 400);
  return `Cinematic book trailer key frame for a chapter titled "${chapterTitle || "Untitled chapter"}". Moody, editorial, atmospheric lighting, no text or typography in the image. Scene should evoke: ${excerpt}`;
}

/** Builds a prompt for standalone key art — framed as a poster/cover
 * image rather than a video's first frame, so composition leaves room
 * for a title treatment to be added later rather than filling the frame. */
export function buildArtworkPrompt(chapterTitle: string, chapterText: string) {
  const excerpt = chapterText.trim().slice(0, 400);
  return `Cinematic key art / book cover style image for a chapter titled "${chapterTitle || "Untitled chapter"}". Portrait composition, painterly and atmospheric, generous negative space in the upper third for a future title overlay, no text or typography rendered in the image itself. Scene should evoke: ${excerpt}`;
}
