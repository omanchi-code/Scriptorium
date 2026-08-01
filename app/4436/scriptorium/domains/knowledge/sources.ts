export type SourceType = { label: string; detail: string };

/**
 * The categories of sourcing Scriptorium's Evidence Library organizes
 * around. This lives in the Knowledge domain rather than inline in the
 * Evidence Library page because it's the same kind of thing regardless
 * of which page surfaces it — the taxonomy of what counts as a citation
 * here, not presentation.
 *
 * Reserved, not yet built: real Citation records (linking specific
 * claims to specific sources), Relationships (a citation reused across
 * multiple books/articles), and Search over the library. Those don't
 * have folders yet because there's no code for them — when they exist,
 * they belong here alongside this file, not as a new top-level domain.
 */
export const SOURCE_TYPES: SourceType[] = [
  { label: "Scripture References", detail: "Verses cited across every book and essay, linked back to context." },
  { label: "Data & Statistics", detail: "Sourced figures used in economics and public policy writing." },
  { label: "Historical Sources", detail: "Primary and secondary sources behind theological and historical claims." },
  { label: "Further Reading", detail: "Books and papers that shaped the argument, for readers who want to go deeper." },
];
