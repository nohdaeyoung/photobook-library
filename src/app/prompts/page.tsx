import type { Metadata } from "next";
import PromptsClient from "./PromptsClient";

export const metadata: Metadata = {
  title: "프롬프트",
  description: "Photobook Library 개발에 사용된 주요 프롬프트 목록입니다.",
};

export default function PromptsPage() {
  return <PromptsClient />;
}
