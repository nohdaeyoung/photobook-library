# 04. SEO 전략

## 개요

사진책 라이브러리는 Next.js App Router의 `Metadata API`를 활용하여 페이지별 메타 태그를 정적으로
생성합니다. 책 상세 페이지는 `generateStaticParams` + `generateMetadata`를 조합해 빌드 타임에
완전한 메타데이터를 생성하며, 구조화 데이터(JSON-LD)로 검색 엔진에 풍부한 컨텍스트를 제공합니다.

---

## 페이지별 메타 태그 명세

### 공통 (루트 레이아웃)

`src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: {
    default: "Photobook Library — 사진책 라이브러리",
    template: "%s — Photobook Library",  // 하위 페이지: "{페이지 제목} — Photobook Library"
  },
  description: "개인 소장 사진책 컬렉션을 온라인으로 감상하세요. 다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르의 사진책을 탐색할 수 있습니다.",
  keywords: ["사진책", "포토북", "사진집", "photobook", "photography", "photo library"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Photobook Library",
  },
};
```

---

### 페이지별 메타 태그 표

| 페이지 | title | description | OG type | 비고 |
|--------|-------|-------------|---------|------|
| 홈 (`/`) | Photobook Library — 사진책 라이브러리 | (루트 기본값) | `website` | 루트 기본 메타데이터 사용 |
| 컬렉션 (`/books`) | 컬렉션 — Photobook Library | 사진책 전체 목록 | `website` | 정적 메타데이터 |
| 책 상세 (`/books/[slug]`) | {book.title} — Photobook Library | {book.description} | `article` | `generateMetadata()` 동적 생성 |
| 소개 (`/about`) | 소개 — Photobook Library | (페이지 자체 설명) | `website` | 정적 메타데이터 |
| 검색 (`/search`) | 검색 — Photobook Library | (페이지 자체 설명) | `website` | 정적 메타데이터 |
| 404 | 페이지를 찾을 수 없습니다 — Photobook Library | — | — | `not-found.tsx` |

---

### 책 상세 페이지 동적 메타데이터

`src/app/books/[slug]/page.tsx`

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const book = getBookBySlug(slug);

  return {
    title: book.title,                    // → "{제목} — Photobook Library"
    description: book.description,

    openGraph: {
      title: book.title,
      description: book.description,
      type: "article",
      images: [{
        url: book.coverImage.src,
        width: book.coverImage.width,
        height: book.coverImage.height,
        alt: book.coverImage.alt,
      }],
    },

    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.description,
      images: [book.coverImage.src],
    },
  };
}
```

**OG 이미지 권장 규격:**

| 항목 | 권장값 |
|------|--------|
| 크기 | 1200 × 630px |
| 형식 | JPEG 또는 WebP |
| 용량 | 1MB 이하 |
| alt 텍스트 | 책 제목 + 저자 포함 |

---

## 구조화 데이터 (JSON-LD)

### WebSite (홈 페이지)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "사진책 라이브러리",
  "url": "https://photobook-library.vercel.app",
  "description": "개인 소장 사진책 컬렉션 온라인 전시",
  "inLanguage": "ko",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://photobook-library.vercel.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### Book (책 상세 페이지)

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "The Americans",
  "author": {
    "@type": "Person",
    "name": "Robert Frank"
  },
  "datePublished": "1958",
  "numberOfPages": 83,
  "publisher": {
    "@type": "Organization",
    "name": "Steidl"
  },
  "isbn": "",
  "inLanguage": "en",
  "bookFormat": "https://schema.org/Hardcover",
  "image": "https://photobook-library.vercel.app/images/books/the-americans-cover.jpg",
  "description": "로버트 프랭크가 1955-1956년 미국 전역을 여행하며 촬영한 83장의 사진으로 구성된 사진집.",
  "genre": "Photography",
  "url": "https://photobook-library.vercel.app/books/the-americans"
}
```

**bookFormat 매핑:**

| PhotoBook.format | schema.org 값 |
|-----------------|---------------|
| `hardcover` | `https://schema.org/Hardcover` |
| `softcover` | `https://schema.org/Paperback` |
| `spiral` | `https://schema.org/Paperback` |
| `box-set` | `https://schema.org/Hardcover` |

### BreadcrumbList (책 상세 페이지)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "홈",
      "item": "https://photobook-library.vercel.app"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "컬렉션",
      "item": "https://photobook-library.vercel.app/books"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "The Americans",
      "item": "https://photobook-library.vercel.app/books/the-americans"
    }
  ]
}
```

### CollectionPage (컬렉션 목록)

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "사진책 컬렉션",
  "url": "https://photobook-library.vercel.app/books",
  "description": "사진책 전체 컬렉션 목록",
  "hasPart": [
    { "@type": "Book", "name": "The Americans", "url": "..." }
  ]
}
```

---

## robots.txt 설정

`public/robots.txt` 에 배치합니다.

```txt
User-agent: *
Allow: /

# 검색 결과 페이지 (쿼리 파라미터 포함) 크롤링 제한
Disallow: /search?*

# 관리 페이지 (Phase 2 이후 Sanity Studio)
Disallow: /studio

# Sitemap 위치
Sitemap: https://photobook-library.vercel.app/sitemap.xml
```

**크롤링 정책 근거:**

| 경로 | 정책 | 이유 |
|------|------|------|
| `/` | Allow | 홈 페이지 인덱싱 필요 |
| `/books` | Allow | 컬렉션 목록 인덱싱 필요 |
| `/books/[slug]` | Allow | 개별 책 페이지 인덱싱 핵심 |
| `/about` | Allow | 사이트 소개 인덱싱 |
| `/search?*` | Disallow | 파라미터별 중복 인덱싱 방지 |
| `/studio` | Disallow | CMS 관리 영역 노출 방지 |

---

## sitemap.xml 전략

Next.js App Router의 `src/app/sitemap.ts` 를 통해 자동 생성합니다.

```typescript
// src/app/sitemap.ts (Phase 2 구현 예정)
import { MetadataRoute } from "next";
import { getAllBooks } from "@/lib/books";

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getAllBooks();
  const baseUrl = "https://photobook-library.vercel.app";

  const bookUrls = books.map((book) => ({
    url: `${baseUrl}/books/${book.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/books`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "yearly", priority: 0.5 },
    ...bookUrls,
  ];
}
```

**페이지별 우선순위:**

| 페이지 | `priority` | `changeFrequency` | 이유 |
|--------|-----------|-------------------|------|
| 홈 | 1.0 | weekly | 가장 중요한 진입점 |
| 컬렉션 | 0.9 | weekly | 신규 책 추가 시 갱신 |
| 책 상세 | 0.8 | monthly | 콘텐츠 안정적, 주기적 갱신 |
| 소개 | 0.5 | yearly | 거의 변경 없음 |

---

## 이미지 SEO

### alt 텍스트 가이드라인

| 이미지 유형 | 작성 형식 | 예시 |
|-------------|-----------|------|
| 책 표지 | `{제목} — {저자}, {주요 시각 요소 묘사}` | `The Americans — Robert Frank, 미국 국기가 걸린 건물 앞 풍경` |
| 내지 사진 | `{제목} 내지 {번호}번째 이미지` | `The Americans 내지 3번째 이미지` |
| 카테고리 대표 | `{카테고리명} 카테고리 대표 이미지` | `다큐멘터리 카테고리 대표 이미지` |
| 장식 이미지 | `aria-hidden="true"` (alt 불필요) | — |

**alt 텍스트 작성 원칙:**
1. 이미지가 전달하는 정보를 텍스트로 대체할 수 있도록 작성
2. "이미지", "사진" 등의 중복 단어 지양 ("의 사진" 대신 콘텐츠 설명)
3. 책 표지는 반드시 제목과 저자를 포함
4. 한국어 책은 한국어 alt, 외국 책은 원제 포함 가능
5. 100자 이내로 간결하게 작성

### 파일명 컨벤션

```
[카테고리]-[저자-성-kebab-case]-[제목-kebab-case]-cover.jpg
```

**예시:**
```
# 표지
documentary-robert-frank-the-americans-cover.jpg
street-daido-moriyama-bye-bye-photography-cover.jpg
korean-photography-choi-min-sik-korean-dream-cover.jpg

# 내지 이미지
documentary-robert-frank-the-americans-01.jpg
documentary-robert-frank-the-americans-02.jpg

# 카테고리 대표
category-documentary.jpg
category-street.jpg
```

**파일명 규칙:**
- 소문자만 사용
- 단어 구분은 하이픈(`-`) 사용
- 공백, 특수문자 금지
- 한글 파일명 금지 (URL 인코딩 문제)
- 번호는 2자리 패딩 (`01`, `02`, ... `10`)

### Next.js Image 최적화 설정

```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],  // 최신 포맷 우선
    deviceSizes: [375, 640, 768, 1024, 1280, 1440],
    imageSizes: [160, 224, 288, 400, 600],
    minimumCacheTTL: 60 * 60 * 24 * 30,    // 30일 캐시
    remotePatterns: [
      { hostname: "cdn.sanity.io" },        // Sanity CDN
      { hostname: "*.r2.cloudflarestorage.com" }, // Cloudflare R2
    ],
  },
};
```

---

## 카테고리 및 태그 분류 체계

### 10개 카테고리 (고정)

카테고리는 사진의 장르/형식을 기준으로 분류하며 고정 목록을 유지합니다.

| 순번 | 슬러그 | 이름 | 분류 기준 |
|------|--------|------|-----------|
| 1 | `documentary` | 다큐멘터리 | 사회적 사건, 역사적 순간, 사실적 기록 |
| 2 | `portrait` | 인물/초상 | 인물의 내면과 외면 탐구, 초상 중심 |
| 3 | `landscape` | 풍경/자연 | 자연, 지형, 도시 풍경 |
| 4 | `street` | 스트리트 | 도시 일상, 거리의 우연한 순간 |
| 5 | `fine-art` | 파인아트 | 예술적 표현, 개념 사진, 실험적 작업 |
| 6 | `korean-photography` | 한국 사진 | 한국 작가 또는 한국을 주제로 한 작품 |
| 7 | `fashion` | 패션/광고 | 패션, 뷰티, 상업 광고 사진 |
| 8 | `independent` | 독립/아티스트북 | 소규모 독립 출판, 실험적 형식 |
| 9 | `exhibition` | 전시 도록 | 미술관·갤러리 전시 연계 공식 출판물 |
| 10 | `archive` | 역사/아카이브 | 사진 역사, 희귀 자료, 아카이브 컬렉션 |

### 태그 5원칙

태그는 카테고리보다 세밀한 분류를 위해 사용하며, 다음 5가지 원칙에 따라 작성합니다.

| 원칙 | 설명 | 예시 태그 |
|------|------|-----------|
| **1. 기법/스타일** | 촬영 기법 또는 시각적 스타일 | `흑백`, `컬러`, `하이콘트라스트`, `블러`, `대형포맷` |
| **2. 지역/배경** | 촬영 지역 또는 배경이 된 장소 | `도쿄`, `뉴욕`, `한국`, `미국`, `미시시피` |
| **3. 주제/소재** | 사진이 다루는 주요 주제나 소재 | `거리`, `자연`, `환경`, `인물`, `지하철` |
| **4. 시대/맥락** | 시대적 배경 또는 역사적 맥락 | `1990년대`, `프로보크`, `클래식` |
| **5. 형태/특성** | 책 자체의 형태적 특성 | `로드트립`, `원시`, `사적기록`, `친밀함` |

**태그 작성 가이드:**
- 1권당 태그 3~7개 권장 (최소 3개, 최대 10개)
- 카테고리 이름을 태그로 중복 사용 지양 (예: 카테고리 `documentary`에 태그 `다큐` 불필요)
- 검색 유입 가능성이 있는 고유 단어 우선 사용
- 한국어 태그 사용 원칙 (검색 쿼리가 주로 한국어)

### URL 구조 및 카노니컬

| 페이지 | URL 패턴 | 카노니컬 |
|--------|----------|----------|
| 홈 | `/` | `https://photobook-library.vercel.app/` |
| 컬렉션 | `/books` | `https://photobook-library.vercel.app/books` |
| 책 상세 | `/books/{slug}` | `https://photobook-library.vercel.app/books/{slug}` |
| 검색 | `/search` | `https://photobook-library.vercel.app/search` |

검색 쿼리 파라미터(`/search?q=robert+frank`)는 카노니컬에서 제외하여 중복 인덱싱을 방지합니다.

---

## 성능 및 Core Web Vitals

SEO 순위에 직접 영향을 미치는 성능 지표 목표값:

| 지표 | 설명 | 목표 |
|------|------|------|
| LCP (Largest Contentful Paint) | 가장 큰 콘텐츠 렌더링 시간 | 2.5초 이하 |
| FID (First Input Delay) | 첫 입력 지연 시간 | 100ms 이하 |
| CLS (Cumulative Layout Shift) | 레이아웃 누적 이동 | 0.1 이하 |

**최적화 전략:**
- 홈 페이지 추천책 표지에 `priority={true}` 로 LCP 이미지 선로딩
- `next/image` 의 `width`, `height` 명시로 CLS 방지
- 폰트에 `display: swap` 적용으로 FOIT 방지
- 정적 생성(SSG)으로 TTFB 최소화
- 스켈레톤 UI로 레이아웃 이동 없이 로딩 상태 표시
