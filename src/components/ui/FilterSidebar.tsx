"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SidebarContent, type FilterSidebarProps } from "@/components/ui/SidebarContent";

interface FilterSidebarExtendedProps extends FilterSidebarProps {
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export default function FilterSidebar({ mobileOpen: externalOpen, onMobileOpenChange, ...props }: FilterSidebarExtendedProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const mobileOpen = externalOpen ?? internalOpen;
  const setMobileOpen = onMobileOpenChange ?? setInternalOpen;
  const sheetRef = useRef<HTMLDivElement>(null);
  const hasActiveFilters =
    props.selectedCategory !== null || props.selectedTags.length > 0 || props.featuredOnly;

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
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--drag-handle)" }} />
              </div>

              {/* Sheet header */}
              <div
                className="flex items-center justify-between px-5 py-3 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  필터 선택
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="닫기"
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full",
                    "transition-colors duration-150",
                    "hover:bg-hover-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
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
                    style={{ color: "var(--text-muted)" }}
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

              {/* Apply button */}
              <div
                className="px-5 py-4 flex-shrink-0"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <button
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-medium",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2",
                  )}
                  style={{ backgroundColor: "var(--accent)", color: "var(--text-on-accent)" }}
                >
                  적용하기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-56 flex-shrink-0"
        aria-label="필터 사이드바"
      >
        <SidebarContent {...props} />
      </aside>
    </>
  );
}
