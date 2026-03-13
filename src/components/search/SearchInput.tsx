"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "제목, 작가, 태그 검색...",
  autoFocus = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl",
        "transition-all duration-200",
      )}
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: `1.5px solid ${
          focused
            ? "var(--accent)"
            : "var(--border-subtle)"
        }`,
      }}
    >
      {/* Magnifier icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0 transition-colors duration-200"
        style={{
          color: focused
            ? "var(--accent)"
            : "var(--text-muted)",
        }}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      {/* Input */}
      <label htmlFor="search-input" className="sr-only">사진책 검색</label>
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className={cn(
          "flex-1 bg-transparent outline-none text-base leading-tight",
          "[&::-webkit-search-cancel-button]:hidden",
          "[&::-webkit-search-decoration]:hidden",
          "placeholder:text-text-muted",
        )}
        style={{
          color: "var(--text-primary)",
          caretColor: "var(--accent)",
        }}
      />

      {/* Clear button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="검색어 지우기"
          className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0",
            "transition-colors duration-150",
            "hover:bg-hover-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--text-muted)" }}
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
