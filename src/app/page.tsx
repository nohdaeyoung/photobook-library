import { getFeaturedBooks, getRecentBooks, getAllCategories } from "@/lib/books";
import HomeClient from "@/components/home/HomeClient";

export default function HomePage() {
  const featuredBooks = getFeaturedBooks();
  const recentBooks = getRecentBooks(6);
  const categories = getAllCategories();

  return (
    <HomeClient
      featuredBooks={featuredBooks}
      recentBooks={recentBooks}
      categories={categories}
    />
  );
}
