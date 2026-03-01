"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

// 쉐브론 구분자 SVG
function ChevronSeparator() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: "var(--text-muted)", flexShrink: 0 }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center", className)}
    >
      <ol
        className="flex items-center flex-wrap gap-1"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current ?? isLast;

          return (
            <li
              key={item.href}
              className="flex items-center gap-1"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {/* 첫 번째 항목이 아닌 경우 구분자 출력 */}
              {index > 0 && <ChevronSeparator />}

              {isCurrent ? (
                // 현재 페이지 — 골드색, 링크 없음
                <span
                  aria-current="page"
                  className="text-sm font-medium"
                  style={{ color: "var(--accent)" }}
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : (
                // 이전 페이지 — muted 색, 호버 시 밝아짐
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm transition-colors duration-150"
                  )}
                  style={{ color: "var(--text-muted)" }}
                  itemProp="item"
                  onMouseEnter={e =>
                    (e.currentTarget.style.color = "var(--text-secondary)")
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}

              {/* Schema.org position */}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
