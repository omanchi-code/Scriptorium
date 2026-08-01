// next/og's ImageResponse (built on Satori) needs actual font file bytes,
// not a <link> to Google Fonts. This fetches them at render time using an
// old-browser User-Agent, which makes Google's CSS API return a TTF URL
// instead of WOFF2 (Satori can't parse WOFF2). This is a widely-used
// community technique, not an official Google API contract — if Google
// changes their CSS response format, this may need adjustment.
async function fetchFont(family: string, weight: number, text?: string) {
  const params = new URLSearchParams({ family: `${family}:wght@${weight}` });
  if (text) params.set("text", text); // subsetting: smaller/faster fetch

  const css = await fetch(`https://fonts.googleapis.com/css2?${params.toString()}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
    },
  }).then((r) => r.text());

  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) {
    throw new Error(`Could not resolve a font file URL for ${family} ${weight}`);
  }

  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}

export type CardFonts = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}[];

/** Loads the three faces the evidence card template uses. Subsets each to
 * only the characters actually needed, since fetching full font files for
 * a single short card is wasteful. */
export async function loadEvidenceCardFonts(allText: string): Promise<CardFonts> {
  const [serifBold, sansRegular, sansBold, script] = await Promise.all([
    fetchFont("Playfair Display", 700, allText),
    fetchFont("Inter", 400, allText),
    fetchFont("Inter", 700, allText),
    fetchFont("Great Vibes", 400, allText),
  ]);

  return [
    { name: "Playfair Display", data: serifBold, weight: 700, style: "normal" },
    { name: "Inter", data: sansRegular, weight: 400, style: "normal" },
    { name: "Inter", data: sansBold, weight: 700, style: "normal" },
    { name: "Great Vibes", data: script, weight: 400, style: "normal" },
  ];
}
