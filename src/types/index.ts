// 사진책 라이브러리 타입 정의

export interface ImageAsset {
  src: string;
  blurDataURL?: string;
  width: number;
  height: number;
  alt: string;
}

export interface PhotoBook {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  author: string;
  year: number;
  pages: number;
  category: string;
  tags: string[];
  description: string;
  coverImage: ImageAsset;
  images: ImageAsset[];
  featured?: boolean;
  publisher?: string;
  isbn?: string;
  language?: string;
  format?: "hardcover" | "softcover" | "spiral" | "box-set";
}

export interface Category {
  slug: string;
  name: string;
  nameEn?: string;
  description?: string;
  coverImage?: ImageAsset;
  color: string;
  order: number;
  bookCount?: number;
}

export interface Tag {
  slug: string;
  name: string;
  bookCount?: number;
}

export interface SearchState {
  query: string;
  category?: string;
  tags?: string[];
  yearFrom?: number;
  yearTo?: number;
  sortBy: "relevance" | "newest" | "oldest" | "title";
}
