import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllBooks,
  getBookBySlug,
  getRelatedBooks,
  getBookNavigation,
  getCategoryBySlug,
} from "@/lib/books";
import { BookDetailClient } from "@/components/books/BookDetailClient";

// ─── 정적 경로 생성 ───────────────────────────────────────────────────────────

export function generateStaticParams() {
  const books = getAllBooks();
  return books.map((book) => ({ slug: book.slug }));
}

// ─── 메타데이터 ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    return { title: "책을 찾을 수 없습니다" };
  }

  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      images: book.coverImage
        ? [
            {
              url: book.coverImage.src,
              width: book.coverImage.width,
              height: book.coverImage.height,
              alt: book.coverImage.alt,
            },
          ]
        : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.description,
      images: book.coverImage ? [book.coverImage.src] : [],
    },
  };
}

// ─── 페이지 컴포넌트 (서버) ────────────────────────────────────────────────────

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const book = getBookBySlug(slug);
  if (!book) notFound();

  const relatedBooks = getRelatedBooks(slug);
  const navigation = getBookNavigation(slug);
  const category = getCategoryBySlug(book.category);
  const categoryName = category?.name ?? book.category;

  return (
    <BookDetailClient
      book={book}
      relatedBooks={relatedBooks}
      navigation={navigation}
      categoryName={categoryName}
    />
  );
}
