import type { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: "소개",
  description:
    "사진책 라이브러리에 대한 소개입니다. 수집 철학, 컬렉션 현황, 그리고 다양한 장르 카테고리를 확인해보세요.",
  openGraph: {
    title: "소개 — Photobook & ArtBook Library",
    description:
      "사진책 라이브러리에 대한 소개입니다. 수집 철학, 컬렉션 현황, 그리고 다양한 장르 카테고리를 확인해보세요.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
