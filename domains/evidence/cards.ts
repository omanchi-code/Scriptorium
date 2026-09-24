export type EvidenceCard = {
  slug: string;
  number: string;
  part: string;
  edition: string;
  title: string;
  quote: string;
  principles: string[];
  editorsNote: string;
  corePrinciple: string;
  researchDiscipline: string;
  visualMetaphor: {
    name: string;
    description: string;
    meaning: string[];
  };
  purposeInSeries: string;
  image: string;
  imageAlt: string;
};

export const evidenceCards: EvidenceCard[] = [
  {
    slug: "001-the-courage-to-investigate",
    number: "001",
    part: "Part I — Foundations of Investigation",
    edition: "Standard Evidence Edition",
    title: "The Courage to Investigate",
    quote: "Truth should never fear investigation.",
    principles: ["Questions lead.", "Evidence speaks.", "Truth stands."],
    editorsNote:
      "Evidence 001 establishes the intellectual posture of the entire Evidence Library: the courage to investigate. Truth does not require protection from honest questions, careful examination, or uncomfortable evidence. Genuine investigation is therefore not an act of hostility toward truth, but a commitment to discovering it. The investigator must be willing to ask difficult questions, examine the evidence without fear, and follow the inquiry wherever it leads.",
    corePrinciple:
      "Every genuine search for truth begins with the courage to investigate.",
    researchDiscipline: "Open Inquiry",
    visualMetaphor: {
      name: "The Illuminated Manuscript",
      description:
        "An ancient manuscript containing sacred text lies beneath a warm beam of light, with a magnifying glass resting over the text. The surrounding darkness represents what remains unknown; the light and magnifying glass represent the deliberate act of investigation. The Bible and Qur'an are also present in the composition, establishing from the beginning that the Evidence Library is concerned with examining primary texts rather than merely repeating inherited conclusions.",
      meaning: [
        "Questions lead us toward what needs examination.",
        "Evidence speaks when we actually look closely.",
        "Truth stands regardless of whether investigation confirms or challenges what we expected.",
      ],
    },
    purposeInSeries:
      "Card 001 is the foundational declaration of the Evidence Library. It establishes that the series is not asking the reader to accept conclusions simply because they are familiar, popular, traditional, or preferred. Investigate first. Everything that follows (context, comparison, sources, precision, assumptions, coherence, and ultimately conclusion) builds upon that posture.",
    image: "/evidence/001.jpg",
    imageAlt:
      "Evidence 001: The Courage to Investigate. A magnifying glass over an ancient manuscript beside the Holy Bible and the Qur'an.",
  },
];
