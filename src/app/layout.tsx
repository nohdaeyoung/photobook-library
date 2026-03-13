import type { Metadata } from "next";
import { Nanum_Myeongjo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { client } from "@/sanity/client";
import { parseHeadCode } from "@/lib/tracking";

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

const pretendard = localFont({
  src: [
    {
      path: "../styles/fonts/PretendardVariable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://l.324.ing"),
  title: {
    default: "Photobook & ArtBook Library — 사진책 라이브러리",
    template: "%s — Photobook & ArtBook Library",
  },
  description:
    "개인 소장 사진책 컬렉션을 온라인으로 감상하세요. 다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르의 사진책을 탐색할 수 있습니다.",
  keywords: ["사진책", "포토북", "사진집", "photobook", "photography", "photo library"],
  openGraph: {
    type: "website",
    url: "https://l.324.ing",
    locale: "ko_KR",
    siteName: "Photobook & ArtBook Library",
  },
  twitter: {
    card: "summary_large_image",
  },
};

async function getTrackingSettings() {
  try {
    return await client.fetch<{ headCode?: string; bodyCode?: string } | null>(
      `*[_type == "siteSettings"][0] { headCode, bodyCode }`,
      {},
      { next: { revalidate: 3600 } }
    );
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getTrackingSettings();
  const { metaTags, inlineScripts } = parseHeadCode(settings?.headCode);

  return (
    <html lang="ko" data-theme="dark">
      <head>
        {metaTags.map((attrs, i) => (
          <meta key={i} {...attrs} />
        ))}
        {inlineScripts.map((content, i) => (
          // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
          <script key={i} dangerouslySetInnerHTML={{ __html: content }} />
        ))}
      </head>
      <body
        className={`${nanumMyeongjo.variable} ${pretendard.variable} antialiased`}
      >
        {settings?.bodyCode && (
          <div dangerouslySetInnerHTML={{ __html: settings.bodyCode }} />
        )}
        {children}
      </body>
    </html>
  );
}
