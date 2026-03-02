import type { Metadata } from "next";
import { getAllBooks } from "@/lib/books";
import PromptsClient from "./PromptsClient";

export const metadata: Metadata = {
  title: "프롬프트",
  description: "Photobook & ArtBook Library 개발에 사용된 주요 프롬프트 목록입니다.",
};

export default async function PromptsPage() {
  const allBooks = await getAllBooks();
  return <PromptsClient allBooks={allBooks} />;
}
