export default function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`bg-vellum flex flex-col ${className}`}>{children}</div>;
}
