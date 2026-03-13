import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllBooks, getAllCategories, getAllTags } from "@/lib/books";
import { generateCollectionPageJsonLd } from "@/lib/jsonld";
import BooksClient from "@/components/books/BooksClient";

export async function generateMetadata(): Promise<Metadata> {
  const [books, categories] = await Promise.all([
    getAllBooks(),
    getAllCategories(),
  ]);
  const bookCount = books.length;
  const categoryCount = categories.length;
  const description = `총 ${bookCount}권의 사진책을 ${categoryCount}개 카테고리로 탐색하세요. 다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르.`;
  return {
    title: "컬렉션",
    description,
    openGraph: {
      title: `사진책 컬렉션 — ${bookCount}권`,
      description,
      type: "website",
    },
    alternates: {
      canonical: "/books",
    },
  };
}

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
