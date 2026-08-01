import { ImageResponse } from "next/og";
import { loadEvidenceCardFonts } from "./fonts";

export type Principle = { word: string; rest: string };

export type EvidenceCardData = {
  evidenceNumber: string; // e.g. "005"
  bookLabel: string; // e.g. "Book I"
  chapterTitle: string;
  quote: string; // may contain **highlighted** segments
  principles: Principle[]; // exactly 3, ideally
  backgroundImageUrl: string;
  authorName?: string;
  authorRole?: string;
  siteUrl?: string;
};

const GOLD = "#D2A455";
const WHITE = "#F5F3EE";
const DIM = "#B8B4A8";
const BG = "#050505";

/** Splits "A page **is not** the whole story" into colored segments. */
function highlightSegments(quote: string) {
  return quote.split(/\*\*(.+?)\*\*/g).map((chunk, i) => ({
    text: chunk,
    highlight: i % 2 === 1,
  }));
}

const PRINCIPLE_ICONS = ["📖", "🔗", "🎯"];

export async function renderEvidenceCard(data: EvidenceCardData) {
  const allText = [
    "EVIDENCE",
    `#${data.evidenceNumber}`,
    data.bookLabel.toUpperCase(),
    "TITLE:",
    data.chapterTitle,
    data.quote.replace(/\*\*/g, ""),
    ...data.principles.flatMap((p) => [p.word, p.rest]),
    data.authorName ?? "Omanchi-Job Agbo",
    data.authorRole ?? "AUTHOR | RESEARCHER | BIBLE TEACHER",
    "SEE MORE @",
    data.siteUrl ?? "",
    "\u201c\u201d",
  ].join(" ");

  const fonts = await loadEvidenceCardFonts(allText);
  const segments = highlightSegments(data.quote);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          background: BG,
          border: `3px solid ${GOLD}`,
          fontFamily: "Inter",
        }}
      >
        {/* LEFT — text column */}
        <div
          style={{
            width: "540px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "40px 36px",
            position: "relative",
          }}
        >
          {/* Header bar */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                border: `2px solid ${GOLD}`,
                borderRadius: "6px",
                fontSize: "26px",
                marginRight: "14px",
              }}
            >
              📖
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `2px solid ${GOLD}`,
                borderRadius: "6px",
                padding: "10px 18px",
                fontSize: "20px",
                letterSpacing: "3px",
                color: WHITE,
                marginRight: "12px",
              }}
            >
              EVIDENCE
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `2px solid ${GOLD}`,
                borderRadius: "6px",
                padding: "10px 18px",
                fontSize: "20px",
                fontWeight: 700,
                color: GOLD,
              }}
            >
              #{data.evidenceNumber}
            </div>
          </div>

          {/* Book / title */}
          <div style={{ display: "flex", fontSize: "16px", letterSpacing: "3px", color: GOLD, marginBottom: "6px" }}>
            {data.bookLabel.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: "16px", letterSpacing: "3px", color: DIM, marginBottom: "10px" }}>
            TITLE:
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              color: GOLD,
              marginBottom: "32px",
              maxWidth: "460px",
            }}
          >
            {data.chapterTitle || "Untitled chapter"}
          </div>

          {/* Quote */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", fontSize: "64px", color: GOLD, lineHeight: 1, marginBottom: "-10px" }}>
              &ldquo;
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontFamily: "Playfair Display",
                fontWeight: 700,
                fontSize: "52px",
                lineHeight: 1.15,
                color: WHITE,
              }}
            >
              {segments.map((seg, i) => (
                <span key={i} style={{ color: seg.highlight ? GOLD : WHITE }}>
                  {seg.text}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", fontSize: "64px", color: GOLD, lineHeight: 1, alignSelf: "flex-end" }}>
              &rdquo;
            </div>
          </div>

          {/* Principles */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "28px" }}>
            {data.principles.slice(0, 3).map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: `2px solid ${GOLD}`,
                    fontSize: "18px",
                    marginRight: "16px",
                  }}
                >
                  {PRINCIPLE_ICONS[i] ?? "•"}
                </div>
                <div style={{ display: "flex", fontSize: "24px", color: WHITE }}>
                  <span style={{ color: GOLD, marginRight: "8px" }}>{p.word}</span>
                  {p.rest}
                </div>
              </div>
            ))}
          </div>

          {/* Signature */}
          <div style={{ display: "flex", fontFamily: "Great Vibes", fontSize: "44px", color: GOLD, marginBottom: "4px" }}>
            {data.authorName ?? "Omanchi-Job Agbo"}
          </div>
          <div style={{ display: "flex", fontSize: "18px", color: WHITE, marginBottom: "4px" }}>
            {(data.authorName ?? "Omanchi-Job Agbo").toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: "13px", letterSpacing: "2px", color: GOLD }}>
            {data.authorRole ?? "AUTHOR | RESEARCHER | BIBLE TEACHER"}
          </div>
        </div>

        {/* RIGHT — photographic panel */}
        <div
          style={{
            width: "540px",
            height: "100%",
            display: "flex",
            position: "relative",
            backgroundImage: `url(${data.backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              right: "24px",
              left: "24px",
              display: "flex",
              alignItems: "center",
              background: "rgba(5,5,5,0.85)",
              border: `2px solid ${GOLD}`,
              borderRadius: "8px",
              padding: "12px 18px",
            }}
          >
            <div style={{ display: "flex", fontSize: "20px", marginRight: "10px" }}>🌐</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: "13px", letterSpacing: "2px", color: WHITE }}>
                SEE MORE @
              </div>
              <div style={{ display: "flex", fontSize: "14px", color: GOLD }}>
                {data.siteUrl ?? "omanchi-job-agbo.netlify.app"}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts,
    }
  );
}
