"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CategoryItem {
  name: string;
  slug: string;
  count: number;
}

interface TagItem {
  name: string;
  count: number;
}

interface FilterSidebarProps {
  categories: CategoryItem[];
  tags: TagItem[];
  selectedCategory: string | null;
  selectedTags: string[];
  onCategoryChange: (slug: string | null) => void;
  onTagChange: (tag: string) => void;
  onReset: () => void;
}

// ─── Shared sidebar content (used by both desktop and bottom sheet) ──────────

function SidebarContent({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagChange,
  onReset,
}: FilterSidebarProps) {
  const hasActiveFilters = selectedCategory !== null || selectedTags.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between pb-4 mb-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted, rgba(245,245,240,0.5))" }}
        >
          필터
        </h2>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
            )}
            style={{
              color: "var(--accent, #E0C080)",
              border: "1px solid var(--accent, #E0C080)",
              backgroundColor: "transparent",
            }}
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* ── Category section ── */}
        <section>
          <h3
            className="text-xs font-medium uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted, rgba(245,245,240,0.4))" }}
          >
            카테고리
          </h3>
          <ul className="space-y-0.5" role="radiogroup" aria-label="카테고리 필터">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <li key={cat.slug}>
                  <button
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() =>
                      onCategoryChange(isSelected ? null : cat.slug)
                    }
                    className={cn(
                      "w-full flex items-center justify-between gap-2",
                      "px-3 py-2 rounded-lg text-sm text-left",
                      "transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                    )}
                    style={
                      isSelected
                        ? {
                            backgroundColor: "var(--accent-muted, rgba(224,192,128,0.12))",
                            color: "var(--accent, #E0C080)",
                          }
                        : {
                            color: "var(--text-secondary, rgba(245,245,240,0.7))",
                            backgroundColor: "transparent",
                          }
                    }
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {/* Radio indicator */}
                      <span
                        className="flex-shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center"
                        style={{
                          borderColor: isSelected
                            ? "var(--accent, #E0C080)"
                            : "rgba(255,255,255,0.2)",
                        }}
                      >
                        {isSelected && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "var(--accent, #E0C080)" }}
                          />
                        )}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </span>

                    {/* Count badge */}
                    <span
                      className="flex-shrink-0 text-xs tabular-nums"
                      style={{ color: "var(--text-muted, rgba(245,245,240,0.35))" }}
                    >
                      ({cat.count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Tags section ── */}
        {tags.length > 0 && (
          <section>
            <h3
              className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: "var(--text-muted, rgba(245,245,240,0.4))" }}
            >
              태그
            </h3>
            <ul className="space-y-0.5" role="group" aria-label="태그 필터">
              {tags.map((tag) => {
                const isChecked = selectedTags.includes(tag.name);
                return (
                  <li key={tag.name}>
                    <button
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => onTagChange(tag.name)}
                      className={cn(
                        "w-full flex items-center justify-between gap-2",
                        "px-3 py-2 rounded-lg text-sm text-left",
                        "transition-colors duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                      )}
                      style={
                        isChecked
                          ? {
                              backgroundColor: "var(--accent-muted, rgba(224,192,128,0.12))",
                              color: "var(--accent, #E0C080)",
                            }
                          : {
                              color: "var(--text-secondary, rgba(245,245,240,0.7))",
                              backgroundColor: "transparent",
                            }
                      }
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        {/* Checkbox indicator */}
                        <span
                          className="flex-shrink-0 w-3.5 h-3.5 rounded flex items-center justify-center"
                          style={{
                            border: isChecked
                              ? "none"
                              : "1.5px solid rgba(255,255,255,0.2)",
                            backgroundColor: isChecked
                              ? "var(--accent, #E0C080)"
                              : "transparent",
                          }}
                        >
                          {isChecked && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="9"
                              height="9"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="#0D0D0D"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="2 6 5 9 10 3" />
                            </svg>
                          )}
                        </span>
                        <span className="truncate">{tag.name}</span>
                      </span>

                      {/* Count badge */}
                      <span
                        className="flex-shrink-0 text-xs tabular-nums"
                        style={{ color: "var(--text-muted, rgba(245,245,240,0.35))" }}
                      >
                        ({tag.count})
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {/* Reset button (bottom, always visible) */}
      <div className="pt-4 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          onClick={onReset}
          disabled={!hasActiveFilters}
          className={cn(
            "w-full py-2.5 rounded-lg text-sm font-medium",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
            "disabled:opacity-30 disabled:cursor-not-allowed",
          )}
          style={{
            backgroundColor: "var(--bg-secondary, #1A1A17)",
            color: "var(--text-secondary, rgba(245,245,240,0.7))",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

export default function FilterSidebar(props: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const hasActiveFilters =
    props.selectedCategory !== null || props.selectedTags.length > 0;

  // Close bottom sheet on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Lock body scroll when sheet open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Mobile toggle button ── */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          )}
          style={{
            backgroundColor: hasActiveFilters
              ? "var(--accent-muted, rgba(224,192,128,0.12))"
              : "var(--bg-secondary, #1A1A17)",
            color: hasActiveFilters
              ? "var(--accent, #E0C080)"
              : "var(--text-secondary, rgba(245,245,240,0.7))",
            border: `1px solid ${
              hasActiveFilters
                ? "var(--accent, #E0C080)"
                : "rgba(255,255,255,0.1)"
            }`,
          }}
        >
          {/* Filter icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          필터
          {hasActiveFilters && (
            <span
              className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent, #E0C080)",
                color: "#0D0D0D",
              }}
            >
              {(props.selectedCategory ? 1 : 0) + props.selectedTags.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile bottom sheet ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              key="filter-sheet"
              ref={sheetRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="필터 선택"
              className={cn(
                "fixed bottom-0 inset-x-0 z-30 lg:hidden",
                "rounded-t-2xl",
                "flex flex-col",
                "max-h-[80vh]",
              )}
              style={{ backgroundColor: "var(--bg-primary, #0D0D0D)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                />
              </div>

              {/* Sheet header */}
              <div
                className="flex items-center justify-between px-5 py-3 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary, #F5F5F0)" }}
                >
                  필터 선택
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="닫기"
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full",
                    "transition-colors duration-150",
                    "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "var(--text-muted, rgba(245,245,240,0.5))" }}
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Sheet body */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <SidebarContent {...props} />
              </div>

              {/* Apply button (mobile convenience) */}
              <div
                className="px-5 py-4 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <button
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-medium",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2",
                  )}
                  style={{
                    backgroundColor: "var(--accent, #E0C080)",
                    color: "#0D0D0D",
                  }}
                >
                  적용하기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar (always visible at lg+) ── */}
      <aside
        className="hidden lg:flex flex-col w-56 flex-shrink-0"
        aria-label="필터 사이드바"
      >
        <SidebarContent {...props} />
      </aside>
    </>
  );
}
