import { cn } from "@/lib/utils";

type TagVariant = "default" | "active" | "removable";

interface TagProps {
  name: string;
  variant?: TagVariant;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  default: [
    "text-[var(--text-secondary)]",
    "bg-[var(--bg-secondary)]",
    "border border-[var(--border)]",
    "hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
  ].join(" "),

  active: [
    "text-[#0D0D0D] font-medium",
    "bg-[var(--accent)]",
    "border border-[var(--accent)]",
    "hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)]",
  ].join(" "),

  removable: [
    "text-[var(--text-secondary)]",
    "bg-[var(--bg-secondary)]",
    "border border-[var(--border)]",
    "hover:border-[var(--accent)] hover:text-[var(--text-primary)]",
    "pr-1",
  ].join(" "),
};

export function Tag({
  name,
  variant = "default",
  onClick,
  onRemove,
  className,
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-3 py-1 text-sm",
        "rounded-full",
        "transition-colors duration-[var(--transition-fast)]",
        onClick && "cursor-pointer",
        variantStyles[variant],
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {name}

      {variant === "removable" && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "inline-flex items-center justify-center",
            "w-4 h-4 rounded-full",
            "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            "hover:bg-[var(--bg-tertiary)]",
            "transition-colors duration-[var(--transition-fast)]",
            "outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]",
            "leading-none",
          )}
          aria-label={`${name} 태그 제거`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
