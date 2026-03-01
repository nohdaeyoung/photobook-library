import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "text-[#0D0D0D] font-medium",
    "bg-[var(--accent)]",
    "hover:bg-[var(--accent-hover)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]",
    "disabled:bg-[var(--text-muted)] disabled:cursor-not-allowed",
  ].join(" "),

  secondary: [
    "text-[var(--accent)] font-medium",
    "bg-transparent",
    "border border-[var(--accent)]",
    "hover:bg-[var(--accent-muted)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]",
    "disabled:border-[var(--text-muted)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed",
  ].join(" "),

  ghost: [
    "text-[var(--text-secondary)] font-normal",
    "bg-transparent",
    "border border-transparent",
    "hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]",
    "disabled:text-[var(--text-muted)] disabled:cursor-not-allowed",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[var(--radius-sm)]",
  md: "px-5 py-2.5 text-base rounded-[var(--radius-md)]",
  lg: "px-7 py-3.5 text-lg rounded-[var(--radius-lg)]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "transition-colors duration-[var(--transition-fast)]",
        "outline-none select-none",
        "disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
