import type { Metadata } from "next";
import { getAdminBooks, getCategories } from "./actions";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [books, categories] = await Promise.all([
    getAdminBooks(),
    getCategories(),
  ]);

  return <AdminClient initialBooks={books} categories={categories} />;
}
