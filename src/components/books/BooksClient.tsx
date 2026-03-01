"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FilterSidebar from "@/components/ui/FilterSidebar";
import { BookCard } from "@/components/book/BookCard";
import SearchModal from "@/components/search/SearchModal";
import type { PhotoBook, Category } from "@/types";

// ─── 상수 ────────────────────────────────────────────────────────────────────

const INITIAL_VISIBLE = 12;
const LOAD_MORE_STEP = 12;

type SortKey = "newest" | "oldest" | "title" | "author";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "title", label: "제목순" },
  { value: "author", label: "작가순" },
];

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: "컬렉션", href: "/books", current: true },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface BooksClientProps {
  initialBooks: PhotoBook[];
  categories: Category[];
  tags: { name: string; count: number }[];
}

// ─── 정렬 함수 ────────────────────────────────────────────────────────────────

function sortBooks(books: PhotoBook[], sortKey: SortKey): PhotoBook[] {
  const sorted = [...books];
  switch (sortKey) {
    case "newest":
      return sorted.sort((a, b) => b.year - a.year);
    case "oldest":
      return sorted.sort((a, b) => a.year - b.year);
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    case "author":
      return sorted.sort((a, b) => a.author.localeCompare(b.author, "ko"));
    default:
      return sorted;
  }
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function BooksClient({
  initialBooks,
  categories,
  tags,
}: BooksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 검색 모달 상태
  const [searchOpen, setSearchOpen] = useState(false);

  // 정렬 상태
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  // 더 보기 상태
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // URL searchParams에서 필터 상태 읽기
  const selectedCategory = searchParams.get("category") ?? null;
  const selectedTagsRaw = searchParams.get("tags") ?? "";
  const selectedTags = useMemo(
    () => (selectedTagsRaw ? selectedTagsRaw.split(",").filter(Boolean) : []),
    [selectedTagsRaw]
  );

  // FilterSidebar에 넘길 카테고리 목록 (bookCount 포함)
  const sidebarCategories = useMemo(
    () =>
      categories.map((cat) => ({
        name: cat.name,
        slug: cat.slug,
        count: cat.bookCount ?? 0,
      })),
    [categories]
  );

  // ─── URL 업데이트 헬퍼 ─────────────────────────────────────────────────────

  const updateURL = useCallback(
    (category: string | null, tags: string[]) => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (tags.length > 0) params.set("tags", tags.join(","));
      const query = params.toString();
      router.replace(query ? `/books?${query}` : "/books", { scroll: false });
      // 필터 변경 시 표시 개수 초기화
      setVisibleCount(INITIAL_VISIBLE);
    },
    [router]
  );

  // ─── 필터 핸들러 ──────────────────────────────────────────────────────────

  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      updateURL(slug, selectedTags);
    },
    [updateURL, selectedTags]
  );

  const handleTagChange = useCallback(
    (tag: string) => {
      const next = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
      updateURL(selectedCategory, next);
    },
    [updateURL, selectedCategory, selectedTags]
  );

  const handleReset = useCallback(() => {
    router.replace("/books", { scroll: false });
    setVisibleCount(INITIAL_VISIBLE);
  }, [router]);

  // ─── 필터 + 정렬 로직 ────────────────────────────────────────────────────

  const filteredBooks = useMemo(() => {
    let result = initialBooks;

    if (selectedCategory) {
      result = result.filter((b) => b.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      result = result.filter((b) =>
        selectedTags.every((tag) => b.tags.includes(tag))
      );
    }

    return sortBooks(result, sortKey);
  }, [initialBooks, selectedCategory, selectedTags, sortKey]);

  const visibleBooks = useMemo(
    () => filteredBooks.slice(0, visibleCount),
    [filteredBooks, visibleCount]
  );

  const hasMore = visibleCount < filteredBooks.length;

  // ─── 렌더 ────────────────────────────────────────────────────────────────

  return (
    <>
      <Header onSearchClick={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {/* 페이지 헤더 영역 */}
        <div
          className="border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb items={BREADCRUMB_ITEMS} className="mb-4" />
            <h1
              className="text-3xl sm:text-4xl font-bold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
              }}
            >
              컬렉션
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              사진책 전체 목록을 탐색하세요
            </p>
          </div>
        </div>

        {/* 본문: 사이드바 + 메인 그리드 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8 items-start">

            {/* ── 사이드바 (데스크탑: 고정 너비, 모바일: 버튼) ── */}
            <FilterSidebar
              categories={sidebarCategories}
              tags={tags}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              onCategoryChange={handleCategoryChange}
              onTagChange={handleTagChange}
              onReset={handleReset}
            />

            {/* ── 메인 컨텐츠 영역 ── */}
            <div className="flex-1 min-w-0">

              {/* 상단 바: 모바일 필터 버튼 + 결과 카운트 + 정렬 */}
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">

                {/* 왼쪽: 모바일 필터 버튼 자리 + 결과 카운트 */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* 모바일 필터 버튼은 FilterSidebar 내부에서 렌더 */}
                  <span
                    className="text-sm tabular-nums"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {filteredBooks.length}
                    </span>
                    권의 사진책
                  </span>

                  {/* 활성 필터 뱃지 */}
                  {(selectedCategory || selectedTags.length > 0) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedCategory && (
                        <ActiveFilterBadge
                          label={
                            sidebarCategories.find(
                              (c) => c.slug === selectedCategory
                            )?.name ?? selectedCategory
                          }
                          onRemove={() => handleCategoryChange(null)}
                        />
                      )}
                      {selectedTags.map((tag) => (
                        <ActiveFilterBadge
                          key={tag}
                          label={tag}
                          onRemove={() => handleTagChange(tag)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* 오른쪽: 정렬 드롭다운 */}
                <SortSelect value={sortKey} onChange={setSortKey} />
              </div>

              {/* 그리드 or 빈 상태 */}
              {filteredBooks.length === 0 ? (
                <EmptyState onReset={handleReset} />
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {visibleBooks.map((book, index) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        priority={index < 6}
                      />
                    ))}
                  </div>

                  {/* 더 보기 버튼 */}
                  {hasMore && (
                    <div className="mt-10 flex justify-center">
                      <LoadMoreButton
                        remaining={filteredBooks.length - visibleCount}
                        onClick={() =>
                          setVisibleCount((prev) => prev + LOAD_MORE_STEP)
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ─── 서브 컴포넌트: 활성 필터 뱃지 ──────────────────────────────────────────

function ActiveFilterBadge({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150"
      style={{
        backgroundColor: "var(--accent-muted)",
        color: "var(--accent)",
        border: "1px solid var(--accent)",
      }}
      aria-label={`${label} 필터 제거`}
    >
      <span>{label}</span>
      {/* X 아이콘 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

// ─── 서브 컴포넌트: 정렬 드롭다운 ────────────────────────────────────────────

function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none text-sm pl-3 pr-8 py-2 rounded-lg cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
        }}
        aria-label="정렬 기준 선택"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* 드롭다운 화살표 */}
      <span
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
        style={{ color: "var(--text-muted)" }}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
}

// ─── 서브 컴포넌트: 빈 상태 ──────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center rounded-2xl"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
    >
      {/* 아이콘 */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          style={{ color: "var(--text-muted)" }}
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
            opacity="0.5"
          />
          <rect
            x="12"
            y="13"
            width="20"
            height="2"
            rx="1"
            fill="currentColor"
            opacity="0.5"
          />
          <rect
            x="12"
            y="18"
            width="14"
            height="2"
            rx="1"
            fill="currentColor"
            opacity="0.3"
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

      <p
        className="text-base font-medium mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        조건에 맞는 사진책이 없습니다
      </p>
      <p
        className="text-sm mb-6 max-w-xs"
        style={{ color: "var(--text-muted)" }}
      >
        다른 카테고리나 태그를 선택하거나 필터를 초기화해 보세요.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
        style={{
          backgroundColor: "var(--accent)",
          color: "#0D0D0D",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--accent-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--accent)")
        }
      >
        필터 초기화
      </button>
    </div>
  );
}

// ─── 서브 컴포넌트: 더 보기 버튼 ─────────────────────────────────────────────

function LoadMoreButton({
  remaining,
  onClick,
}: {
  remaining: number;
  onClick: () => void;
}) {
  const loadCount = Math.min(remaining, LOAD_MORE_STEP);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-medium transition-all duration-200"
      style={{
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border)",
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
      <span>{loadCount}권 더 보기</span>
      {/* 아래 화살표 아이콘 */}
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
        className="transition-transform duration-200 group-hover:translate-y-0.5"
        aria-hidden="true"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    </button>
  );
}
