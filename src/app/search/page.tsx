import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllBooks, getAllTags, getRecentBooks } from "@/lib/books";
import SearchPageClient from "@/components/search/SearchPageClient";

export const metadata: Metadata = {
  title: "검색",
  description:
    "사진책 라이브러리에서 책 제목, 작가, 태그로 원하는 사진책을 검색하세요.",
  openGraph: {
    title: "검색 — Photobook & ArtBook Library",
    description:
      "사진책 라이브러리에서 책 제목, 작가, 태그로 원하는 사진책을 검색하세요.",
  },
  alternates: {
    canonical: "/search",
  },
};

export default async function SearchPage() {
  const allBooks = await getAllBooks();
  const popularTags = (await getAllTags()).slice(0, 12);
  const recentBooks = await getRecentBooks(8);

  return (
    <Suspense>
      <SearchPageClient
        allBooks={allBooks}
        popularTags={popularTags}
        recentBooks={recentBooks}
      />
    </Suspense>
  );
}
