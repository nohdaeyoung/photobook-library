export interface ISBNBookData {
  title?: string;
  titleEn?: string;
  author?: string;
  year?: number;
  pages?: number;
  publisher?: string;
  description?: string;
  language?: string;
  coverUrl?: string;
}

/** 하이픈 제거 후 10자리 또는 13자리 숫자인지 검증 */
export function validateISBN(raw: string): string | null {
  const cleaned = raw.replace(/[-\s]/g, "");
  if (/^\d{10}$/.test(cleaned) || /^\d{13}$/.test(cleaned)) {
    return cleaned;
  }
  // ISBN-10은 마지막 자리가 X일 수 있음
  if (/^\d{9}X$/i.test(cleaned)) {
    return cleaned.toUpperCase();
  }
  return null;
}

function mapLanguageCode(lang: string | undefined): string {
  if (!lang) return "";
  const code = lang.toLowerCase().slice(0, 2);
  const map: Record<string, string> = { ko: "ko", en: "en", ja: "ja" };
  return map[code] || "other";
}

async function fetchFromGoogleBooks(isbn: string): Promise<ISBNBookData | null> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.items || data.items.length === 0) return null;

  const info = data.items[0].volumeInfo;
  if (!info) return null;

  const publishedDate = info.publishedDate || "";
  const yearMatch = publishedDate.match(/(\d{4})/);

  const result: ISBNBookData = {
    title: info.title,
    author: Array.isArray(info.authors) ? info.authors.join(", ") : info.authors,
    year: yearMatch ? parseInt(yearMatch[1]) : undefined,
    pages: info.pageCount || undefined,
    publisher: info.publisher,
    description: info.description,
    language: mapLanguageCode(info.language),
  };

  // 표지 이미지 URL (HTTPS로 변환)
  const imageLinks = info.imageLinks;
  if (imageLinks) {
    const coverUrl = imageLinks.thumbnail || imageLinks.smallThumbnail;
    if (coverUrl) {
      result.coverUrl = coverUrl.replace(/^http:/, "https:");
    }
  }

  return result;
}

async function fetchFromOpenLibrary(isbn: string): Promise<ISBNBookData | null> {
  const url = `https://openlibrary.org/isbn/${isbn}.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = await res.json();

  const publishDate = data.publish_date || "";
  const yearMatch = publishDate.match(/(\d{4})/);

  const result: ISBNBookData = {
    title: data.title,
    year: yearMatch ? parseInt(yearMatch[1]) : undefined,
    pages: data.number_of_pages || undefined,
    publisher: Array.isArray(data.publishers) ? data.publishers[0] : undefined,
  };

  // 저자 정보는 별도 API 호출 필요
  if (Array.isArray(data.authors) && data.authors.length > 0) {
    try {
      const authorKeys = data.authors.map((a: { key: string }) => a.key);
      const authorNames = await Promise.all(
        authorKeys.slice(0, 3).map(async (key: string) => {
          const authorRes = await fetch(`https://openlibrary.org${key}.json`, {
            cache: "no-store",
          });
          if (!authorRes.ok) return null;
          const authorData = await authorRes.json();
          return authorData.name as string;
        })
      );
      const validNames = authorNames.filter(Boolean);
      if (validNames.length > 0) {
        result.author = validNames.join(", ");
      }
    } catch {
      // 저자 조회 실패 시 무시
    }
  }

  // 표지 이미지
  if (data.covers && data.covers.length > 0) {
    result.coverUrl = `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`;
  }

  // 언어
  if (Array.isArray(data.languages) && data.languages.length > 0) {
    const langKey = data.languages[0].key; // e.g. "/languages/eng"
    const langCode = langKey?.split("/").pop() || "";
    const langMap: Record<string, string> = { eng: "en", kor: "ko", jpn: "ja" };
    result.language = langMap[langCode] || "other";
  }

  return result;
}

/** Google Books → Open Library 순서로 ISBN 조회 */
export async function fetchBookByISBN(rawISBN: string): Promise<ISBNBookData | null> {
  const isbn = validateISBN(rawISBN);
  if (!isbn) return null;

  // 1차: Google Books API
  try {
    const result = await fetchFromGoogleBooks(isbn);
    if (result && result.title) return result;
  } catch {
    // Google Books 실패 시 Open Library로 fallback
  }

  // 2차: Open Library API
  try {
    const result = await fetchFromOpenLibrary(isbn);
    if (result && result.title) return result;
  } catch {
    // Open Library도 실패
  }

  return null;
}
