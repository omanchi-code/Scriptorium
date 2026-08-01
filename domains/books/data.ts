export type Book = {
  slug: string;
  title: string;
  genre: string;
  blurb: string;
  description: string;
  status: "Published" | "Forthcoming";
};

export const BOOKS: Book[] = [
  {
    slug: "the-sonship-of-jesus",
    title: "The Sonship of Jesus",
    genre: "Theology",
    blurb:
      "An evidence-driven study of what it means, biblically and historically, that Jesus is called the Son.",
    description:
      "The Sonship of Jesus examines the title through scripture, historical theology, and careful argument, tracing how the earliest church understood Jesus's identity and why that understanding still matters. Written for readers who want more than assertion — every claim in the book is paired with its sources in the companion Evidence Library.",
    status: "Published",
  },
  {
    slug: "sequins-and-surrender",
    title: "Sequins & Surrender",
    genre: "Fiction",
    blurb:
      "A novel about ambition, faith, and the cost of letting go of the image you built for yourself.",
    description:
      "Sequins & Surrender follows a life lived for the audience — until it isn't. A story about the gap between performance and surrender, and what's left standing when the applause stops.",
    status: "Published",
  },
];
