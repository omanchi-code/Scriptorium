import Link from "next/link";

export default function Card({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`group bg-vellum flex flex-col ${className}`}>
      {children}
    </Link>
  );
}
