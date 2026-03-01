"use client";

import Link from "next/link";
import Image from "next/image";
import { PhotoBook } from "@/types";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: PhotoBook;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: {
    card: "w-40",
    title: "text-sm",
    meta: "text-xs",
    tagText: "text-xs px-2 py-0.5",
    info: "p-2.5 gap-1",
  },
  md: {
    card: "w-56",
    title: "text-base",
    meta: "text-sm",
    tagText: "text-xs px-2.5 py-1",
    info: "p-3 gap-1.5",
  },
  lg: {
    card: "w-72",
    title: "text-lg",
    meta: "text-sm",
    tagText: "text-xs px-3 py-1",
    info: "p-4 gap-2",
  },
};

export function BookCard({ book, priority = false, size = "md" }: BookCardProps) {
  const styles = sizeStyles[size];
  const displayTags = book.tags.slice(0, 3);
  const hasCover = Boolean(book.coverImage?.src);

  return (
    <Link
      href={`/books/${book.slug}`}
      className={cn(
        "group flex flex-col flex-shrink-0",
        "rounded-[var(--radius-lg)] overflow-hidden",
        "bg-[var(--bg-card)] border border-[var(--border)]",
        "shadow-[var(--shadow-card)]",
        "transition-all duration-[250ms] ease-[ease]",
        "hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--border-hover)]",
        styles.card,
      )}
    >
      {/* 커버 이미지 영역 */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-tertiary)]">
        {hasCover ? (
          <Image
            src={book.coverImage.src}
            alt={book.coverImage.alt}
            fill
            sizes={
              size === "sm"
                ? "(max-width: 640px) 50vw, 160px"
                : size === "lg"
                  ? "(max-width: 640px) 80vw, 288px"
                  : "(max-width: 640px) 60vw, 224px"
            }
            className={cn(
              "object-cover",
              "transition-transform duration-[250ms] ease-[ease]",
              "group-hover:scale-[1.03]",
            )}
            priority={priority}
            placeholder={book.coverImage.blurDataURL ? "blur" : "empty"}
            blurDataURL={book.coverImage.blurDataURL}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-tertiary)]">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
              className="text-[var(--text-muted)]"
            >
              <rect
                x="8"
                y="4"
                width="28"
                height="36"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <rect
                x="12"
                y="8"
                width="20"
                height="2"
                rx="1"
                fill="currentColor"
                opacity="0.6"
              />
              <rect
                x="12"
                y="13"
                width="20"
                height="2"
                rx="1"
                fill="currentColor"
                opacity="0.6"
              />
              <rect
                x="12"
                y="18"
                width="14"
                height="2"
                rx="1"
                fill="currentColor"
                opacity="0.4"
              />
              <line
                x1="8"
                y1="6"
                x2="8"
                y2="38"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* Featured 배지 */}
        {book.featured && (
          <div
            className={cn(
              "absolute top-2 left-2",
              "px-2 py-0.5 rounded-[var(--radius-sm)]",
              "bg-[var(--accent)] text-[#0D0D0D]",
              "text-xs font-medium leading-none",
            )}
          >
            추천
          </div>
        )}
      </div>

      {/* 텍스트 정보 영역 */}
      <div className={cn("flex flex-col", styles.info)}>
        {/* 제목 */}
        <h3
          className={cn(
            "font-[family-name:var(--font-heading)] font-medium leading-snug",
            "text-[var(--text-primary)]",
            "line-clamp-2",
            styles.title,
          )}
        >
          {book.title}
        </h3>

        {/* 작가 · 연도 */}
        <p className={cn("text-[var(--text-secondary)]", styles.meta)}>
          <span>{book.author}</span>
          <span className="mx-1 text-[var(--text-muted)]">·</span>
          <span>{book.year}</span>
        </p>

        {/* 태그 목록 */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "inline-block rounded-full",
                  "bg-[var(--bg-tertiary)] border border-[var(--border)]",
                  "text-[var(--text-muted)] leading-none",
                  styles.tagText,
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
