import type { Metadata } from "next";
import { getAllBooks } from "@/lib/books";
import DevNotesClient from "./DevNotesClient";

export const metadata: Metadata = {
  title: "개발노트",
  description: "Photobook & ArtBook Library 개발 과정을 일자별로 정리한 노트입니다.",
};

export default async function DevNotesPage() {
  const allBooks = await getAllBooks();
  return <DevNotesClient allBooks={allBooks} />;
}
