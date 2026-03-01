import { defineField, defineType } from "sanity";

export default defineType({
  name: "book",
  title: "사진책",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "영문 제목",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "슬러그",
      type: "slug",
      options: { source: "titleEn", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "작가",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "출판 연도",
      type: "number",
      validation: (rule) => rule.required().min(1800).max(2100),
    }),
    defineField({
      name: "pages",
      title: "페이지 수",
      type: "number",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "category",
      title: "카테고리",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "태그",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "description",
      title: "설명",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "coverImage",
      title: "커버 이미지",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "대체 텍스트",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "images",
      title: "갤러리 이미지",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "대체 텍스트",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "추천 도서",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publisher",
      title: "출판사",
      type: "string",
    }),
    defineField({
      name: "isbn",
      title: "ISBN",
      type: "string",
    }),
    defineField({
      name: "language",
      title: "언어",
      type: "string",
      options: {
        list: [
          { title: "한국어", value: "ko" },
          { title: "영어", value: "en" },
          { title: "일본어", value: "ja" },
          { title: "기타", value: "other" },
        ],
      },
    }),
    defineField({
      name: "format",
      title: "제본 형태",
      type: "string",
      options: {
        list: [
          { title: "하드커버", value: "hardcover" },
          { title: "소프트커버", value: "softcover" },
          { title: "스프링", value: "spiral" },
          { title: "박스 세트", value: "box-set" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author",
      media: "coverImage",
    },
  },
  orderings: [
    {
      title: "출판 연도 (최신순)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "제목 (가나다순)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
