import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/eodud", "/search?"],
    },
    sitemap: "https://l.324.ing/sitemap.xml",
  };
}
