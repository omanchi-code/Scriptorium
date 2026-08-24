// Pollinations.ai is a free, open-source image-generation service that
// requires no API key or account for basic use — you fetch a URL and it
// streams back an image, generating on demand. Used here as the default
// for Cinematic Artwork so it costs nothing to run.
//
// Caveat: it's a free community service, not something with an uptime SLA
// or commercial terms — fine for a personal author platform, but worth
// knowing if this ever needs guaranteed availability. If that changes,
// domains/publishing/providers/runway.ts already has createRunwayImage() as a drop-in paid
// alternative (see buildArtworkPrompt there too).

const POLLINATIONS_BASE = "https://gen.pollinations.ai/image";

export function buildPollinationsImageUrl(promptText: string) {
  return `${POLLINATIONS_BASE}/${encodeURIComponent(promptText)}`;
}
/** Free text generation via Pollinations' OpenAI-compatible endpoint —
 * no API key required. Meaningfully lower quality than Claude; this
 * exists so the app is testable at zero cost before deciding whether
 * Anthropic's paid API is worth it. Swap back via TEXT_PROVIDER=anthropic
 * once you're ready — see engine.ts. */
export async function callPollinationsText(prompt: string, maxTokens = 1024): Promise<string> {
  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "openai",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Pollinations text API error (${response.status}): ${errText.slice(0, 300)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
      }
