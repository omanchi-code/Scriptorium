const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

export class MissingApiKeyError extends Error {}

/** Calls Claude and returns the concatenated text of the response. Throws
 * MissingApiKeyError if ANTHROPIC_API_KEY isn't set, so callers can turn
 * that into a clear user-facing message rather than a generic 500. */
export async function callClaude(prompt: string, maxTokens = 1024): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError(
      "ANTHROPIC_API_KEY is not set. Add it to your .env.local file (see .env.example) and restart the dev server."
    );
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return (data.content ?? [])
    .map((block: { type: string; text?: string }) => (block.type === "text" ? block.text : ""))
    .filter(Boolean)
    .join("\n");
}

/** Same as callClaude, but with an image content block — for anything
 * that needs Claude to look at an image (currently: the Studio's
 * page-scan transcription feature). Kept in this same provider file
 * since it's the same API, same client, just a different content shape —
 * the point of a shared provider module is exactly to avoid a second
 * raw-fetch implementation appearing elsewhere for what's really the
 * same integration. */
export async function callClaudeVision(
  imageBase64: string,
  mediaType: string,
  instruction: string,
  maxTokens = 4096
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError(
      "ANTHROPIC_API_KEY is not set. Add it to your .env.local file (see .env.example) and restart the dev server."
    );
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: instruction },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return (data.content ?? [])
    .map((block: { type: string; text?: string }) => (block.type === "text" ? block.text : ""))
    .filter(Boolean)
    .join("\n");
}

/** Parses a JSON object out of a Claude response even if it wrapped the
 * JSON in markdown code fences (a common structured-output quirk). */
export function parseJsonLoose<T>(raw: string): T {
  const cleaned = raw.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned);
}
