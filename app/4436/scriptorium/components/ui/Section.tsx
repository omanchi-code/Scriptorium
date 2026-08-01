export default function Section({
  children,
  bordered = true,
  className = "",
}: {
  children: React.ReactNode;
  /** Whether this section has the hairline divider above it. The very
   * first section on a page (usually the hero) generally doesn't. */
  bordered?: boolean;
  className?: string;
}) {
  return (
    <section className={bordered ? "hairline" : ""}>
      <div className={`container-page py-16 sm:py-24 ${className}`}>{children}</div>
    </section>
  );
}
