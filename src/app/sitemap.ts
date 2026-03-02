import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { SITE_URL } from "@/lib/jsonld";

// 콘텐츠 변경 시 revalidatePath("/sitemap.xml")로 즉시 갱신,
// 24시간마다 자동 재생성 (안전망)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // slug와 최종 수정일만 가져오는 경량 쿼리
  const books = await client.fetch<{ slug: string; updatedAt: string }[]>(
    `*[_type == "book"] | order(year desc) { "slug": slug.current, "updatedAt": _updatedAt }`
  );

  const latestUpdate =
    books.length > 0
      ? new Date(books.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b)).updatedAt)
      : new Date();

  const bookEntries: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${SITE_URL}/books/${book.slug}`,
    lastModified: new Date(book.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: latestUpdate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/books`,
      lastModified: latestUpdate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...bookEntries,
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
