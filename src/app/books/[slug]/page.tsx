import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllBookSlugs,
  getAllBooks,
  getBookBySlug,
  getRelatedBooks,
  getBookNavigation,
  getCategoryBySlug,
} from "@/lib/books";
import { generateBookJsonLd, generateBreadcrumbJsonLd, SITE_URL } from "@/lib/jsonld";
import { BookDetailClient } from "@/components/books/BookDetailClient";

// ─── 정적 경로 생성 ───────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllBookSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── 메타데이터 ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

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
    alternates: {
      canonical: `/books/${slug}`,
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

  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const [relatedBooks, navigation, category, allBooks] = await Promise.all([
    getRelatedBooks(slug),
    getBookNavigation(slug),
    getCategoryBySlug(book.category),
    getAllBooks(),
  ]);
  const categoryName = category?.name ?? book.category;

  const bookJsonLd = generateBookJsonLd(book, categoryName);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "홈", url: SITE_URL },
    { name: "컬렉션", url: `${SITE_URL}/books` },
    { name: book.title, url: `${SITE_URL}/books/${book.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BookDetailClient
        book={book}
        relatedBooks={relatedBooks}
        navigation={navigation}
        categoryName={categoryName}
        allBooks={allBooks}
      />
    </>
  );
}
