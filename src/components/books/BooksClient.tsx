"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FilterSidebar from "@/components/ui/FilterSidebar";
import { BookCard } from "@/components/book/BookCard";
import SearchModal from "@/components/search/SearchModal";
import { ActiveFilterBadge } from "@/components/books/ActiveFilterBadge";
import { SortSelect, type SortKey } from "@/components/books/SortSelect";
import { EmptyState } from "@/components/books/EmptyState";
import { LoadMoreButton, LOAD_MORE_STEP } from "@/components/books/LoadMoreButton";
import type { PhotoBook, Category } from "@/types";

// ─── 상수 ────────────────────────────────────────────────────────────────────

const INITIAL_VISIBLE = 12;

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

  const [searchOpen, setSearchOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const selectedCategory = searchParams.get("category") ?? null;
  const selectedTagsRaw = searchParams.get("tags") ?? "";
  const selectedTags = useMemo(
    () => (selectedTagsRaw ? selectedTagsRaw.split(",").filter(Boolean) : []),
    [selectedTagsRaw]
  );
  const featuredOnly = searchParams.get("featured") === "true";

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
    (category: string | null, tags: string[], featured: boolean) => {
      const params = new URLSearchParams();
      if (featured) params.set("featured", "true");
      if (category) params.set("category", category);
      if (tags.length > 0) params.set("tags", tags.join(","));
      const query = params.toString();
      router.replace(query ? `/books?${query}` : "/books", { scroll: false });
      setVisibleCount(INITIAL_VISIBLE);
    },
    [router]
  );

  // ─── 필터 핸들러 ──────────────────────────────────────────────────────────

  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      updateURL(slug, selectedTags, featuredOnly);
    },
    [updateURL, selectedTags, featuredOnly]
  );

  const handleTagChange = useCallback(
    (tag: string) => {
      const next = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
      updateURL(selectedCategory, next, featuredOnly);
    },
    [updateURL, selectedCategory, selectedTags, featuredOnly]
  );

  const handleFeaturedChange = useCallback(
    (featured: boolean) => {
      updateURL(selectedCategory, selectedTags, featured);
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
    if (featuredOnly) result = result.filter((b) => b.featured);
    if (selectedCategory) result = result.filter((b) => b.category === selectedCategory);
    if (selectedTags.length > 0) result = result.filter((b) => selectedTags.every((tag) => b.tags.includes(tag)));
    return sortBooks(result, sortKey);
  }, [initialBooks, selectedCategory, selectedTags, sortKey, featuredOnly]);

  const visibleBooks = useMemo(
    () => filteredBooks.slice(0, visibleCount),
    [filteredBooks, visibleCount]
  );

  const hasMore = visibleCount < filteredBooks.length;

  // ─── 렌더 ────────────────────────────────────────────────────────────────

  return (
    <>
      <Header onSearchClick={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} books={initialBooks} />

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
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              사진책 전체 목록을 탐색하세요
            </p>
          </div>
        </div>

        {/* 본문: 사이드바 + 메인 그리드 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-8 items-start">

            {/* ── 사이드바 ── */}
            <FilterSidebar
              categories={sidebarCategories}
              tags={tags}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              featuredOnly={featuredOnly}
              onCategoryChange={handleCategoryChange}
              onTagChange={handleTagChange}
              onFeaturedChange={handleFeaturedChange}
              onReset={handleReset}
              mobileOpen={mobileFilterOpen}
              onMobileOpenChange={setMobileFilterOpen}
            />

            {/* ── 메인 컨텐츠 영역 ── */}
            <div className="flex-1 min-w-0">

              {/* 상단 바: 결과 카운트 + 활성 필터 + (모바일) 필터 버튼 + 정렬 */}
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm tabular-nums" style={{ color: "var(--text-muted)" }}>
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {filteredBooks.length}
                    </span>
                    권의 사진책
                  </span>

                  {(selectedCategory || selectedTags.length > 0) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedCategory && (
                        <ActiveFilterBadge
                          label={sidebarCategories.find((c) => c.slug === selectedCategory)?.name ?? selectedCategory}
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

                <div className="flex items-center gap-2">
                  {/* 모바일 필터 버튼 */}
                  <button
                    className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150"
                    onClick={() => setMobileFilterOpen(true)}
                    style={{
                      backgroundColor: (selectedCategory || selectedTags.length > 0 || featuredOnly) ? "var(--accent-muted)" : "var(--bg-secondary)",
                      color: (selectedCategory || selectedTags.length > 0 || featuredOnly) ? "var(--accent)" : "var(--text-secondary)",
                      border: `1px solid ${(selectedCategory || selectedTags.length > 0 || featuredOnly) ? "var(--accent)" : "var(--border-light)"}`,
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                      <line x1="11" y1="18" x2="13" y2="18" />
                    </svg>
                    필터
                    {(selectedCategory || selectedTags.length > 0) && (
                      <span
                        className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                        style={{ backgroundColor: "var(--accent)", color: "var(--text-on-accent)" }}
                      >
                        {(selectedCategory ? 1 : 0) + selectedTags.length}
                      </span>
                    )}
                  </button>

                  <SortSelect value={sortKey} onChange={setSortKey} />
                </div>
              </div>

              {/* 그리드 or 빈 상태 */}
              {filteredBooks.length === 0 ? (
                <EmptyState onReset={handleReset} />
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {visibleBooks.map((book, index) => (
                      <BookCard key={book.id} book={book} priority={index < 6} />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-10 flex justify-center">
                      <LoadMoreButton
                        remaining={filteredBooks.length - visibleCount}
                        onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
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
