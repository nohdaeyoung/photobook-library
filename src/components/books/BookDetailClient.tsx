"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PhotoBook, ImageAsset } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { BookCover } from "@/components/book/BookCover";
import { BookMeta } from "@/components/book/BookMeta";
import { RelatedBooks } from "@/components/book/RelatedBooks";
import LightboxViewer from "@/components/viewer/LightboxViewer";
import SearchModal from "@/components/search/SearchModal";

// ─── Props ────────────────────────────────────────────────────────────────────

interface NavItem {
  slug: string;
  title: string;
}

interface BookDetailClientProps {
  book: PhotoBook;
  relatedBooks: PhotoBook[];
  navigation: {
    prev: NavItem | null;
    next: NavItem | null;
  };
  categoryName: string;
}

// ─── 갤러리 이미지 카드 ────────────────────────────────────────────────────────

function GalleryThumb({
  image,
  index,
  onClick,
}: {
  image: ImageAsset;
  index: number;
  onClick: (index: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(index)}
      aria-label={`이미지 ${index + 1} 크게 보기`}
      className="group relative aspect-square overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{ backgroundColor: "var(--bg-tertiary)" }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        placeholder={image.blurDataURL ? "blur" : "empty"}
        blurDataURL={image.blurDataURL}
      />
      {/* 호버 오버레이 */}
      <span
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        aria-hidden="true"
      >
        {/* 돋보기 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "#fff" }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </span>
    </button>
  );
}

// ─── 네비게이션 링크 ───────────────────────────────────────────────────────────

function NavLink({
  book,
  direction,
}: {
  book: NavItem;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";

  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex flex-col gap-1 max-w-xs transition-opacity duration-150 hover:opacity-80"
      style={{ textAlign: isPrev ? "left" : "right" }}
    >
      <span
        className="text-xs uppercase tracking-widest flex items-center gap-1"
        style={{ color: "var(--text-muted)" }}
      >
        {isPrev && (
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
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
        {isPrev ? "이전" : "다음"}
        {!isPrev && (
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
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </span>
      <span
        className="text-sm font-medium leading-snug line-clamp-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {book.title}
      </span>
      {"author" in book && (book as { author?: string }).author && (
        <span
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {(book as { author: string }).author}
        </span>
      )}
    </Link>
  );
}

// ─── 메인 클라이언트 컴포넌트 ─────────────────────────────────────────────────

export function BookDetailClient({
  book,
  relatedBooks,
  navigation,
  categoryName,
}: BookDetailClientProps) {
  // ── 검색 모달 상태 ──────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // ── 라이트박스 상태 ─────────────────────────────────────
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = useCallback((index: number = 0) => {
    setViewerIndex(index);
    setViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => setViewerOpen(false), []);

  // BookMeta CTA 핸들러: 첫 번째 이미지(또는 커버)로 열기
  const handleOpenViewer = useCallback(() => {
    openViewer(0);
  }, [openViewer]);

  // 갤러리 이미지 클릭
  const handleGalleryClick = useCallback(
    (index: number) => {
      openViewer(index);
    },
    [openViewer]
  );

  // 라이트박스에 전달할 이미지 배열:
  // 내부 images가 있으면 그것을 사용, 없으면 커버 이미지로 대체
  const viewerImages =
    book.images && book.images.length > 0
      ? book.images
      : book.coverImage
        ? [book.coverImage]
        : [];

  // 브레드크럼 항목
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: categoryName, href: `/books?category=${book.category}` },
    { label: book.title, href: `/books/${book.slug}`, current: true },
  ];

  const hasGallery = book.images && book.images.length > 0;

  return (
    <>
      {/* ── 헤더 & 검색 모달 ─────────────────────────── */}
      <Header onSearchClick={openSearch} />
      <SearchModal isOpen={searchOpen} onClose={closeSearch} />

      {/* ── 라이트박스 ──────────────────────────────── */}
      <LightboxViewer
        images={viewerImages}
        initialIndex={viewerIndex}
        bookTitle={book.title}
        isOpen={viewerOpen}
        onClose={closeViewer}
      />

      {/* ── 페이지 본문 ─────────────────────────────── */}
      <main
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* 브레드크럼 */}
          <Breadcrumb items={breadcrumbItems} className="mb-8" />

          {/* ── 상단 영역: 커버 + 메타 ────────────────────────────── */}
          <section
            className="flex flex-col lg:flex-row lg:gap-12 mb-16"
            aria-label="책 정보"
          >
            {/* 좌측: 커버 이미지 */}
            <div className="w-full lg:w-2/5 mb-8 lg:mb-0">
              <BookCover
                image={book.coverImage}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="shadow-2xl"
              />
            </div>

            {/* 우측: 메타 정보 */}
            <div className="w-full lg:w-3/5">
              <BookMeta book={book} onOpenViewer={handleOpenViewer} />
            </div>
          </section>

          {/* ── 이미지 갤러리 섹션 ──────────────────────────────────── */}
          {hasGallery && (
            <section className="mb-16" aria-label="미리보기 갤러리">
              {/* 섹션 제목 */}
              <div className="flex items-center gap-3 mb-6">
                <h2
                  className="text-xl font-medium"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--text-primary)",
                  }}
                >
                  미리보기
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "var(--border)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {book.images.length}장
                </span>
              </div>

              {/* 이미지 그리드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {book.images.map((image, index) => (
                  <GalleryThumb
                    key={`${image.src}-${index}`}
                    image={image}
                    index={index}
                    onClick={handleGalleryClick}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── 관련 사진책 ──────────────────────────────────────────── */}
          {relatedBooks.length > 0 && (
            <section className="mb-16" aria-label="관련 사진책">
              <RelatedBooks books={relatedBooks} currentSlug={book.slug} />
            </section>
          )}

          {/* ── 이전/다음 네비게이션 ─────────────────────────────────── */}
          {(navigation.prev || navigation.next) && (
            <nav
              aria-label="다른 사진책 탐색"
              className="flex items-start justify-between gap-4 pt-8"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {/* 이전 책 */}
              <div>
                {navigation.prev ? (
                  <NavLink book={navigation.prev} direction="prev" />
                ) : (
                  <span />
                )}
              </div>

              {/* 다음 책 */}
              <div>
                {navigation.next ? (
                  <NavLink book={navigation.next} direction="next" />
                ) : (
                  <span />
                )}
              </div>
            </nav>
          )}
        </div>
      </main>

      {/* ── 푸터 ─────────────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
