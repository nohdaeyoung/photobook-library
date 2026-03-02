import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "사이트 설정",
  type: "document",
  fields: [
    defineField({
      name: "headCode",
      title: "<head> 직후 코드",
      type: "text",
      description:
        "<head> 태그 바로 다음에 삽입됩니다. Google Search Console 인증 태그, GTM head 스크립트 등을 입력하세요.",
    }),
    defineField({
      name: "bodyCode",
      title: "<body> 직후 코드",
      type: "text",
      description:
        "<body> 태그 바로 다음에 삽입됩니다. GTM noscript 등을 입력하세요.",
    }),
  ],
});
