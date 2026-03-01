"use server";

import { adminClient } from "@/sanity/admin-client";
import { revalidatePath } from "next/cache";

// 슬러그 생성 유틸
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[가-힣]/g, (match) => match) // 한글 유지
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── 카테고리 목록 조회 ───
export async function getCategories() {
  return adminClient.fetch(
    `*[_type == "category"] | order(order asc) { _id, name, nameEn, "slug": slug.current, color, order }`
  );
}

// ─── 도서 목록 조회 ───
export async function getAdminBooks() {
  return adminClient.fetch(
    `*[_type == "book"] | order(_createdAt desc) {
      _id,
      title,
      titleEn,
      "slug": slug.current,
      author,
      year,
      pages,
      "category": category->name,
      "categorySlug": category->slug.current,
      tags,
      description,
      featured,
      publisher,
      language,
      format,
      "coverImageUrl": coverImage.asset->url
    }`
  );
}

// ─── 도서 상세 조회 ───
export async function getAdminBook(id: string) {
  return adminClient.fetch(
    `*[_type == "book" && _id == $id][0] {
      _id,
      title,
      titleEn,
      "slug": slug.current,
      author,
      year,
      pages,
      "categoryId": category._ref,
      tags,
      description,
      featured,
      publisher,
      language,
      format
    }`,
    { id }
  );
}

// ─── 도서 등록 ───
export async function createBook(formData: FormData) {
  const title = formData.get("title") as string;
  const titleEn = formData.get("titleEn") as string;
  const author = formData.get("author") as string;
  const year = parseInt(formData.get("year") as string);
  const pages = parseInt(formData.get("pages") as string) || undefined;
  const categoryId = formData.get("categoryId") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const description = formData.get("description") as string;
  const featured = formData.get("featured") === "on";
  const publisher = formData.get("publisher") as string;
  const language = formData.get("language") as string;
  const format = formData.get("format") as string;

  const slug = titleEn ? toSlug(titleEn) : toSlug(title);

  const doc = {
    _type: "book" as const,
    title,
    titleEn: titleEn || undefined,
    slug: { _type: "slug" as const, current: slug },
    author,
    year,
    pages,
    category: { _type: "reference" as const, _ref: categoryId },
    tags,
    description: description || undefined,
    featured,
    publisher: publisher || undefined,
    language: language || undefined,
    format: format || undefined,
  };

  await adminClient.create(doc);
  revalidatePath("/admin");
  revalidatePath("/books");
  revalidatePath("/");
  return { success: true };
}

// ─── 도서 수정 ───
export async function updateBook(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const titleEn = formData.get("titleEn") as string;
  const author = formData.get("author") as string;
  const year = parseInt(formData.get("year") as string);
  const pages = parseInt(formData.get("pages") as string) || undefined;
  const categoryId = formData.get("categoryId") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const description = formData.get("description") as string;
  const featured = formData.get("featured") === "on";
  const publisher = formData.get("publisher") as string;
  const language = formData.get("language") as string;
  const format = formData.get("format") as string;

  await adminClient
    .patch(id)
    .set({
      title,
      titleEn: titleEn || undefined,
      author,
      year,
      pages,
      category: { _type: "reference" as const, _ref: categoryId },
      tags,
      description: description || undefined,
      featured,
      publisher: publisher || undefined,
      language: language || undefined,
      format: format || undefined,
    })
    .commit();

  revalidatePath("/admin");
  revalidatePath("/books");
  revalidatePath("/");
  return { success: true };
}

// ─── 도서 삭제 ───
export async function deleteBook(id: string) {
  await adminClient.delete(id);
  revalidatePath("/admin");
  revalidatePath("/books");
  revalidatePath("/");
  return { success: true };
}
