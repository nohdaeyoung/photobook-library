/**
 * 정적 데이터를 Sanity NDJSON 형식으로 변환하고 import하는 스크립트
 * 사용법: node scripts/migrate-to-sanity.mjs
 */
import { writeFileSync } from "fs";
import { join } from "path";

// ─── 카테고리 데이터 ───
const categories = [
  { slug: "documentary", name: "다큐멘터리", nameEn: "Documentary", description: "사회적 사건, 인간의 삶, 역사적 순간을 기록한 사진책", color: "#E53E3E", order: 1 },
  { slug: "portrait", name: "인물/초상", nameEn: "Portrait", description: "인물의 내면과 외면을 탐구하는 초상 사진책", color: "#DD6B20", order: 2 },
  { slug: "landscape", name: "풍경/자연", nameEn: "Landscape", description: "자연과 도시 풍경의 아름다움을 담은 사진책", color: "#38A169", order: 3 },
  { slug: "street", name: "스트리트", nameEn: "Street", description: "도시의 일상과 우연한 순간을 포착한 거리 사진책", color: "#3182CE", order: 4 },
  { slug: "fine-art", name: "파인아트", nameEn: "Fine Art", description: "예술적 표현과 개념적 탐구를 담은 사진책", color: "#805AD5", order: 5 },
  { slug: "korean-photography", name: "한국 사진", nameEn: "Korean Photography", description: "한국 사진가의 작품과 한국을 주제로 한 사진책", color: "#E0C080", order: 6 },
  { slug: "fashion", name: "패션/광고", nameEn: "Fashion & Commercial", description: "패션, 뷰티, 광고 분야의 사진책", color: "#ED64A6", order: 7 },
  { slug: "independent", name: "독립/아티스트북", nameEn: "Independent & Artist Book", description: "소규모 독립 출판, 실험적 형식의 사진책", color: "#4FD1C5", order: 8 },
  { slug: "exhibition", name: "전시 도록", nameEn: "Exhibition Catalog", description: "미술관, 갤러리 전시와 연계된 공식 출판물", color: "#9F7AEA", order: 9 },
  { slug: "archive", name: "역사/아카이브", nameEn: "History & Archive", description: "사진 역사, 희귀 자료, 아카이브 컬렉션", color: "#718096", order: 10 },
];

// ─── 도서 데이터 ───
const books = [
  { id: "1", slug: "the-americans", title: "The Americans", titleEn: "The Americans", author: "Robert Frank", year: 1958, pages: 83, category: "documentary", tags: ["흑백", "로드트립", "미국", "거리", "클래식"], description: "로버트 프랭크가 1955-1956년 미국 전역을 여행하며 촬영한 83장의 사진으로 구성된 사진집.", featured: true, publisher: "Steidl", language: "en", format: "hardcover" },
  { id: "2", slug: "people-in-trouble-laughing-pushed-to-the-ground", title: "곤경에 처한 사람들", titleEn: "People in Trouble Laughing Pushed to the Ground", author: "Gilles Peress", year: 2021, pages: 672, category: "documentary", tags: ["북아일랜드", "분쟁", "다큐", "흑백", "역사"], description: "질 페레스가 1972년부터 북아일랜드 분쟁 지역을 촬영한 방대한 기록.", featured: false, publisher: "Steidl", language: "en", format: "box-set" },
  { id: "3", slug: "war-photographer", title: "War Photographer", titleEn: "War Photographer", author: "James Nachtwey", year: 2018, pages: 468, category: "documentary", tags: ["전쟁", "분쟁", "흑백", "보도사진", "인권"], description: "제임스 낙트웨이의 40년 종군 사진을 집대성한 작품집.", featured: false, publisher: "Phaidon", language: "en", format: "hardcover" },
  { id: "4", slug: "genesis", title: "Genesis", titleEn: "Genesis", author: "Sebastião Salgado", year: 2013, pages: 520, category: "landscape", tags: ["흑백", "자연", "환경", "대형포맷", "원시"], description: "세바스찬 살가두가 8년간 세계 오지를 탐험하며 촬영한 대작.", featured: true, publisher: "Taschen", language: "en", format: "hardcover" },
  { id: "5", slug: "intimate-landscapes", title: "Intimate Landscapes", titleEn: "Intimate Landscapes", author: "Eliot Porter", year: 1979, pages: 152, category: "landscape", tags: ["컬러", "자연", "클로즈업", "계절", "미국"], description: "엘리엇 포터가 미국 자연의 섬세한 디테일을 컬러로 포착한 선구적 작품집.", featured: false, publisher: "Metropolitan Museum of Art", language: "en", format: "hardcover" },
  { id: "6", slug: "tokyo-compression", title: "Tokyo Compression", titleEn: "Tokyo Compression", author: "Michael Wolf", year: 2010, pages: 136, category: "street", tags: ["도쿄", "지하철", "도시", "컬러", "밀폐공간"], description: "마이클 울프가 도쿄 지하철의 출퇴근 시간대를 촬영한 시리즈.", featured: true, publisher: "Peperoni Books", language: "en", format: "hardcover" },
  { id: "7", slug: "bye-bye-photography", title: "사진이여 안녕", titleEn: "Bye Bye Photography", author: "다이도 모리야마", year: 1972, pages: 308, category: "street", tags: ["도쿄", "흑백", "하이콘트라스트", "블러", "프로보크"], description: "다이도 모리야마의 대표작.", featured: true, publisher: "Power Shovel", language: "ja", format: "softcover" },
  { id: "8", slug: "in-the-street", title: "In the Street", titleEn: "In the Street", author: "Helen Levitt", year: 1987, pages: 112, category: "street", tags: ["뉴욕", "흑백", "아이들", "거리놀이", "일상"], description: "헬렌 레빗이 1930-40년대 뉴욕 거리에서 놀고 있는 아이들과 주민들을 포착한 사진집.", featured: false, publisher: "Duke University Press", language: "en", format: "hardcover" },
  { id: "9", slug: "sleeping-by-the-mississippi", title: "Sleeping by the Mississippi", titleEn: "Sleeping by the Mississippi", author: "Alec Soth", year: 2004, pages: 48, category: "fine-art", tags: ["미시시피", "미국", "컬러", "대형포맷", "초상"], description: "알렉 소스가 미시시피 강을 따라 여행하며 만난 사람들과 풍경을 대형 카메라로 촬영한 데뷔작.", featured: true, publisher: "Steidl", language: "en", format: "hardcover" },
  { id: "10", slug: "the-ballad-of-sexual-dependency", title: "The Ballad of Sexual Dependency", titleEn: "The Ballad of Sexual Dependency", author: "Nan Goldin", year: 1986, pages: 148, category: "fine-art", tags: ["컬러", "스냅", "사적기록", "뉴욕", "친밀함"], description: "낸 골딘이 자신의 친구, 연인, 주변 사람들의 일상을 스냅 사진으로 기록한 친밀한 시각 일기.", featured: false, publisher: "Aperture", language: "en", format: "hardcover" },
  { id: "11", slug: "still-life", title: "Still Life", titleEn: "Still Life", author: "Irving Penn", year: 2001, pages: 184, category: "fine-art", tags: ["정물", "스튜디오", "컬러", "오브제", "미니멀"], description: "어빙 펜의 정물 사진을 모은 작품집.", featured: false, publisher: "Bulfinch Press", language: "en", format: "hardcover" },
  { id: "12", slug: "in-the-american-west", title: "In the American West", titleEn: "In the American West", author: "Richard Avedon", year: 1985, pages: 174, category: "portrait", tags: ["미국", "노동자", "흑백", "대형포맷", "스튜디오"], description: "리처드 아베돈이 미국 서부의 노동자, 광부, 카우보이 등 보통 사람들을 촬영한 기념비적 초상 시리즈.", featured: true, publisher: "Abrams", language: "en", format: "hardcover" },
  { id: "13", slug: "immediate-family", title: "Immediate Family", titleEn: "Immediate Family", author: "Sally Mann", year: 1992, pages: 80, category: "portrait", tags: ["가족", "흑백", "어린이", "남부", "대형포맷"], description: "샐리 만이 버지니아 시골에서 자녀 세 명의 어린 시절을 촬영한 사진집.", featured: false, publisher: "Aperture", language: "en", format: "hardcover" },
  { id: "14", slug: "korean-dream", title: "코리안 드림", titleEn: "Korean Dream", author: "최민식", year: 1995, pages: 200, category: "korean-photography", tags: ["한국", "서민", "흑백", "다큐", "1990년대"], description: "최민식 작가가 한국 서민의 삶을 수십 년간 기록한 사진집.", featured: true, publisher: "눈빛", language: "ko", format: "hardcover" },
  { id: "15", slug: "busan-in-between", title: "부산, 그 사이", titleEn: "Busan, In Between", author: "김기찬", year: 2000, pages: 160, category: "korean-photography", tags: ["부산", "골목", "흑백", "도시", "일상"], description: "김기찬 작가가 부산의 골목에서 살아가는 사람들의 일상을 기록한 작품집.", featured: false, publisher: "열화당", language: "ko", format: "hardcover" },
  { id: "16", slug: "jeju-haenyeo", title: "제주 해녀", titleEn: "Jeju Haenyeo", author: "강운구", year: 2007, pages: 240, category: "korean-photography", tags: ["제주", "해녀", "바다", "전통", "흑백"], description: "강운구 작가가 제주도 해녀들의 삶과 물질 작업을 장기간 기록한 사진 에세이.", featured: true, publisher: "눈빛", language: "ko", format: "hardcover" },
  { id: "17", slug: "helmut-newton-sumo", title: "SUMO", titleEn: "SUMO", author: "Helmut Newton", year: 1999, pages: 464, category: "fashion", tags: ["패션", "누드", "컬러", "글래머", "대형판형"], description: "헬무트 뉴턴의 대표적 패션·누드 사진을 거대한 판형에 담은 전설적인 사진집.", featured: true, publisher: "Taschen", language: "en", format: "hardcover" },
  { id: "18", slug: "peter-lindbergh-untold-stories", title: "Untold Stories", titleEn: "Untold Stories", author: "Peter Lindbergh", year: 2020, pages: 320, category: "fashion", tags: ["패션", "흑백", "슈퍼모델", "자연광", "90년대"], description: "피터 린드버그가 직접 큐레이션한 마지막 전시 도록.", featured: false, publisher: "Taschen", language: "en", format: "hardcover" },
  { id: "19", slug: "redheaded-peckerwood", title: "Redheaded Peckerwood", titleEn: "Redheaded Peckerwood", author: "Christian Patterson", year: 2011, pages: 160, category: "independent", tags: ["미국", "범죄", "컬러", "아카이벌", "내러티브"], description: "크리스찬 패터슨이 1958년 네브래스카 연쇄살인 사건의 흔적을 따라가며 촬영한 내러티브 사진집.", featured: false, publisher: "MACK", language: "en", format: "hardcover" },
  { id: "20", slug: "the-afronauts", title: "The Afronauts", titleEn: "The Afronauts", author: "Cristina De Middel", year: 2012, pages: 88, category: "independent", tags: ["아프리카", "우주", "컬러", "픽션", "독립출판"], description: "크리스티나 데 미델이 1964년 잠비아의 우주 프로그램을 모티브로 재구성한 픽션 사진집.", featured: true, publisher: "Self-published", language: "en", format: "softcover" },
  { id: "21", slug: "cindy-sherman-retrospective", title: "Cindy Sherman: Retrospective", titleEn: "Cindy Sherman: Retrospective", author: "Cindy Sherman", year: 2012, pages: 296, category: "exhibition", tags: ["셀프포트레이트", "컬러", "페미니즘", "변장", "현대미술"], description: "MoMA에서 열린 신디 셔먼 회고전 도록.", featured: false, publisher: "MoMA", language: "en", format: "hardcover" },
  { id: "22", slug: "andreas-gursky", title: "Andreas Gursky", titleEn: "Andreas Gursky", author: "Andreas Gursky", year: 2018, pages: 308, category: "exhibition", tags: ["대형포맷", "디지털", "건축", "글로벌", "추상"], description: "안드레아스 거스키의 대형 사진 작품을 모은 전시 도록.", featured: false, publisher: "Steidl", language: "en", format: "hardcover" },
  { id: "23", slug: "the-family-of-man", title: "The Family of Man", titleEn: "The Family of Man", author: "Edward Steichen", year: 1955, pages: 192, category: "archive", tags: ["클래식", "흑백", "인류", "전시", "MoMA"], description: "에드워드 스타이켄이 기획한 MoMA 전시의 도록.", featured: true, publisher: "MoMA", language: "en", format: "softcover" },
  { id: "24", slug: "the-photobook-history-vol1", title: "The Photobook: A History Vol. I", titleEn: "The Photobook: A History Volume I", author: "Martin Parr & Gerry Badger", year: 2004, pages: 320, category: "archive", tags: ["사진사", "컬렉션", "레퍼런스", "비평", "역사"], description: "마틴 파와 게리 뱃저가 사진책의 역사를 체계적으로 정리한 바이블.", featured: false, publisher: "Phaidon", language: "en", format: "hardcover" },
];

// ─── NDJSON 생성 ───
const lines = [];

// 카테고리 문서 생성
const categoryIdMap = {};
for (const cat of categories) {
  const docId = `category-${cat.slug}`;
  categoryIdMap[cat.slug] = docId;
  lines.push(JSON.stringify({
    _id: docId,
    _type: "category",
    name: cat.name,
    nameEn: cat.nameEn,
    slug: { _type: "slug", current: cat.slug },
    description: cat.description,
    color: cat.color,
    order: cat.order,
  }));
}

// 도서 문서 생성
for (const book of books) {
  const docId = `book-${book.slug}`;
  lines.push(JSON.stringify({
    _id: docId,
    _type: "book",
    title: book.title,
    titleEn: book.titleEn,
    slug: { _type: "slug", current: book.slug },
    author: book.author,
    year: book.year,
    pages: book.pages,
    category: {
      _type: "reference",
      _ref: categoryIdMap[book.category],
    },
    tags: book.tags,
    description: book.description,
    featured: book.featured,
    publisher: book.publisher,
    language: book.language,
    format: book.format,
  }));
}

const outputPath = join(import.meta.dirname, "sanity-data.ndjson");
writeFileSync(outputPath, lines.join("\n") + "\n");
console.log(`✓ ${lines.length}개 문서가 ${outputPath}에 생성되었습니다`);
console.log(`\n다음 명령어로 import하세요:`);
console.log(`npx sanity dataset import scripts/sanity-data.ndjson production`);
