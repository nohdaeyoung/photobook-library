"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { searchBooks } from "@/lib/search/fuseConfig";
import { books } from "@/data/books";
import { BookCard } from "@/components/book/BookCard";
import SearchInput from "@/components/search/SearchInput";
import type { PhotoBook } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Popular tags surfaced when query is empty and no results
const POPULAR_TAGS = ["흑백", "다큐멘터리", "초상", "풍경", "스트리트", "한국", "클래식", "컬러"];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PhotoBook[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Run search with 300 ms debounce
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const found = searchBooks(books, value.trim());
      setResults(found);
      setHasSearched(true);
    }, 300);
  }, []);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setHasSearched(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const showEmpty = hasSearched && results.length === 0;
  const showResults = hasSearched && results.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="search-panel"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="사진책 검색"
            className={cn(
              "fixed inset-x-0 top-0 z-40 mx-auto",
              "w-full max-w-2xl",
              "rounded-b-2xl shadow-2xl",
              "flex flex-col",
              "max-h-[90vh] overflow-hidden",
            )}
            style={{ backgroundColor: "var(--bg-primary, #0D0D0D)" }}
          >
            {/* Search input row */}
            <div
              className="flex items-center gap-3 p-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex-1">
                <SearchInput
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="제목, 작가, 태그로 검색..."
                  autoFocus
                />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="검색 닫기"
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0",
                  "transition-colors duration-150",
                  "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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

            {/* Results area */}
            <div className="flex-1 overflow-y-auto">
              {/* Search results */}
              {showResults && (
                <div className="p-4">
                  <p
                    className="text-xs mb-3 tabular-nums"
                    style={{ color: "var(--text-muted, rgba(245,245,240,0.4))" }}
                  >
                    검색 결과 {results.length}건
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {results.slice(0, 12).map((book) => (
                      <div key={book.id} onClick={onClose}>
                        <BookCard book={book} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {showEmpty && (
                <div className="flex flex-col items-center py-12 px-6 text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--bg-secondary, #1A1A17)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "var(--text-muted, rgba(245,245,240,0.4))" }}
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>

                  <p
                    className="text-base font-medium mb-1"
                    style={{ color: "var(--text-secondary, rgba(245,245,240,0.7))" }}
                  >
                    검색 결과가 없습니다
                  </p>
                  <p
                    className="text-sm mb-6"
                    style={{ color: "var(--text-muted, rgba(245,245,240,0.4))" }}
                  >
                    &ldquo;{query}&rdquo;에 대한 결과를 찾을 수 없습니다
                  </p>

                  {/* Popular tags */}
                  <div className="w-full text-left">
                    <p
                      className="text-xs font-medium uppercase tracking-widest mb-3"
                      style={{ color: "var(--text-muted, rgba(245,245,240,0.4))" }}
                    >
                      인기 태그
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleQueryChange(tag)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm",
                            "transition-colors duration-150",
                            "focus-visible:outline-none focus-visible:ring-2",
                          )}
                          style={{
                            backgroundColor: "var(--bg-secondary, #1A1A17)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "var(--text-secondary, rgba(245,245,240,0.7))",
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Initial state — no query yet */}
              {!hasSearched && query === "" && (
                <div className="px-4 py-6">
                  <p
                    className="text-xs font-medium uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-muted, rgba(245,245,240,0.4))" }}
                  >
                    인기 태그
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleQueryChange(tag)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm",
                          "transition-colors duration-150",
                          "focus-visible:outline-none focus-visible:ring-2",
                        )}
                        style={{
                          backgroundColor: "var(--bg-secondary, #1A1A17)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "var(--text-secondary, rgba(245,245,240,0.7))",
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
