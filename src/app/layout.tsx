import type { Metadata } from "next";
import { Nanum_Myeongjo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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
  title: {
    default: "Photobook Library — 사진책 라이브러리",
    template: "%s — Photobook Library",
  },
  description:
    "개인 소장 사진책 컬렉션을 온라인으로 감상하세요. 다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르의 사진책을 탐색할 수 있습니다.",
  keywords: ["사진책", "포토북", "사진집", "photobook", "photography", "photo library"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Photobook Library",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-theme="dark">
      <body
        className={`${nanumMyeongjo.variable} ${pretendard.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
