import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllBooks, getAllCategories, getAllTags } from "@/lib/books";
import { generateCollectionPageJsonLd } from "@/lib/jsonld";
import BooksClient from "@/components/books/BooksClient";

export const metadata: Metadata = {
  title: "컬렉션",
  description:
    "다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르의 사진책 전체 목록을 탐색하세요.",
  openGraph: {
    title: "사진책 컬렉션",
    description:
      "다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르의 사진책 전체 목록을 탐색하세요.",
    type: "website",
  },
  alternates: {
    canonical: "/books",
  },
};

export default async function BooksPage() {
  const books = await getAllBooks();
  const categories = await getAllCategories();
  const tags = await getAllTags();

  const jsonLd = generateCollectionPageJsonLd(books);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <BooksClient
          initialBooks={books}
          categories={categories}
          tags={tags}
        />
      </Suspense>
    </>
  );
}
