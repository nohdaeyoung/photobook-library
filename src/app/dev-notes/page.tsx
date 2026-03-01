import type { Metadata } from "next";
import DevNotesClient from "./DevNotesClient";

export const metadata: Metadata = {
  title: "개발노트",
  description: "Photobook Library 개발 과정을 일자별로 정리한 노트입니다.",
};

export default function DevNotesPage() {
  return <DevNotesClient />;
}
