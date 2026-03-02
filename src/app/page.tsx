import type { Metadata } from "next";
import { getFeaturedBooks, getRecentBooks, getAllCategories } from "@/lib/books";
import { generateWebSiteJsonLd } from "@/lib/jsonld";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const featuredBooks = await getFeaturedBooks();
  const recentBooks = await getRecentBooks(4);
  const categories = await getAllCategories();

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
      />
    </>
  );
}
