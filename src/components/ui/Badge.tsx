import { cn } from "@/lib/utils";

interface BadgeProps {
  name: string;
  color: string;
  className?: string;
}

export function Badge({ name, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-2 py-0.5 text-xs",
        "rounded-[var(--radius-sm)]",
        "text-[var(--text-secondary)]",
        "bg-[var(--bg-secondary)]",
        "border border-[var(--border)]",
        className,
      )}
    >
      <span
        className="shrink-0 w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {name}
    </span>
  );
}
