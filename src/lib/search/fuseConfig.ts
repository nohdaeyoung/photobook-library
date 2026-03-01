import Fuse, { type IFuseOptions } from "fuse.js";
import type { PhotoBook } from "@/types";

export const fuseOptions: IFuseOptions<PhotoBook> = {
  threshold: 0.3,
  distance: 200,
  minMatchCharLength: 1,
  includeMatches: true,
  includeScore: true,
  keys: [
    { name: "title", weight: 0.4 },
    { name: "titleEn", weight: 0.15 },
    { name: "author", weight: 0.25 },
    { name: "tags", weight: 0.12 },
    { name: "category", weight: 0.05 },
    { name: "description", weight: 0.03 },
  ],
};

let fuseInstance: Fuse<PhotoBook> | null = null;

export function getSearchIndex(books: PhotoBook[]): Fuse<PhotoBook> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(books, fuseOptions);
  }
  return fuseInstance;
}

export function searchBooks(
  books: PhotoBook[],
  query: string
): PhotoBook[] {
  if (!query.trim()) return books;
  const fuse = getSearchIndex(books);
  return fuse.search(query).map((result) => result.item);
}
