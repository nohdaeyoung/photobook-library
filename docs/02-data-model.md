# 02. 데이터 모델

## 개요

현재 Phase 1에서는 `src/data/` 디렉토리의 정적 TypeScript 파일로 데이터를 관리합니다.
Phase 2에서 Sanity CMS로 마이그레이션할 예정이며, 아래 모델이 Sanity 스키마의 기준이 됩니다.

---

## 엔티티 정의

### PhotoBook (사진책)

`src/types/index.ts` 및 `src/data/books.ts` 참조

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `id` | `string` | 필수 | 고유 식별자 |
| `slug` | `string` | 필수 | URL 경로 식별자 (예: `the-americans`) |
| `title` | `string` | 필수 | 책 제목 (한국어 또는 원제) |
| `titleEn` | `string` | 선택 | 영문 제목 (검색 인덱싱용) |
| `author` | `string` | 필수 | 저자/사진가 이름 |
| `year` | `number` | 필수 | 출판 연도 (4자리 정수) |
| `pages` | `number` | 필수 | 총 페이지 수 |
| `category` | `string` | 필수 | 카테고리 슬러그 (Category.slug 참조) |
| `tags` | `string[]` | 필수 | 태그 배열 (최소 1개 권장) |
| `description` | `string` | 필수 | 책 소개 본문 (150~400자 권장) |
| `coverImage` | `ImageAsset` | 필수 | 표지 이미지 (별도 타입 참조) |
| `images` | `ImageAsset[]` | 필수 | 내지 이미지 배열 (라이트박스용) |
| `featured` | `boolean` | 선택 | 추천 여부 (홈 화면 노출) |
| `publisher` | `string` | 선택 | 출판사명 |
| `isbn` | `string` | 선택 | ISBN 번호 |
| `language` | `string` | 선택 | 원서 언어 코드 (`ko`, `en`, `ja` 등) |
| `format` | `string` | 선택 | 판형 (`hardcover`, `softcover`, `spiral`, `box-set`) |

#### ImageAsset (이미지 자산)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `src` | `string` | 필수 | 이미지 경로 또는 URL |
| `width` | `number` | 필수 | 원본 이미지 너비 (px) |
| `height` | `number` | 필수 | 원본 이미지 높이 (px) |
| `alt` | `string` | 필수 | 대체 텍스트 (접근성 및 SEO) |
| `blurDataURL` | `string` | 선택 | Base64 블러 플레이스홀더 (Next.js Image 최적화) |

---

### Category (카테고리)

`src/data/categories.ts` 참조 — 10개 카테고리 고정

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `slug` | `string` | 필수 | URL 경로 식별자 |
| `name` | `string` | 필수 | 카테고리명 (한국어) |
| `nameEn` | `string` | 선택 | 카테고리명 (영어) |
| `description` | `string` | 선택 | 카테고리 설명 |
| `coverImage` | `ImageAsset` | 선택 | 카테고리 대표 이미지 |
| `color` | `string` | 필수 | 대표 색상 (HEX, 배지/UI 표시용) |
| `order` | `number` | 필수 | 정렬 순서 (낮을수록 먼저 표시) |
| `bookCount` | `number` | 선택 | 소속 책 수 (집계값) |

#### 카테고리 목록

| 슬러그 | 이름 | 영문명 | 색상 | 순서 |
|--------|------|--------|------|------|
| `documentary` | 다큐멘터리 | Documentary | `#E53E3E` | 1 |
| `portrait` | 인물/초상 | Portrait | `#DD6B20` | 2 |
| `landscape` | 풍경/자연 | Landscape | `#38A169` | 3 |
| `street` | 스트리트 | Street | `#3182CE` | 4 |
| `fine-art` | 파인아트 | Fine Art | `#805AD5` | 5 |
| `korean-photography` | 한국 사진 | Korean Photography | `#E0C080` | 6 |
| `fashion` | 패션/광고 | Fashion & Commercial | `#ED64A6` | 7 |
| `independent` | 독립/아티스트북 | Independent & Artist Book | `#4FD1C5` | 8 |
| `exhibition` | 전시 도록 | Exhibition Catalog | `#9F7AEA` | 9 |
| `archive` | 역사/아카이브 | History & Archive | `#718096` | 10 |

---

### Tag (태그)

태그는 별도 컬렉션으로 정의하기보다 `books.ts`의 태그 문자열 배열에서 동적으로 수집합니다.

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `slug` | `string` | 필수 | URL 안전 식별자 (한글 허용) |
| `name` | `string` | 필수 | 표시 이름 |
| `bookCount` | `number` | 선택 | 해당 태그가 붙은 책 수 (집계값) |

---

### SearchState (검색 상태)

검색 페이지 및 필터 사이드바의 상태 인터페이스

| 필드명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `query` | `string` | `""` | 검색 키워드 |
| `category` | `string` | `undefined` | 선택된 카테고리 슬러그 |
| `tags` | `string[]` | `undefined` | 선택된 태그 배열 |
| `yearFrom` | `number` | `undefined` | 출판 연도 필터 시작 |
| `yearTo` | `number` | `undefined` | 출판 연도 필터 끝 |
| `sortBy` | `string` | `"relevance"` | 정렬 기준 (`relevance`, `newest`, `oldest`, `title`) |

---

## 페이지별 데이터 요구사항

| 페이지 | 경로 | 필요 데이터 | 데이터 소스 함수 |
|--------|------|-------------|-----------------|
| 홈 | `/` | 추천책 목록, 최신책 6권, 전체 카테고리 | `getFeaturedBooks()`, `getRecentBooks(6)`, `getAllCategories()` |
| 컬렉션 | `/books` | 전체 책 목록, 전체 카테고리, 전체 태그 | `getAllBooks()`, `getAllCategories()`, `getAllTags()` |
| 책 상세 | `/books/[slug]` | 단일 책, 연관책, 이전/다음 책, 카테고리 이름 | `getBookBySlug()`, `getRelatedBooks()`, `getBookNavigation()`, `getCategoryBySlug()` |
| 소개 | `/about` | 없음 (정적 콘텐츠) | — |
| 검색 | `/search` | 전체 책 목록 (클라이언트 사이드 필터) | `getAllBooks()` |

---

## 데이터 흐름

```
src/data/books.ts          (정적 원본 데이터)
       |
       v
src/lib/books.ts           (조회/필터/정렬 함수)
       |
       v
app/*/page.tsx             (서버 컴포넌트: 데이터 페치)
       |
       v
components/*/Client.tsx    (클라이언트 컴포넌트: 인터랙션)
```

### Phase 2 이후 데이터 흐름 (Sanity 연동)

```
Sanity Studio (CMS)
       |
       v
Sanity GROQ API
       |
       v
next-sanity (클라이언트)
       |
       v
app/*/page.tsx (ISR 또는 SSR)
```

---

## Fuse.js 검색 가중치

`src/lib/search/fuseConfig.ts` 기준

| 검색 필드 | 가중치 | 설명 |
|-----------|--------|------|
| `title` | 0.40 | 한국어/원제 제목 (최우선) |
| `author` | 0.25 | 저자명 |
| `titleEn` | 0.15 | 영문 제목 |
| `tags` | 0.12 | 태그 |
| `category` | 0.05 | 카테고리 슬러그 |
| `description` | 0.03 | 설명 본문 |

검색 임계값(`threshold`): `0.3` — 0에 가까울수록 정확 일치, 1에 가까울수록 느슨한 매칭
