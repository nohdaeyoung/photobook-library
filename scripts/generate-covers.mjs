/**
 * SVG 기반 플레이스홀더 커버 이미지 생성 스크립트
 * 실제 이미지로 교체 전까지 사용
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = join(import.meta.dirname, "../public/images/books");
mkdirSync(OUTPUT_DIR, { recursive: true });

// 각 책의 커버 정보
const covers = [
  { file: "the-americans-cover.jpg", title: "The Americans", author: "Robert Frank", year: "1958", bg: "#1a1a2e", accent: "#e94560" },
  { file: "peress-cover.jpg", title: "곤경에 처한\n사람들", author: "Gilles Peress", year: "2021", bg: "#16213e", accent: "#0f3460" },
  { file: "nachtwey-cover.jpg", title: "War\nPhotographer", author: "James Nachtwey", year: "2018", bg: "#0d0d0d", accent: "#8b0000" },
  { file: "genesis-cover.jpg", title: "Genesis", author: "Sebastião Salgado", year: "2013", bg: "#2d3436", accent: "#dfe6e9" },
  { file: "porter-cover.jpg", title: "Intimate\nLandscapes", author: "Eliot Porter", year: "1979", bg: "#2d5016", accent: "#a8d08d" },
  { file: "tokyo-compression-cover.jpg", title: "Tokyo\nCompression", author: "Michael Wolf", year: "2010", bg: "#f5f5dc", accent: "#ff6b35" },
  { file: "moriyama-cover.jpg", title: "사진이여\n안녕", author: "다이도 모리야마", year: "1972", bg: "#0d0d0d", accent: "#ffffff" },
  { file: "levitt-cover.jpg", title: "In the\nStreet", author: "Helen Levitt", year: "1987", bg: "#3d3d3d", accent: "#c4a35a" },
  { file: "soth-mississippi-cover.jpg", title: "Sleeping by\nthe Mississippi", author: "Alec Soth", year: "2004", bg: "#1b4332", accent: "#95d5b2" },
  { file: "goldin-ballad-cover.jpg", title: "The Ballad of\nSexual Dependency", author: "Nan Goldin", year: "1986", bg: "#590d22", accent: "#ff758f" },
  { file: "penn-stilllife-cover.jpg", title: "Still Life", author: "Irving Penn", year: "2001", bg: "#f8f9fa", accent: "#212529" },
  { file: "avedon-west-cover.jpg", title: "In the\nAmerican West", author: "Richard Avedon", year: "1985", bg: "#fafafa", accent: "#1a1a1a" },
  { file: "mann-family-cover.jpg", title: "Immediate\nFamily", author: "Sally Mann", year: "1992", bg: "#2b2b2b", accent: "#d4a574" },
  { file: "korean-dream-cover.jpg", title: "코리안\n드림", author: "최민식", year: "1995", bg: "#1a1a1a", accent: "#e0c080" },
  { file: "busan-cover.jpg", title: "부산,\n그 사이", author: "김기찬", year: "2000", bg: "#264653", accent: "#e9c46a" },
  { file: "haenyeo-cover.jpg", title: "제주 해녀", author: "강운구", year: "2007", bg: "#003049", accent: "#669bbc" },
  { file: "newton-sumo-cover.jpg", title: "SUMO", author: "Helmut Newton", year: "1999", bg: "#0d0d0d", accent: "#ffd700" },
  { file: "lindbergh-cover.jpg", title: "Untold\nStories", author: "Peter Lindbergh", year: "2020", bg: "#1a1a1a", accent: "#adb5bd" },
  { file: "peckerwood-cover.jpg", title: "Redheaded\nPeckerwood", author: "Christian Patterson", year: "2011", bg: "#582f0e", accent: "#ddb892" },
  { file: "afronauts-cover.jpg", title: "The\nAfronauts", author: "Cristina De Middel", year: "2012", bg: "#023047", accent: "#ffb703" },
  { file: "sherman-cover.jpg", title: "Cindy Sherman\nRetrospective", author: "Cindy Sherman", year: "2012", bg: "#e8e8e4", accent: "#2b2d42" },
  { file: "gursky-cover.jpg", title: "Andreas\nGursky", author: "Andreas Gursky", year: "2018", bg: "#ced4da", accent: "#343a40" },
  { file: "family-of-man-cover.jpg", title: "The Family\nof Man", author: "Edward Steichen", year: "1955", bg: "#3c3c3c", accent: "#f4a261" },
  { file: "photobook-history-cover.jpg", title: "The Photobook:\nA History", author: "Parr & Badger", year: "2004", bg: "#bc4749", accent: "#f2e8cf" },
];

function getTextColor(bg) {
  const hex = bg.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#f0f0f0";
}

function generateSVG(cover) {
  const textColor = getTextColor(cover.bg);
  const titleLines = cover.title.split("\n");
  const titleY = titleLines.length === 1 ? 360 : 340;
  const titleSVG = titleLines
    .map((line, i) => `<text x="300" y="${titleY + i * 52}" text-anchor="middle" fill="${textColor}" font-family="Georgia, serif" font-size="42" font-weight="bold">${escapeXml(line)}</text>`)
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="${cover.bg}"/>

  <!-- 장식선 상단 -->
  <line x1="80" y1="80" x2="520" y2="80" stroke="${cover.accent}" stroke-width="1" opacity="0.6"/>

  <!-- 장식선 하단 -->
  <line x1="80" y1="720" x2="520" y2="720" stroke="${cover.accent}" stroke-width="1" opacity="0.6"/>

  <!-- 연도 -->
  <text x="300" y="140" text-anchor="middle" fill="${cover.accent}" font-family="Georgia, serif" font-size="18" letter-spacing="6" opacity="0.8">${cover.year}</text>

  <!-- 장식 요소 -->
  <rect x="270" y="170" width="60" height="2" fill="${cover.accent}" opacity="0.4"/>

  <!-- 타이틀 -->
  <g>
    ${titleSVG}
  </g>

  <!-- 구분선 -->
  <rect x="240" y="${titleY + titleLines.length * 52 + 20}" width="120" height="1" fill="${cover.accent}" opacity="0.5"/>

  <!-- 작가 -->
  <text x="300" y="${titleY + titleLines.length * 52 + 65}" text-anchor="middle" fill="${textColor}" font-family="Georgia, serif" font-size="20" opacity="0.7">${escapeXml(cover.author)}</text>

  <!-- 하단 장식 -->
  <rect x="290" y="680" width="20" height="2" fill="${cover.accent}" opacity="0.4"/>
</svg>`;
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// SVG 파일 생성 (JPG 확장자지만 실제로는 SVG — Next.js Image에서 사용 가능)
// 더 나은 방법: SVG로 저장하고 data URI 참조
for (const cover of covers) {
  const svg = generateSVG(cover);
  // SVG를 직접 저장 (확장자는 .svg로 변경)
  const svgFile = cover.file.replace(".jpg", ".svg");
  writeFileSync(join(OUTPUT_DIR, svgFile), svg);
  console.log(`✓ ${svgFile}`);
}

console.log(`\n총 ${covers.length}개 커버 이미지 생성 완료`);
