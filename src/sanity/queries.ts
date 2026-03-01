import { groq } from "next-sanity";

// 공통 book 프로젝션
const bookProjection = `{
  "id": _id,
  "slug": slug.current,
  title,
  titleEn,
  author,
  year,
  pages,
  "category": category->slug.current,
  tags,
  description,
  content,
  "coverImage": coverImage {
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    alt
  },
  "images": images[] {
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    alt
  },
  featured,
  publisher,
  isbn,
  coverUrl,
  language,
  format
}`;

// 전체 도서 목록
export const allBooksQuery = groq`*[_type == "book"] | order(year desc) ${bookProjection}`;

// 추천 도서
export const featuredBooksQuery = groq`*[_type == "book" && featured == true] | order(year desc) [0...4] ${bookProjection}`;

// 최근 도서 (limit)
export const recentBooksQuery = groq`*[_type == "book"] | order(_createdAt desc) [0...$limit] ${bookProjection}`;

// 슬러그로 도서 조회
export const bookBySlugQuery = groq`*[_type == "book" && slug.current == $slug][0] ${bookProjection}`;

// 카테고리별 도서
export const booksByCategoryQuery = groq`*[_type == "book" && category->slug.current == $category] | order(year desc) ${bookProjection}`;

// 태그별 도서
export const booksByTagQuery = groq`*[_type == "book" && $tag in tags] | order(year desc) ${bookProjection}`;

// 전체 카테고리
export const allCategoriesQuery = groq`*[_type == "category"] | order(order asc) {
  "slug": slug.current,
  name,
  nameEn,
  description,
  color,
  order,
  "bookCount": count(*[_type == "book" && references(^._id)])
}`;

// 슬러그로 카테고리 조회
export const categoryBySlugQuery = groq`*[_type == "category" && slug.current == $slug][0] {
  "slug": slug.current,
  name,
  nameEn,
  description,
  color,
  order
}`;

// 모든 태그 (집계)
export const allTagsQuery = groq`*[_type == "book"].tags[]`;

// 관련 도서 (같은 카테고리, 자신 제외)
export const relatedBooksQuery = groq`*[_type == "book" && category->slug.current == $category && slug.current != $slug] | order(year desc) [0...4] ${bookProjection}`;

// 도서 네비게이션 (이전/다음)
export const bookNavigationQuery = groq`{
  "prev": *[_type == "book" && year > $year] | order(year asc) [0] { "slug": slug.current, title },
  "next": *[_type == "book" && year < $year] | order(year desc) [0] { "slug": slug.current, title }
}`;

// 전체 슬러그 (generateStaticParams용)
export const allBookSlugsQuery = groq`*[_type == "book"].slug.current`;
