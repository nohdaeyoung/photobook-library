"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/search/SearchModal";
import { BookCard } from "@/components/book/BookCard";
import type { PhotoBook, Category } from "@/types";

interface HomeClientProps {
  featuredBooks: PhotoBook[];
  recentBooks: PhotoBook[];
  categories: Category[];
}

export default function HomeClient({
  featuredBooks,
  recentBooks,
  categories,
}: HomeClientProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* 헤더 */}
      <Header onSearchClick={() => setSearchOpen(true)} />

      {/* 검색 모달 */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="flex-1">
        {/* ────────────────────────────────────────
            1. 히어로 섹션
        ──────────────────────────────────────── */}
        <section
          className="relative flex flex-col items-center justify-center min-h-[85vh] overflow-hidden"
          aria-label="히어로"
        >
          {/* 배경 그라디언트 */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0.4) 60%, rgba(13,13,13,0) 100%)",
            }}
          />

          {/* 배경 장식: 미묘한 노이즈 텍스처 느낌의 점선 패턴 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--accent) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* 히어로 콘텐츠 */}
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            {/* 작은 레이블 */}
            <span
              className="text-xs tracking-[0.4em] uppercase mb-6 font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Personal Collection
            </span>

            {/* 메인 타이틀 */}
            <h1
              className="text-6xl md:text-8xl font-medium leading-none tracking-widest mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--accent)",
                letterSpacing: "0.1em",
              }}
            >
              PHOTOBOOK
              <br />
              & ArtBook
              <br />
              LIBRARY
            </h1>

            {/* 구분선 */}
            <div
              className="w-16 h-px my-6"
              aria-hidden="true"
              style={{ backgroundColor: "var(--accent)" }}
            />

            {/* 부제목 */}
            <p
              className="text-base md:text-lg max-w-md leading-relaxed mb-10"
              style={{ color: "var(--text-secondary)" }}
            >
              개인 소장 사진책 & 아트북 컬렉션
            </p>

            {/* CTA 버튼 */}
            <Link
              href="/books"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-medium tracking-widest uppercase transition-all duration-[var(--transition-normal)]"
              style={{
                backgroundColor: "var(--accent)",
                color: "#0D0D0D",
                letterSpacing: "0.15em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-hover)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(224,192,128,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              컬렉션 탐색하기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* 스크롤 유도 화살표 */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            aria-hidden="true"
            style={{ animation: "bounce 2s infinite" }}
          >
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--text-muted)", fontSize: "10px" }}
            >
              scroll
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--text-muted)" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </section>

        {/* ────────────────────────────────────────
            2. 추천 사진책 섹션
        ──────────────────────────────────────── */}
        <section
          className="py-16 md:py-24"
          aria-labelledby="featured-heading"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div className="max-w-7xl mx-auto px-4">
            {/* 섹션 헤더 */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <span
                  className="block text-xs tracking-[0.35em] uppercase mb-3 font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Featured
                </span>
                <h2
                  id="featured-heading"
                  className="text-3xl font-medium"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--accent)",
                  }}
                >
                  추천 사진책
                </h2>
              </div>
              <Link
                href="/books"
                className="hidden md:inline-flex items-center gap-2 text-sm transition-colors duration-150"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                전체 보기
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            {/* 북 카드 그리드 */}
            {featuredBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredBooks.map((book, index) => (
                  <div key={book.id} className="flex justify-center">
                    <BookCard book={book} priority={index < 4} size="md" />
                  </div>
                ))}
              </div>
            ) : (
              <p
                className="text-sm py-12 text-center"
                style={{ color: "var(--text-muted)" }}
              >
                추천 사진책이 없습니다.
              </p>
            )}
          </div>
        </section>

        {/* 섹션 구분선 */}
        <div
          className="max-w-7xl mx-auto px-4"
          aria-hidden="true"
        >
          <div style={{ height: "1px", backgroundColor: "var(--border)" }} />
        </div>

        {/* ────────────────────────────────────────
            3. 카테고리 탐색 섹션
        ──────────────────────────────────────── */}
        <section
          className="py-16 md:py-24"
          aria-labelledby="categories-heading"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div className="max-w-7xl mx-auto px-4">
            {/* 섹션 헤더 */}
            <div className="mb-10">
              <span
                className="block text-xs tracking-[0.35em] uppercase mb-3 font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Browse
              </span>
              <h2
                id="categories-heading"
                className="text-3xl font-medium"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--accent)",
                }}
              >
                카테고리
              </h2>
            </div>

            {/* 카테고리 카드 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/books?category=${cat.slug}`}
                  className="group flex flex-col gap-3 p-5 rounded-[var(--radius-lg)] transition-all duration-[var(--transition-normal)]"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "var(--shadow-card-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* 상단: color dot + 책 수 */}
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      aria-hidden="true"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span
                      className="text-xs tabular-nums"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {cat.bookCount ?? 0}권
                    </span>
                  </div>

                  {/* 카테고리 이름 */}
                  <div>
                    <p
                      className="text-sm font-medium leading-snug transition-colors duration-150 group-hover:text-[var(--accent)]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {cat.name}
                    </p>
                    {cat.nameEn && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {cat.nameEn}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 섹션 구분선 */}
        <div
          className="max-w-7xl mx-auto px-4"
          aria-hidden="true"
        >
          <div style={{ height: "1px", backgroundColor: "var(--border)" }} />
        </div>

        {/* ────────────────────────────────────────
            4. 최근 추가 섹션
        ──────────────────────────────────────── */}
        <section
          className="py-16 md:py-24"
          aria-labelledby="recent-heading"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div className="max-w-7xl mx-auto px-4">
            {/* 섹션 헤더 */}
            <div className="mb-10">
              <span
                className="block text-xs tracking-[0.35em] uppercase mb-3 font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Recently Added
              </span>
              <h2
                id="recent-heading"
                className="text-3xl font-medium"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--accent)",
                }}
              >
                최근 추가된 사진책
              </h2>
            </div>

            {/* 북 카드 그리드 */}
            {recentBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex justify-center">
                    <BookCard book={book} size="md" />
                  </div>
                ))}
              </div>
            ) : (
              <p
                className="text-sm py-12 text-center"
                style={{ color: "var(--text-muted)" }}
              >
                등록된 사진책이 없습니다.
              </p>
            )}

            {/* 전체 보기 버튼 */}
            <div className="flex justify-center mt-12">
              <Link
                href="/books"
                className="inline-flex items-center gap-3 px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-[var(--transition-normal)]"
                style={{
                  border: "1px solid var(--accent)",
                  color: "var(--accent)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent-muted)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                전체 보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <Footer />

      {/* 바운스 애니메이션 인라인 키프레임 */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
