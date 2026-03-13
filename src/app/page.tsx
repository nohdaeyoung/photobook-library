import type { Metadata } from "next";
import { getFeaturedBooks, getRecentBooks, getAllCategories, getAllBooks } from "@/lib/books";
import { generateWebSiteJsonLd } from "@/lib/jsonld";
import HomeClient from "@/components/home/HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  const allBooks = await getAllBooks();
  const description = `${allBooks.length}권의 개인 소장 사진책 & 아트북 컬렉션을 온라인으로 감상하세요. 다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르를 탐색할 수 있습니다.`;
  return {
    description,
    openGraph: { description },
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [featuredBooks, recentBooks, categories, allBooks] = await Promise.all([
    getFeaturedBooks(),
    getRecentBooks(4),
    getAllCategories(),
    getAllBooks(),
  ]);

  const jsonLd = generateWebSiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        featuredBooks={featuredBooks}
        recentBooks={recentBooks}
        categories={categories}
        allBooks={allBooks}
      />
    </>
  );
}
