# 사진책 라이브러리 (Photobook Library) 인수인계서

> **작성일**: 2026-03-04
> **작성자**: 노다영
> **현재 버전**: v2.0
> **상태**: 운영 중 (프로덕션 배포 완료)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 사진책 라이브러리 (Photobook & ArtBook Library) |
| **목적** | 개인 소장 사진책 컬렉션을 온라인으로 전시·탐색하는 아카이브 사이트 |
| **운영 URL** | https://l.324.ing |
| **로컬 경로** | `/Volumes/Dev/photobook-library` |
| **시작일** | 2025-12 |
| **최근 업데이트** | 2026-03-02 |

---

## 2. 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.1.6 |
| 언어 | TypeScript | ^5 |
| UI 라이브러리 | React | 19.2.3 |
| 스타일링 | Tailwind CSS | v4 |
| CMS | Sanity (Headless CMS) | 7.x |
| 검색 | Fuse.js (클라이언트 사이드 퍼지 검색) | 7.x |
| 애니메이션 | Framer Motion | 12.x |
| 에디터 | Tiptap (리치 텍스트) | 3.x |
| 유틸리티 | clsx + tailwind-merge | — |
| 배포 | Vercel | — |
| 이미지 스토리지 | Sanity CDN + Cloudflare R2 | — |

---

## 3. 배포 및 환경

### 배포 방법

```bash
# 프로덕션 배포 (Vercel — 메인 사용)
npx vercel --prod

# 로컬 개발 서버
npm run dev        # http://localhost:3000

# 프로덕션 빌드 확인
npm run build && npm start
```

### 환경 정보

| 항목 | 값 |
|------|---|
| Sanity Project ID | `emspj2jw` |
| Sanity Dataset | `production` |
| 배포 플랫폼 | Vercel |
| 이미지 도메인 | `cdn.sanity.io`, `*.r2.cloudflarestorage.com` |

> **주의**: Cloudflare Workers 배포(`npm run deploy`)는 번들 크기 초과로 사용 불가. Vercel만 사용할 것.

---

## 4. 디렉토리 구조

```
photobook-library/
├── src/
│   ├── app/                        # Next.js App Router 페이지
│   │   ├── page.tsx                # 홈 (/)
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   ├── globals.css             # 전역 CSS 변수 및 디자인 토큰
│   │   ├── robots.ts               # robots.txt 자동 생성
│   │   ├── sitemap.ts              # sitemap.xml 동적 생성
│   │   ├── opengraph-image.tsx     # 기본 OG 이미지 (edge runtime)
│   │   ├── not-found.tsx           # 404 페이지
│   │   ├── books/
│   │   │   ├── page.tsx            # 컬렉션 목록 (/books)
│   │   │   └── [slug]/page.tsx     # 책 상세 (/books/:slug)
│   │   ├── about/page.tsx          # 소개 (/about)
│   │   ├── search/page.tsx         # 검색 (/search)
│   │   └── eodud/                  # 관리자 페이지 (비공개 경로)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # 글로벌 헤더 (네비게이션, 검색, 테마 토글)
│   │   │   ├── Footer.tsx          # 글로벌 푸터
│   │   │   └── Breadcrumb.tsx      # 브레드크럼 내비게이션
│   │   ├── book/
│   │   │   ├── BookCard.tsx        # 카드형 미리보기 (sm/md/lg)
│   │   │   ├── BookCover.tsx       # 표지 이미지 (라이트박스 연동)
│   │   │   ├── BookMeta.tsx        # 메타정보 (출판사, ISBN 등)
│   │   │   └── RelatedBooks.tsx    # 연관 책 목록
│   │   ├── books/
│   │   │   ├── BooksClient.tsx     # 컬렉션 클라이언트 (필터/정렬)
│   │   │   ├── BookDetailClient.tsx
│   │   │   ├── ActiveFilterBadge.tsx
│   │   │   ├── SortSelect.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── LoadMoreButton.tsx
│   │   ├── home/
│   │   │   ├── HomeClient.tsx      # 서버 컴포넌트
│   │   │   └── HomeInteractive.tsx # 클라이언트 인터랙션 (검색 상태)
│   │   ├── viewer/
│   │   │   └── LightboxViewer.tsx  # 이미지 라이트박스 (키보드 지원)
│   │   ├── search/
│   │   │   ├── SearchModal.tsx     # 전체화면 검색 모달
│   │   │   ├── SearchInput.tsx
│   │   │   └── SearchPageClient.tsx
│   │   └── ui/
│   │       ├── Button.tsx          # primary / secondary / ghost
│   │       ├── Tag.tsx             # default / active / removable
│   │       ├── Badge.tsx           # 카테고리 배지 (컬러 도트)
│   │       ├── Skeleton.tsx        # 로딩 플레이스홀더
│   │       ├── FilterSidebar.tsx   # 필터 패널
│   │       └── SidebarContent.tsx
│   │
│   ├── data/                       # Phase 1 정적 데이터 (Sanity 연동 전 임시)
│   │   ├── books.ts                # 샘플 사진책 데이터
│   │   └── categories.ts           # 10개 카테고리
│   │
│   ├── lib/
│   │   ├── books.ts                # 데이터 조회/필터/정렬 함수
│   │   ├── jsonld.ts               # JSON-LD 구조화 데이터 생성 함수
│   │   ├── utils.ts                # cn() 유틸리티 (clsx + tailwind-merge)
│   │   └── search/fuseConfig.ts    # Fuse.js 설정 및 캐싱 인스턴스
│   │
│   ├── sanity/
│   │   ├── client.ts               # Sanity 읽기/쓰기 클라이언트
│   │   ├── admin-client.ts         # 관리자 전용 클라이언트
│   │   ├── queries.ts              # GROQ 쿼리 정의
│   │   └── schemas/
│   │       ├── book.ts             # Book 스키마
│   │       ├── category.ts         # Category 스키마
│   │       └── siteSettings.ts     # 사이트 설정
│   │
│   └── types/index.ts              # TypeScript 타입 정의
│
├── docs/                           # 설계 문서
├── public/images/books/            # 정적 이미지 에셋
├── sanity.config.ts                # Sanity Studio 설정
├── next.config.ts                  # Next.js 설정
└── package.json
```

---

## 5. 페이지 구성

| 경로 | 페이지 | 렌더링 | 설명 |
|------|--------|--------|------|
| `/` | 홈 | SSG | 추천책, 최신책, 카테고리 목록 |
| `/books` | 컬렉션 | SSG + CSR | 전체 목록, 카테고리/태그/연도 필터, 정렬 |
| `/books/[slug]` | 책 상세 | SSG | 표지, 갤러리, 메타정보, 연관책, 이전/다음 |
| `/about` | 소개 | SSG | 큐레이터 소개 및 컬렉션 철학 |
| `/search` | 검색 | CSR | Fuse.js 퍼지 검색 결과 |
| `/eodud` | 관리자 | CSR | 도서/카테고리 CRUD, ISBN 조회, 이미지 업로드 |

---

## 6. 데이터 모델

### PhotoBook 주요 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` / `titleEn` | string | ✅ | 한글/영문 제목 |
| `slug` | string | ✅ | URL 경로 (영문, kebab-case) |
| `author` | string | ✅ | 작가 |
| `year` | number | ✅ | 출판 연도 |
| `category` | reference | ✅ | 카테고리 참조 |
| `tags` | string[] | — | 태그 배열 (3~7개 권장) |
| `coverImage` | image | — | 표지 이미지 (hotspot 지원) |
| `images` | image[] | — | 갤러리 내지 이미지 |
| `featured` | boolean | — | 추천 여부 (홈 노출) |
| `isbn` | string | — | ISBN (관리자에서 자동 조회 가능) |
| `language` | ko/en/ja/other | — | 원서 언어 |
| `format` | hardcover/softcover/spiral/box-set | — | 제본 형태 |

### 카테고리 (10개 고정)

| 슬러그 | 이름 | 색상 |
|--------|------|------|
| `documentary` | 다큐멘터리 | `#E53E3E` |
| `portrait` | 인물/초상 | `#DD6B20` |
| `landscape` | 풍경/자연 | `#38A169` |
| `street` | 스트리트 | `#3182CE` |
| `fine-art` | 파인아트 | `#805AD5` |
| `korean-photography` | 한국 사진 | `#E0C080` |
| `fashion` | 패션/광고 | `#ED64A6` |
| `independent` | 독립/아티스트북 | `#4FD1C5` |
| `exhibition` | 전시 도록 | `#9F7AEA` |
| `archive` | 역사/아카이브 | `#718096` |

### 데이터 조회 함수 (`src/lib/books.ts`)

```typescript
getAllBooks()                    // 전체 책 목록
getBookBySlug(slug)             // 단일 책 조회
getFeaturedBooks()              // 추천 책
getRecentBooks(limit)           // 최신 책
getAllCategories()               // 카테고리 목록
getCategoryBySlug(slug)         // 단일 카테고리
getAllTags()                     // 전체 태그 수집
getRelatedBooks(slug, limit)    // 연관 책 (같은 카테고리)
getBookNavigation(slug)         // 이전/다음 책
```

---

## 7. 관리자 기능 (`/eodud`)

> 경로를 외부에 노출하지 말 것. 추후 인증 계층 추가 필요.

- 도서 추가 / 수정 / 삭제
- 카테고리 CRUD
- **ISBN 자동 조회** — OpenLibrary + 카카오 책 검색 API로 메타정보 자동 입력
- 갤러리 이미지 업로드 (로컬 파일 → Sanity)
- Tiptap 리치 텍스트 에디터 (상세 컨텐츠 작성)

---

## 8. 디자인 시스템

### 테마

기본 다크모드. `<html data-theme="dark|light">` 속성으로 전환.

### 핵심 CSS 변수 (`src/app/globals.css`)

| 변수 | 다크 | 라이트 | 용도 |
|------|------|--------|------|
| `--bg-primary` | `#0D0D0D` | `#FAFAF8` | 페이지 배경 |
| `--bg-secondary` | `#1A1A1A` | `#FFFFFF` | 카드 배경 |
| `--text-primary` | `#F0F0F0` | `#1A1A1A` | 본문 텍스트 |
| `--accent` | `#E0C080` | `#B8932E` | 주요 액션/강조 |
| `--border` | `#2A2A2A` | `#E0E0E0` | 기본 테두리 |

### 서체

| 용도 | 서체 | 로딩 |
|------|------|------|
| 제목 (h1~h6, 책 제목) | Nanum Myeongjo | Google Fonts |
| 본문 / UI | Pretendard | 로컬 파일 (`PretendardVariable.woff2`) |
| 숫자/코드 (ISBN 등) | JetBrains Mono | 시스템 폴백 |

### 컴포넌트 사용 예시

```tsx
<Button variant="primary" size="md">컬렉션 보기</Button>
<Button variant="secondary" size="sm">필터 초기화</Button>
<Tag name="흑백" variant="active" onClick={...} />
<Badge name="다큐멘터리" color="#E53E3E" />
<BookCard book={book} size="md" priority={true} />
```

---

## 9. SEO 구조

### 구현 현황

| 항목 | 파일 | 상태 |
|------|------|------|
| robots.txt | `src/app/robots.ts` | ✅ |
| sitemap.xml | `src/app/sitemap.ts` | ✅ 동적 생성 (55+ 페이지) |
| OG 기본 이미지 | `src/app/opengraph-image.tsx` | ✅ edge runtime |
| JSON-LD WebSite | `src/lib/jsonld.ts` | ✅ |
| JSON-LD Book | `src/app/books/[slug]/page.tsx` | ✅ |
| JSON-LD BreadcrumbList | `src/app/books/[slug]/page.tsx` | ✅ |
| JSON-LD CollectionPage | `src/app/books/page.tsx` | ✅ |
| 카노니컬 URL | 모든 페이지 | ✅ |

### 크롤링 제한

```
Disallow: /search?*   # 파라미터별 중복 인덱싱 방지
Disallow: /studio     # Sanity Studio
Disallow: /eodud      # 관리자 페이지
```

---

## 10. 성능 지표 (v2.0 기준)

| 지표 | 측정값 | 목표 |
|------|--------|------|
| LCP | 2.1초 | 2.5초 이하 ✅ |
| FID | 45ms | 100ms 이하 ✅ |
| CLS | 0.08 | 0.1 이하 ✅ |
| Desktop 성능 | 95/100 | — ✅ |
| Mobile 성능 | 92/100 | — ✅ |
| Accessibility | 98/100 | — ✅ |

---

## 11. 완료된 작업 이력

### Phase 1 — 기초 구축 (2025-12)
- Next.js App Router 기반 정적 사이트
- 사진책 목록/상세 페이지
- 카테고리/태그 필터링, Fuse.js 검색
- 라이트박스 이미지 뷰어
- 반응형 레이아웃 + 다크모드

### Phase 2 — Sanity CMS 연동 (2026-01)
- Sanity CMS 스키마 설계 (book, category, siteSettings)
- GROQ 쿼리 구현
- 관리자 페이지 (`/eodud`) 구현
  - 도서 CRUD, ISBN 자동 조회, 이미지 업로드
- SEO 구조화 데이터 (JSON-LD 4종)
- robots.txt, sitemap.xml 구현
- CSS 디자인 토큰 중앙화
- 이미지 최적화 (WebP/AVIF, 30일 캐시)

### Phase 3 — 코드 품질 개선 (2026-03-02)
22개 이슈 전체 해결 (100%):

| 분류 | 이슈 수 | 주요 내용 |
|------|---------|-----------|
| FE | 6개 | SearchModal props 전달, Fuse.js 캐시 무효화, useSanity TTL 캐시, tailwind-merge 적용 |
| UI | 7개 | ActiveFilterBadge, SortSelect, EmptyState, LoadMoreButton, SidebarContent, HomeInteractive 컴포넌트 분리 |
| DS | 5개 | 라이트모드 danger/success 색상 추가, 테마 토글 SVG 아이콘, @theme inline 토큰 보완 |
| SEO | 2개 | opengraph-image.tsx 생성, Twitter Card 추가 |
| PERF | 2개 | HomeClient 서버 컴포넌트화 분리 |

---

## 12. 현재 미완성 / 향후 작업

| 작업 | 우선순위 | 메모 |
|------|----------|------|
| **관리자 인증 시스템** | 중 | `/eodud` 현재 인증 없음. 숨겨진 경로로만 보호 중 — 인증 계층 필수 |
| Phase 3 기능 (댓글, 뉴스레터) | 중 | 데이터 모델 확장 필요 |
| Cloudflare R2 마이그레이션 | 낮 | 현재 Sanity CDN 사용 중. R2로 이전 시 비용 절감 가능 |
| 다국어 라우팅 (`/en`, `/ja`) | 낮 | `titleEn` 필드는 준비됨. i18n 라우팅 미구현 |
| Google Analytics 4 통합 | 낮 | 사용자 행동 분석 도구 미설치 |
| Sanity 웹훅 연동 | 낮 | 콘텐츠 변경 시 즉시 ISR 트리거를 위한 웹훅 설정 필요 |

---

## 13. 알아야 할 주의사항

1. **배포**: 반드시 `npx vercel --prod` 사용. Cloudflare Workers(`npm run deploy`)는 사용 불가.
2. **관리자 경로**: `/eodud` — 외부 노출 금지. 추후 반드시 인증 추가 필요.
3. **카테고리는 고정 10개** — 임의로 추가/삭제 시 UI 색상 연동 확인 필요.
4. **Sanity 스키마 변경 시** — `sanity.config.ts` 수정 후 Sanity Studio에서 마이그레이션 처리.
5. **이미지 파일명 규칙** — 소문자 + 하이픈, 한글 금지 (URL 인코딩 문제). 예: `documentary-robert-frank-the-americans-cover.jpg`
6. **Fuse.js 검색 인덱스** — `src/lib/search/fuseConfig.ts`의 가중치 설정: title(40%), author(25%), titleEn(15%), tags(12%).

---

## 14. 관련 문서

| 문서 | 경로 |
|------|------|
| 프로젝트 개요 | `docs/01-project-overview.md` |
| 데이터 모델 | `docs/02-data-model.md` |
| 디자인 시스템 | `docs/03-design-system.md` |
| SEO 전략 | `docs/04-seo-strategy.md` |
| 이슈 목록 (처리 완료) | `docs/issues.md` |
| 최종 완료 보고서 | `docs/archive/2026-03/data/data.report.md` |

---

*이 문서는 2026-03-04 기준으로 작성되었습니다.*
