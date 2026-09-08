export type BookReview = {
  slug: string;
  bookTitle: string;
  bookAuthor: string;
  category: string; // must match a slug in domains/knowledge/taxonomy.ts
  excerpt: string;
  content: string;
  publishedAt: string;
};

export const BOOK_REVIEWS: BookReview[] = [];
