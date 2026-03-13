import type { Metadata } from "next";
import { getAllBooks } from "@/lib/books";
import AboutClient from "@/components/about/AboutClient";

export async function generateMetadata(): Promise<Metadata> {
  const allBooks = await getAllBooks();
  const description = `${allBooks.length}권의 사진책 컬렉션 소개. 수집 철학, 컬렉션 현황, 그리고 다양한 장르 카테고리를 확인해보세요.`;
  return {
    title: "소개",
    description,
    openGraph: {
      title: "소개 — Photobook & ArtBook Library",
      description,
    },
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const allBooks = await getAllBooks();
  return <AboutClient allBooks={allBooks} />;
}
