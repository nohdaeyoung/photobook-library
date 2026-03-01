import { books } from "@/data/books";
import { categories } from "@/data/categories";
import type { PhotoBook, Category } from "@/types";

export function getAllBooks(): PhotoBook[] {
  return books;
}

export function getFeaturedBooks(): PhotoBook[] {
  return books.filter((book) => book.featured);
}

export function getBookBySlug(slug: string): PhotoBook | undefined {
  return books.find((book) => book.slug === slug);
}

export function getBooksByCategory(categorySlug: string): PhotoBook[] {
  return books.filter((book) => book.category === categorySlug);
}

export function getBooksByTag(tag: string): PhotoBook[] {
  return books.filter((book) => book.tags.includes(tag));
}

export function getRecentBooks(count: number = 6): PhotoBook[] {
  return [...books].sort((a, b) => b.year - a.year).slice(0, count);
}

export function getRelatedBooks(
  currentSlug: string,
  count: number = 4
): PhotoBook[] {
  const current = getBookBySlug(currentSlug);
  if (!current) return [];

  return books
    .filter((book) => book.slug !== currentSlug)
    .map((book) => ({
      book,
      score:
        (book.category === current.category ? 3 : 0) +
        book.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ book }) => book);
}

export function getAllCategories(): Category[] {
  return categories
    .map((cat) => ({
      ...cat,
      bookCount: books.filter((book) => book.category === cat.slug).length,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return undefined;
  return {
    ...cat,
    bookCount: books.filter((book) => book.category === cat.slug).length,
  };
}

export function getAllTags(): { name: string; count: number }[] {
  const tagMap = new Map<string, number>();
  books.forEach((book) => {
    book.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getBookNavigation(slug: string) {
  const index = books.findIndex((b) => b.slug === slug);
  return {
    prev: index > 0 ? books[index - 1] : null,
    next: index < books.length - 1 ? books[index + 1] : null,
  };
}
