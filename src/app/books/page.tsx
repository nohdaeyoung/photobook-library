import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllBooks, getAllCategories, getAllTags } from "@/lib/books";
import BooksClient from "@/components/books/BooksClient";

export const metadata: Metadata = {
  title: "컬렉션",
  description: "사진책 전체 목록",
};

export default function BooksPage() {
  const books = getAllBooks();
  const categories = getAllCategories();
  const tags = getAllTags();

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
