import type { PhotoBook } from "@/types";

export const SITE_URL = "https://l.324.ing";
const SITE_NAME = "Photobook & ArtBook Library";

// ─── WebSite 스키마 (홈페이지) ────────────────────────────────────────────────

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "사진책 라이브러리",
    url: SITE_URL,
    description:
      "개인 소장 사진책 컬렉션을 온라인으로 감상하세요. 다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르의 사진책을 탐색할 수 있습니다.",
    inLanguage: "ko",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Book 스키마 (도서 상세) ──────────────────────────────────────────────────

const FORMAT_MAP: Record<string, string> = {
  hardcover: "https://schema.org/Hardcover",
  softcover: "https://schema.org/Paperback",
  spiral:    "https://schema.org/Paperback",
  "box-set": "https://schema.org/Hardcover",
};

const LANGUAGE_MAP: Record<string, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
};

export function generateBookJsonLd(
  book: PhotoBook,
  categoryName: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    ...(book.titleEn && { alternateName: book.titleEn }),
    url: `${SITE_URL}/books/${book.slug}`,
    author: {
      "@type": "Person",
      name: book.author,
    },
    datePublished: `${book.year}`,
    ...(book.pages && { numberOfPages: book.pages }),
    ...(book.publisher && {
      publisher: {
        "@type": "Organization",
        name: book.publisher,
      },
    }),
    ...(book.isbn && { isbn: book.isbn }),
    bookFormat: FORMAT_MAP[book.format ?? ""] ?? "Hardcover",
    image: book.coverImage?.src,
    genre: categoryName,
    inLanguage: LANGUAGE_MAP[book.language ?? ""] ?? "ko",
    description: book.description,
    ...(book.tags?.length && { keywords: book.tags.join(", ") }),
    about: {
      "@type": "Thing",
      name: categoryName,
      description: `${categoryName} 장르의 사진책`,
    },
  };
}

// ─── CollectionPage 스키마 (컬렉션 목록) ──────────────────────────────────────

export function generateCollectionPageJsonLd(
  books: PhotoBook[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "사진책 컬렉션",
    description:
      "다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르의 사진책을 탐색할 수 있습니다.",
    url: `${SITE_URL}/books`,
    numberOfItems: books.length,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: books.length,
      itemListElement: books.map((book, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/books/${book.slug}`,
        name: book.title,
      })),
    },
  };
}

// ─── BreadcrumbList 스키마 (범용) ─────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
