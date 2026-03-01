import { type ClassValue, clsx } from "clsx";

// Tailwind CSS 클래스 병합 유틸
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatYear(year: number): string {
  return `${year}년`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
