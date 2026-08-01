export type StatusTone = "neutral" | "active" | "success" | "error";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "text-ink-dim",
  active: "text-brass",
  success: "text-brass",
  error: "text-crimson",
};

export default function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return <span className={`font-mono text-[11px] shrink-0 ${TONE_CLASSES[tone]}`}>{label}</span>;
}
