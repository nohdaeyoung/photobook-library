import type { Metadata } from "next";
import { getAdminBooks, getCategories, getSiteSettings } from "./actions";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [books, categories, settings] = await Promise.all([
    getAdminBooks(),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <AdminClient
      initialBooks={books}
      categories={categories}
      initialSettings={settings}
    />
  );
}
