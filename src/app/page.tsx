import type { Metadata } from "next";
import { getFeaturedBooks, getRecentBooks, getAllCategories, getAllBooks } from "@/lib/books";
import { generateWebSiteJsonLd } from "@/lib/jsonld";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

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
