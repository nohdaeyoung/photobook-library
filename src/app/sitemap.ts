import type { MetadataRoute } from "next";
import { getAllBooks } from "@/lib/books";

import { SITE_URL } from "@/lib/jsonld";

const BUILD_DATE = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await getAllBooks();

  const bookEntries: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${SITE_URL}/books/${book.slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/books`,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...bookEntries,
    {
      url: `${SITE_URL}/about`,
      lastModified: BUILD_DATE,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: BUILD_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
