# 담당자별 이슈 목록
> 작성일: 2026-03-02 | 코드 직접 확인 기준
> 마지막 업데이트: 2026-03-02 (전체 이슈 처리 완료)

---

## 👨‍💻 Frontend Developer

### 🔴 Critical

#### ✅ FE-01 SearchModal이 정적 데이터 직접 import
- **해결 완료**: 부모 서버 컴포넌트에서 `allBooks`를 fetch해 props로 전달. SearchModal은 `books: PhotoBook[]` prop 수신.

#### ✅ FE-02 Fuse 검색 인덱스 캐시 무효화 불가
- **해결 완료**: `fuseConfig.ts` — `cachedBooks !== books` 참조 비교로 배열 변경 시 인덱스 재생성.

#### ✅ FE-03 useSanity 전역 상태 TTL 없음
- **해결 완료**: `src/lib/books.ts` — `useSanityCache: { value: boolean; ts: number }` + 60초 TTL.

---

### 🟡 Warning

#### ✅ FE-04 tailwind-merge 미사용
- **해결 완료**: `npm install tailwind-merge`, `cn()` → `twMerge(clsx(inputs))`.

#### ✅ FE-05 onMouseEnter/onMouseLeave로 DOM 직접 조작
- **해결 완료**: `Header.tsx`, `HomeClient.tsx`, `BooksClient.tsx` — 모두 Tailwind `hover:` 유틸리티로 교체.

#### ✅ FE-06 인기 태그 UI 코드 중복
- **해결 완료**: `SearchModal.tsx` — `PopularTagList` 서브 컴포넌트로 추출.

#### ✅ FE-07 파일 크기 초과
- **해결 완료**:
  - `BooksClient.tsx` → `ActiveFilterBadge`, `SortSelect`, `EmptyState`, `LoadMoreButton` 개별 파일 분리
  - `FilterSidebar.tsx` → `SidebarContent` 를 `src/components/ui/SidebarContent.tsx`로 분리

---

## 🎨 UI/UX Designer

### 🔴 Critical

#### ✅ DS-01 라이트 모드에 danger/success 색상 미정의
- **해결 완료**: `globals.css` — `[data-theme="light"]` 블록에 `--danger`, `--success` 추가.

#### ✅ DS-02 테마 토글 이모지 사용
- **해결 완료**: `Header.tsx` — Sun/Moon SVG 아이콘으로 교체.

---

### 🟡 Warning

#### ✅ DS-03 @theme 매핑 불완전
- **해결 완료**: `globals.css` `@theme inline` 블록에 누락 토큰 추가:
  - `--color-accent-muted`, `--color-bg-overlay`, `--color-text-on-accent`, `--color-border-hover`
  - `--color-danger`, `--color-success`
  - `--shadow-card`, `--shadow-card-hover`, `--shadow-overlay`
  - `--radius-sm/md/lg/xl`

#### ✅ DS-04 헤더 배경 fallback 다크 전용
- **해결 완료**: `Header.tsx` — `var(--bg-overlay, rgba(...))` → `var(--bg-overlay)`.

#### ✅ DS-05 style 인라인 남용
- **해결 완료 (targeted)**: FE-05 처리 과정에서 hover 관련 인라인 style → Tailwind hover: 유틸리티 전환. 나머지 base-state inline style은 CSS 변수 직접 참조로 유지 (정상 패턴).

---

## 🔍 SEO Specialist

### 🔴 Critical

#### ✅ SEO-01 bookFormat이 schema.org 규격 미준수
- **해결 완료**: `src/lib/jsonld.ts` — `FORMAT_MAP`에 schema.org 전체 URL 사용.

#### ✅ SEO-02 Breadcrumb JSON-LD에 SITE_URL 하드코딩
- **해결 완료**: `src/app/books/[slug]/page.tsx` — `SITE_URL` 상수 import 사용.

---

### 🟡 Warning

#### ✅ SEO-03 sitemap lastModified가 항상 현재 시각
- **해결 완료**: `sitemap.ts` — ISR(`revalidate: 86400`) + Sanity `_updatedAt` 사용. 책 CRUD 시 `revalidatePath("/sitemap.xml")` 호출.

#### ✅ SEO-04 루트 레이아웃에 OG 이미지 및 Twitter Card 기본값 없음
- **해결 완료**: `src/app/opengraph-image.tsx` 생성 (Next.js ImageResponse, edge runtime). `layout.tsx`에 `twitter: { card: "summary_large_image" }` 추가.

#### ✅ SEO-05 docs URL 미동기화
- **해결 완료**: `docs/04-seo-strategy.md` — URL 일괄 교체 (`l.324.ing`).

---

## ⚡ Performance Engineer

### 🔴 Critical

#### ✅ PERF-01 클라이언트 번들에 전체 books 데이터 포함
- **해결 완료**: FE-01과 함께 해결 — 서버에서 props로 전달.

#### ✅ PERF-02 HomeClient 전체가 클라이언트 컴포넌트
- **해결 완료**: `HomeInteractive.tsx` (client: Header + SearchModal + search state) 분리. `HomeClient.tsx` → 서버 컴포넌트 전환.

---

### 🟡 Warning

#### ✅ PERF-03 next.config.ts 이미지 최적화 설정 미적용
- **해결 완료**: `next.config.ts` — `formats`, `deviceSizes`, `imageSizes`, `minimumCacheTTL` 추가.

#### ✅ PERF-04 책 상세 페이지 순차 await 4회
- **해결 완료**: `Promise.all([getRelatedBooks, getBookNavigation, getCategoryBySlug, getAllBooks])` 병렬 처리 중 (이미 적용됨).

#### ✅ PERF-05 Cloudflare R2 remotePatterns 미설정
- **해결 완료**: `next.config.ts` — R2 hostname 추가.

---

## 우선순위 요약

| 순위 | 이슈 ID | 상태 | 담당 |
|------|---------|------|------|
| 1 | FE-01 + PERF-01 | ✅ 완료 | FE / Perf |
| 2 | FE-02 | ✅ 완료 | FE |
| 3 | SEO-01 | ✅ 완료 | SEO |
| 4 | SEO-02 | ✅ 완료 | SEO |
| 5 | DS-01 | ✅ 완료 | DS |
| 6 | DS-02 | ✅ 완료 | DS |
| 7 | DS-03 | ✅ 완료 | DS |
| 8 | PERF-04 | ✅ 완료 | Perf |
| 9 | PERF-03 | ✅ 완료 | Perf |
| 10 | SEO-03 | ✅ 완료 | SEO |
| 11 | PERF-02 | ✅ 완료 | Perf |
| 12 | FE-03 | ✅ 완료 | FE |
| 13 | FE-04 | ✅ 완료 | FE |
| 14 | FE-05 | ✅ 완료 | FE |
| 15 | FE-06 | ✅ 완료 | FE |
| 16 | FE-07 | ✅ 완료 | FE |
| 17 | DS-04 | ✅ 완료 | DS |
| 18 | DS-05 | ✅ 완료 | DS |
| 19 | SEO-04 | ✅ 완료 | SEO |
| 20 | SEO-05 | ✅ 완료 | SEO |
| 21 | PERF-05 | ✅ 완료 | Perf |
