import { getFeaturedBooks, getRecentBooks, getAllCategories } from "@/lib/books";
import HomeClient from "@/components/home/HomeClient";

export default async function HomePage() {
  const featuredBooks = await getFeaturedBooks();
  const recentBooks = await getRecentBooks(6);
  const categories = await getAllCategories();

  return (
    <HomeClient
      featuredBooks={featuredBooks}
      recentBooks={recentBooks}
      categories={categories}
    />
  );
}
