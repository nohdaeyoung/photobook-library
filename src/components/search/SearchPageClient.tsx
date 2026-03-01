"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/search/SearchModal";
import SearchInput from "@/components/search/SearchInput";
import { BookCard } from "@/components/book/BookCard";
import { searchBooks } from "@/lib/search/fuseConfig";
import type { PhotoBook } from "@/types";

interface SearchPageClientProps {
  allBooks: PhotoBook[];
  popularTags: { name: string; count: number }[];
  recentBooks: PhotoBook[];
}

function EmptyState({
  query,
  popularTags,
}: {
  query: string;
  popularTags: { name: string; count: number }[];
}) {
  const router = useRouter();

  function handleTagClick(tag: string) {
    const params = new URLSearchParams({ q: tag });
    router.replace(`/search?${params.toString()}`);
  }

  return (
    <div className="flex flex-col items-center py-20 px-4 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "var(--bg-secondary)" }}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--text-muted)" }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <p
        className="text-xl font-medium mb-2"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--text-primary)",
        }}
      >
        검색 결과가 없습니다
      </p>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        &ldquo;{query}&rdquo;에 대한 결과를 찾을 수 없습니다
      </p>

      <div className="w-full max-w-lg text-left">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          추천 태그
        </p>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(({ name }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleTagClick(name)}
              className="px-3 py-1.5 rounded-full text-sm transition-colors duration-150"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InitialState({
  popularTags,
  recentBooks,
}: {
  popularTags: { name: string; count: number }[];
  recentBooks: PhotoBook[];
}) {
  const router = useRouter();

  function handleTagClick(tag: string) {
    const params = new URLSearchParams({ q: tag });
    router.replace(`/search?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h2
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          인기 태그
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleTagClick(name)}
              className="group flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-150"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.backgroundColor =
                  "var(--accent-muted)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.backgroundColor =
                  "var(--bg-secondary)";
              }}
            >
              <span>{name}</span>
              <span
                className="text-xs tabular-nums"
                style={{ color: "var(--text-muted)" }}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          최근 추가된 사진책
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {recentBooks.map((book, i) => (
            <BookCard key={book.id} book={book} size="md" priority={i < 4} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPageClient({
  allBooks,
  popularTags,
  recentBooks,
}: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PhotoBook[]>([]);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const [searchOpen, setSearchOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialQuery.trim()) {
      const found = searchBooks(allBooks, initialQuery.trim());
      setResults(found);
      setHasSearched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!value.trim()) {
        setResults([]);
        setHasSearched(false);
        router.replace("/search");
        return;
      }

      debounceRef.current = setTimeout(() => {
        const found = searchBooks(allBooks, value.trim());
        setResults(found);
        setHasSearched(true);
        const params = new URLSearchParams({ q: value.trim() });
        router.replace(`/search?${params.toString()}`);
      }, 300);
    },
    [router, allBooks]
  );

  const showResults = hasSearched && results.length > 0;
  const showEmpty = hasSearched && results.length === 0;
  const showInitial = !hasSearched && !query;

  return (
    <>
      <Header onSearchClick={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
              }}
            >
              검색
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              사진책 제목, 작가, 태그로 검색하세요
            </p>
          </div>

          <div className="mb-10 max-w-2xl">
            <SearchInput
              value={query}
              onChange={handleQueryChange}
              placeholder="제목, 작가, 태그로 검색..."
              autoFocus
            />
          </div>

          {showResults && (
            <p
              className="text-sm mb-6 tabular-nums"
              style={{ color: "var(--text-muted)" }}
            >
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                {results.length}
              </span>
              건의 검색 결과
              {query && (
                <>
                  {" "}
                  — &ldquo;
                  <span style={{ color: "var(--text-secondary)" }}>
                    {query}
                  </span>
                  &rdquo;
                </>
              )}
            </p>
          )}

          {showResults && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {results.map((book, i) => (
                <BookCard
                  key={book.id}
                  book={book}
                  size="md"
                  priority={i < 4}
                />
              ))}
            </div>
          )}

          {showEmpty && (
            <EmptyState query={query} popularTags={popularTags} />
          )}

          {showInitial && (
            <InitialState
              popularTags={popularTags}
              recentBooks={recentBooks}
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
