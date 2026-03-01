import { client } from "@/sanity/client";
import type { QueryParams } from "next-sanity";
import {
  allBooksQuery,
  featuredBooksQuery,
  recentBooksQuery,
  bookBySlugQuery,
  booksByCategoryQuery,
  booksByTagQuery,
  allCategoriesQuery,
  categoryBySlugQuery,
  allTagsQuery,
  relatedBooksQuery,
  bookNavigationQuery,
  allBookSlugsQuery,
} from "@/sanity/queries";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanityFetch<T>(query: string, params?: Record<string, any>): Promise<T> {
  return client.fetch<T>(query, params as QueryParams);
}
import type { PhotoBook, Category } from "@/types";

// 정적 데이터 폴백
import { books as staticBooks } from "@/data/books";
import { categories as staticCategories } from "@/data/categories";

// Sanity 연결 여부 확인 — 데이터가 없으면 정적 폴백 사용
let useSanity: boolean | null = null;

async function checkSanity(): Promise<boolean> {
  if (useSanity !== null) return useSanity;
  try {
    const count = await sanityFetch<number>(`count(*[_type == "book"])`);
    useSanity = count > 0;
  } catch {
    useSanity = false;
  }
  return useSanity;
}

export async function getAllBooks(): Promise<PhotoBook[]> {
  if (await checkSanity()) {
    return sanityFetch<PhotoBook[]>(allBooksQuery);
  }
  return staticBooks;
}

export async function getFeaturedBooks(): Promise<PhotoBook[]> {
  if (await checkSanity()) {
    return sanityFetch<PhotoBook[]>(featuredBooksQuery);
  }
  return staticBooks.filter((b) => b.featured);
}

export async function getRecentBooks(count: number = 6): Promise<PhotoBook[]> {
  if (await checkSanity()) {
    return sanityFetch<PhotoBook[]>(recentBooksQuery, { limit: count });
  }
  return [...staticBooks].sort((a, b) => b.year - a.year).slice(0, count);
}

export async function getBookBySlug(
  slug: string
): Promise<PhotoBook | undefined> {
  if (await checkSanity()) {
    const book = await sanityFetch<PhotoBook | null>(bookBySlugQuery, { slug });
    return book || undefined;
  }
  return staticBooks.find((b) => b.slug === slug);
}

export async function getBooksByCategory(
  categorySlug: string
): Promise<PhotoBook[]> {
  if (await checkSanity()) {
    return sanityFetch<PhotoBook[]>(booksByCategoryQuery, { category: categorySlug });
  }
  return staticBooks.filter((b) => b.category === categorySlug);
}

export async function getBooksByTag(tag: string): Promise<PhotoBook[]> {
  if (await checkSanity()) {
    return sanityFetch<PhotoBook[]>(booksByTagQuery, { tag });
  }
  return staticBooks.filter((b) => b.tags.includes(tag));
}

export async function getRelatedBooks(
  currentSlug: string,
  count: number = 4
): Promise<PhotoBook[]> {
  if (await checkSanity()) {
    const current = await getBookBySlug(currentSlug);
    if (!current) return [];
    return sanityFetch<PhotoBook[]>(relatedBooksQuery, {
      category: current.category,
      slug: currentSlug,
    });
  }
  const current = staticBooks.find((b) => b.slug === currentSlug);
  if (!current) return [];
  return staticBooks
    .filter((b) => b.slug !== currentSlug)
    .map((b) => ({
      book: b,
      score:
        (b.category === current.category ? 3 : 0) +
        b.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ book }) => book);
}

export async function getAllCategories(): Promise<Category[]> {
  if (await checkSanity()) {
    return sanityFetch<Category[]>(allCategoriesQuery);
  }
  return staticCategories
    .map((cat) => ({
      ...cat,
      bookCount: staticBooks.filter((b) => b.category === cat.slug).length,
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  if (await checkSanity()) {
    const cat = await sanityFetch<Category | null>(categoryBySlugQuery, { slug });
    return cat || undefined;
  }
  const cat = staticCategories.find((c) => c.slug === slug);
  if (!cat) return undefined;
  return {
    ...cat,
    bookCount: staticBooks.filter((b) => b.category === cat.slug).length,
  };
}

export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  if (await checkSanity()) {
    const tags = await sanityFetch<string[]>(allTagsQuery);
    const tagMap = new Map<string, number>();
    tags.forEach((tag) => tagMap.set(tag, (tagMap.get(tag) || 0) + 1));
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }
  const tagMap = new Map<string, number>();
  staticBooks.forEach((b) =>
    b.tags.forEach((t) => tagMap.set(t, (tagMap.get(t) || 0) + 1))
  );
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getBookNavigation(slug: string) {
  if (await checkSanity()) {
    const book = await getBookBySlug(slug);
    if (!book) return { prev: null, next: null };
    return sanityFetch<{ prev: { slug: string; title: string } | null; next: { slug: string; title: string } | null }>(bookNavigationQuery, { year: book.year });
  }
  const index = staticBooks.findIndex((b) => b.slug === slug);
  const prev = index > 0 ? staticBooks[index - 1] : null;
  const next = index < staticBooks.length - 1 ? staticBooks[index + 1] : null;
  return {
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  };
}

export async function getAllBookSlugs(): Promise<string[]> {
  if (await checkSanity()) {
    return sanityFetch<string[]>(allBookSlugsQuery);
  }
  return staticBooks.map((b) => b.slug);
}
