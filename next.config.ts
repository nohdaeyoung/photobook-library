import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://platform.twitter.com https://www.instagram.com https://www.tiktok.com https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://*.r2.cloudflarestorage.com https://www.google-analytics.com https://www.googletagmanager.com https://*.kakaocdn.net https://books.google.com https://*.gstatic.com https://covers.openlibrary.org https://seoji.nl.go.kr https://*.pstatic.net",
      "font-src 'self' data: https://fonts.gstatic.com",
      "frame-src https://www.youtube.com https://player.vimeo.com https://www.tiktok.com https://www.instagram.com",
      "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com",
      "media-src 'self' https://cdn.sanity.io",
      "worker-src blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1440],
    imageSizes: [160, 224, 288, 400, 600],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default nextConfig;
