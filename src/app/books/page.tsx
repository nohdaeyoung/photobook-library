import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllBooks, getAllCategories, getAllTags } from "@/lib/books";
import BooksClient from "@/components/books/BooksClient";

export const metadata: Metadata = {
  title: "컬렉션",
  description: "사진책 전체 목록",
};

export default async function BooksPage() {
  const books = await getAllBooks();
  const categories = await getAllCategories();
  const tags = await getAllTags();

  return (
    <Suspense>
      <BooksClient
        initialBooks={books}
        categories={categories}
        tags={tags}
      />
    </Suspense>
  );
}
