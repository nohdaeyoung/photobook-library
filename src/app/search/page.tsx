import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "@/components/search/SearchPageClient";

export const metadata: Metadata = {
  title: "검색",
  description:
    "사진책 라이브러리에서 책 제목, 작가, 태그로 원하는 사진책을 검색하세요.",
  openGraph: {
    title: "검색 — Photobook Library",
    description:
      "사진책 라이브러리에서 책 제목, 작가, 태그로 원하는 사진책을 검색하세요.",
  },
};

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageClient />
    </Suspense>
  );
}
