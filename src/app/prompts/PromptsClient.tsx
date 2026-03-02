"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/search/SearchModal";
import Breadcrumb from "@/components/layout/Breadcrumb";
import type { PhotoBook } from "@/types";

interface PromptsClientProps {
  allBooks: PhotoBook[];
}

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: "프롬프트", href: "/prompts", current: true },
];

interface Prompt {
  title: string;
  description: string;
  prompt: string;
  result: string;
}

const PROMPTS: Prompt[] = [
  {
    title: "MVP 구현",
    description: "사진책 라이브러리 프로젝트의 초기 구조와 핵심 페이지를 한 번에 생성",
    prompt:
      "개인 소장 사진책 컬렉션을 온라인으로 감상할 수 있는 사진책 라이브러리 웹사이트를 만들어줘. Next.js App Router, Tailwind CSS 사용. 홈, 컬렉션(목록/필터), 상세, 검색, 소개 페이지. 다크 테마 기본, 미니멀한 갤러리 느낌의 디자인.",
    result: "홈, 컬렉션, 상세, 검색, 소개 5개 페이지 + 컴포넌트 구조 완성",
  },
  {
    title: "Sanity CMS 연동",
    description: "정적 데이터를 CMS 기반으로 전환하여 동적 관리 가능하게 변경",
    prompt:
      "현재 하드코딩된 도서 데이터를 Sanity CMS로 마이그레이션해줘. book, category 스키마 정의, 기존 데이터 자동 마이그레이션 스크립트, Sanity Studio 통합까지.",
    result: "Sanity 스키마 정의, 데이터 마이그레이션, Studio 라우트 설정 완료",
  },
  {
    title: "관리자 페이지 구현",
    description: "Sanity Studio 대신 사용할 한국어 커스텀 관리자 UI",
    prompt:
      "Sanity Studio는 영어라서 불편해. /admin 경로에 한국어 관리자 페이지를 만들어줘. 도서 CRUD, 이미지 업로드, 카테고리 선택이 가능해야 해.",
    result: "도서 목록/등록/수정/삭제, 이미지 업로드, 카테고리 드롭다운 포함 관리자 페이지",
  },
  {
    title: "ISBN 자동 조회",
    description: "ISBN 입력만으로 도서 정보를 자동으로 채워주는 기능",
    prompt:
      "관리자 도서 등록 폼에 ISBN 입력 필드를 추가하고, ISBN을 입력하면 Google Books API로 제목, 작가, 출판사, 표지 등을 자동으로 불러와서 폼에 채워줘.",
    result: "Google Books + 카카오 API 이중 fallback ISBN 조회, 자동 폼 채움 구현",
  },
  {
    title: "리치 텍스트 에디터",
    description: "도서 상세 컨텐츠를 위한 WYSIWYG 에디터 통합",
    prompt:
      "도서 상세 컨텐츠 입력을 위해 리치 텍스트 에디터를 추가해줘. 볼드, 이탤릭, 링크, 리스트 정도면 충분해.",
    result: "TipTap 기반 리치 텍스트 에디터 + ContentRenderer 컴포넌트",
  },
  {
    title: "갤러리 이미지 관리",
    description: "도서별 갤러리 이미지 업로드 및 순서 관리",
    prompt:
      "도서에 갤러리 이미지를 여러 장 업로드할 수 있게 해줘. 썸네일 미리보기, 순서 변경(위/아래 버튼), 개별 삭제가 가능해야 해.",
    result: "다중 이미지 업로드, 썸네일 미리보기, 순서 변경, 개별 삭제 기능",
  },
  {
    title: "카테고리 관리 기능",
    description: "관리자 페이지에서 카테고리 CRUD를 직접 관리",
    prompt:
      "관리자 페이지에 카테고리 관리 탭을 추가해줘. 도서/카테고리 탭으로 전환할 수 있고, 카테고리 생성/수정/삭제가 가능해야 해. 도서가 참조 중인 카테고리는 삭제 못하게 막아줘.",
    result: "도서/카테고리 탭 UI, 카테고리 CRUD, 참조 도서 삭제 차단 기능",
  },
];

export default function PromptsClient({ allBooks }: PromptsClientProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <>
      <Header onSearchClick={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} books={allBooks} />

      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 pb-2">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </div>

        {/* 헤더 */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div
            className="mx-auto mb-6 w-12 h-px"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            프롬프트
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            이 사이트를 만드는 데 사용된 주요 프롬프트입니다.
            <br />
            Claude Code (claude-opus-4-6)와의 대화를 통해 구현되었습니다.
          </p>
        </section>

        {/* 프롬프트 목록 */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex flex-col gap-4">
            {PROMPTS.map((p, idx) => {
              const isOpen = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {/* 헤더 (클릭으로 토글) */}
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center gap-4"
                  >
                    <span
                      className="text-xs font-bold tabular-nums flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--accent-muted)",
                        color: "var(--accent)",
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {p.title}
                      </h3>
                      <p
                        className="text-xs mt-0.5 truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {p.description}
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="flex-shrink-0 transition-transform"
                      style={{
                        color: "var(--text-muted)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* 상세 내용 */}
                  {isOpen && (
                    <div
                      className="px-5 pb-5 flex flex-col gap-4"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <div className="pt-4">
                        <span
                          className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "var(--accent)" }}
                        >
                          Prompt
                        </span>
                        <div
                          className="mt-2 p-4 rounded-lg text-sm leading-relaxed"
                          style={{
                            backgroundColor: "var(--bg-tertiary)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                            fontFamily: "var(--font-mono, monospace)",
                          }}
                        >
                          {p.prompt}
                        </div>
                      </div>

                      <div>
                        <span
                          className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Result
                        </span>
                        <p
                          className="mt-2 text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {p.result}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
