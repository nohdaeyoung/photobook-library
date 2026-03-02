"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/search/SearchModal";
import Breadcrumb from "@/components/layout/Breadcrumb";
import type { PhotoBook } from "@/types";

interface DevNotesClientProps {
  allBooks: PhotoBook[];
}

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: "개발노트", href: "/dev-notes", current: true },
];

interface DevNote {
  date: string;
  entries: { type: "feat" | "fix" | "chore"; title: string; description?: string }[];
}

const DEV_NOTES: DevNote[] = [
  {
    date: "2026-03-02",
    entries: [
      {
        type: "feat",
        title: "관리자 페이지에 카테고리 CRUD 관리 기능 추가",
        description:
          "도서/카테고리 탭 UI, 카테고리 생성/수정/삭제 서버 액션, 참조 중인 도서가 있을 때 삭제 차단 기능 구현",
      },
      {
        type: "feat",
        title: "갤러리 이미지 관리 기능 강화",
        description:
          "썸네일 표시, 드래그 순서 변경, 개별 삭제 기능 추가",
      },
      {
        type: "fix",
        title: "서버 액션 body 크기 제한을 10MB로 증가",
        description: "대용량 이미지 업로드 시 발생하던 오류 해결",
      },
    ],
  },
  {
    date: "2026-03-01",
    entries: [
      {
        type: "feat",
        title: "커스텀 한국어 관리자 페이지 (/admin) 구현",
        description:
          "Sanity Studio 대신 사용할 수 있는 직관적인 한국어 관리자 UI 구축",
      },
      {
        type: "feat",
        title: "ISBN 자동 조회 기능 추가",
        description:
          "Google Books API + 카카오 책 검색 API를 활용한 ISBN 기반 도서 정보 자동 입력",
      },
      {
        type: "feat",
        title: "표지 이미지 업로드 + 리치 텍스트 에디터",
        description:
          "Sanity 이미지 에셋 업로드, TipTap 기반 리치 텍스트 에디터 통합",
      },
      {
        type: "feat",
        title: "갤러리 이미지 로컬 파일 업로드 기능",
        description:
          "여러 장의 갤러리 이미지를 한 번에 업로드하고 미리보기 제공",
      },
      {
        type: "feat",
        title: "임베드 기능 및 ContentRenderer 추가",
        description: "YouTube, 외부 링크 등 임베드 컨텐츠 렌더링 지원",
      },
      {
        type: "feat",
        title: "ISBN 표지 이미지 fallback 지원",
        description:
          "업로드 이미지가 없을 때 ISBN 조회로 가져온 표지 URL을 대체 이미지로 활용",
      },
      {
        type: "feat",
        title: "Sanity CMS 연동 완료",
        description:
          "Sanity를 백엔드 CMS로 채택하고 스키마 정의, 클라이언트 설정, 데이터 마이그레이션 완료",
      },
      {
        type: "feat",
        title: "Photobook & ArtBook Library MVP 구현",
        description:
          "Next.js 기반 사진책 라이브러리 프로젝트 초기 구현. 홈, 컬렉션, 상세, 검색, 소개 페이지 포함",
      },
      {
        type: "fix",
        title: "다수의 버그 수정",
        description:
          "Sanity CDN 캐시 비활성화, 갤러리 업로드 에러 처리 개선, null coverImage 처리, Cloudflare 의존성 제거 등",
      },
    ],
  },
];

const TYPE_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  feat: { label: "기능", bg: "rgba(72,187,120,0.15)", color: "#48BB78" },
  fix: { label: "수정", bg: "rgba(237,137,54,0.15)", color: "#ED8936" },
  chore: { label: "기타", bg: "rgba(160,174,192,0.15)", color: "#A0AEC0" },
};

export default function DevNotesClient({ allBooks }: DevNotesClientProps) {
  const [searchOpen, setSearchOpen] = useState(false);

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
            개발노트
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Photobook & ArtBook Library 개발 과정을 일자별로 정리한 기록입니다.
          </p>
        </section>

        {/* 타임라인 */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex flex-col gap-12">
            {DEV_NOTES.map((note) => (
              <div key={note.date}>
                {/* 날짜 헤더 */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <h2
                    className="text-lg font-bold tabular-nums"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {note.date}
                  </h2>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--border)" }}
                  />
                </div>

                {/* 항목 리스트 */}
                <div className="flex flex-col gap-3 pl-6">
                  {note.entries.map((entry, idx) => {
                    const style = TYPE_STYLES[entry.type];
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                            style={{
                              backgroundColor: style.bg,
                              color: style.color,
                            }}
                          >
                            {style.label}
                          </span>
                          <div>
                            <h3
                              className="text-sm font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {entry.title}
                            </h3>
                            {entry.description && (
                              <p
                                className="text-sm mt-1 leading-relaxed"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {entry.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
