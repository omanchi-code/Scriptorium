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
