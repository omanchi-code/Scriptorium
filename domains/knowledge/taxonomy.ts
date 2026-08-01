export type Category = {
  slug: string;
  label: string;
  description: string;
  count: number;
};

export const CATEGORIES: Category[] = [
  {
    slug: "biblical-studies",
    label: "Biblical Studies",
    description: "Close readings of scripture, in context.",
    count: 0,
  },
  {
    slug: "theology",
    label: "Theology",
    description: "Doctrine, history, and how they meet the present.",
    count: 0,
  },
  {
    slug: "economics-public-policy",
    label: "Economics & Public Policy",
    description: "How systems and incentives shape everyday life.",
    count: 0,
  },
  {
    slug: "business-leadership",
    label: "Business & Leadership",
    description: "Judgment, character, and building things that last.",
    count: 0,
  },
  {
    slug: "psychology",
    label: "Psychology",
    description: "How people actually think, choose, and change.",
    count: 0,
  },
  {
    slug: "fiction-worth-reading",
    label: "Fiction Worth Reading",
    description: "Recommendations and reflections on stories that hold up.",
    count: 0,
  },
];
