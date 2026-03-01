import { createClient } from "next-sanity";

// 서버 전용 — write 권한이 있는 클라이언트
export const adminClient = createClient({
  projectId: "emspj2jw",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
