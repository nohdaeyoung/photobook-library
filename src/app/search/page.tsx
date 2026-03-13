import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllBooks, getAllTags, getRecentBooks } from "@/lib/books";
import SearchPageClient from "@/components/search/SearchPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const allBooks = await getAllBooks();
  const description = `${allBooks.length}권의 사진책을 제목, 작가, 태그로 검색하세요.`;
  return {
    title: "검색",
    description,
    openGraph: {
      title: "검색 — Photobook & ArtBook Library",
      description,
    },
    alternates: { canonical: "/search" },
  };
}

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
