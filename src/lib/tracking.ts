export type ParsedHeadCode = {
  metaTags: Array<Record<string, string>>;
  inlineScripts: string[];
};

/**
 * 관리자에서 입력한 <head> 코드를 파싱해
 * meta 태그 속성 목록과 인라인 스크립트 내용 목록으로 분리합니다.
 */
export function parseHeadCode(html: string | undefined | null): ParsedHeadCode {
  if (!html?.trim()) return { metaTags: [], inlineScripts: [] };

  const metaTags: Array<Record<string, string>> = [];
  const inlineScripts: string[] = [];

  // <meta> 태그 파싱
  for (const match of html.matchAll(/<meta\s+([^>]*?)\s*\/?>/gi)) {
    const attrs: Record<string, string> = {};
    for (const [, key, val] of match[1].matchAll(/(\w[\w-]*)=["']([^"']*)["']/g)) {
      attrs[key] = val;
    }
    if (Object.keys(attrs).length > 0) metaTags.push(attrs);
  }

  // 인라인 <script> 파싱 (src 속성이 없는 것만)
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrStr = match[1];
    const content = match[2].trim();
    if (!attrStr.toLowerCase().includes("src=") && content) {
      inlineScripts.push(content);
    }
  }

  return { metaTags, inlineScripts };
}
