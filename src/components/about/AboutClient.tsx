"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/search/SearchModal";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { books } from "@/data/books";
import { categories } from "@/data/categories";

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: "소개", href: "/about", current: true },
];

// 카테고리별 도트 색상 매핑 (categories.ts의 color 값 활용)
const COLLECTION_START_YEAR = 2018;

export default function AboutClient() {
  const [searchOpen, setSearchOpen] = useState(false);

  const totalBooks = books.length;
  const totalCategories = categories.length;

  return (
    <>
      <Header onSearchClick={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        {/* 브레드크럼 */}
        <div
          className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 pb-2"
        >
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </div>

        {/* ─── 히어로 섹션 ─── */}
        <section
          className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center"
        >
          {/* 장식선 */}
          <div
            className="mx-auto mb-8 w-12 h-px"
            style={{ backgroundColor: "var(--accent)" }}
            aria-hidden="true"
          />

          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--accent)",
              letterSpacing: "-0.01em",
            }}
          >
            사진책, 그 안의 세계
          </h1>

          <p
            className="text-base sm:text-lg italic leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            &ldquo;한 장의 사진은 세계를 향한 창문이다. 그 창문이 모인 곳이 사진책이다.&rdquo;
          </p>

          {/* 장식선 */}
          <div
            className="mx-auto mt-8 w-12 h-px"
            style={{ backgroundColor: "var(--accent)" }}
            aria-hidden="true"
          />
        </section>

        {/* ─── 바이오 섹션 ─── */}
        <section
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold mb-10"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--text-primary)",
            }}
          >
            이 라이브러리에 대하여
          </h2>

          <div className="flex flex-col gap-6">
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              사진책은 단순한 인쇄물이 아닙니다. 한 명의 사진가가 세계를 바라보는 시선,
              편집자가 그 시선을 재구성하는 방식, 그리고 독자가 페이지를 넘기며
              만들어가는 고유한 리듬—이 모든 것이 한 권의 책 안에 응축되어 있습니다.
            </p>

            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              이 라이브러리는 오랜 시간에 걸쳐 수집된 개인 소장본들을 정리하고 공유하기 위해
              만들어졌습니다. 다큐멘터리의 증언, 파인아트의 상상, 스트리트의 우연한 포착,
              한국 사진의 고유한 정서까지—각 장르가 품은 고유한 언어를 함께 탐색하는
              공간이 되기를 바랍니다.
            </p>

            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              수집의 기준은 단 하나입니다. 오래 곁에 두고 싶은 책. 책장을 넘길 때마다
              새로운 것을 발견하게 하는 책. 이 컬렉션이 사진과 책을 사랑하는 누군가에게
              작은 영감이 되기를 소망합니다.
            </p>
          </div>
        </section>

        {/* ─── 컬렉션 통계 ─── */}
        <section
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <h2
            className="text-xs font-semibold tracking-widest uppercase mb-10"
            style={{ color: "var(--text-muted)" }}
          >
            컬렉션 현황
          </h2>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            {/* 총 권수 */}
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-5xl sm:text-6xl font-bold leading-none"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--accent)",
                }}
              >
                {totalBooks}
              </span>
              <span
                className="text-xs sm:text-sm tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                총 소장 권수
              </span>
            </div>

            {/* 구분선 */}
            <div
              className="absolute hidden"
              aria-hidden="true"
            />

            {/* 카테고리 수 */}
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-5xl sm:text-6xl font-bold leading-none"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--accent)",
                }}
              >
                {totalCategories}
              </span>
              <span
                className="text-xs sm:text-sm tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                장르 카테고리
              </span>
            </div>

            {/* 수집 시작 연도 */}
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-5xl sm:text-6xl font-bold leading-none"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--accent)",
                }}
              >
                {COLLECTION_START_YEAR}
              </span>
              <span
                className="text-xs sm:text-sm tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                수집 시작 연도
              </span>
            </div>
          </div>
        </section>

        {/* ─── 카테고리 소개 ─── */}
        <section
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--text-primary)",
            }}
          >
            컬렉션 장르
          </h2>
          <p
            className="text-sm mb-10"
            style={{ color: "var(--text-muted)" }}
          >
            다양한 사진의 언어를 탐색하세요
          </p>

          <ul className="flex flex-col gap-0" role="list">
            {categories
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((cat, index) => (
                <li
                  key={cat.slug}
                  className="flex items-start gap-4 py-5 transition-colors duration-150"
                  style={{
                    borderTop: index === 0 ? "none" : "1px solid var(--border)",
                  }}
                >
                  {/* 컬러 도트 */}
                  <span
                    className="mt-1 shrink-0 w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden="true"
                  />

                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className="text-base font-medium"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {cat.name}
                      </span>
                      {cat.nameEn && (
                        <span
                          className="text-xs tracking-wide"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {cat.nameEn}
                        </span>
                      )}
                    </div>

                    {cat.description && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {cat.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </section>

        {/* ─── 하단 여백 ─── */}
        <div className="h-8" aria-hidden="true" />
      </main>

      <Footer />
    </>
  );
}
