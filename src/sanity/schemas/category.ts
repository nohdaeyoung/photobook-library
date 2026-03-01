import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "카테고리",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "이름",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nameEn",
      title: "영문 이름",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "슬러그",
      type: "slug",
      options: { source: "nameEn", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "설명",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "color",
      title: "색상 코드",
      type: "string",
      validation: (rule) => rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: "hex color" }),
    }),
    defineField({
      name: "order",
      title: "정렬 순서",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "nameEn",
    },
  },
  orderings: [
    {
      title: "정렬 순서",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
