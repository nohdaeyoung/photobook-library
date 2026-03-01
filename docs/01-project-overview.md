# 01. 프로젝트 개요

## 프로젝트 정보

- **프로젝트명**: 사진책 라이브러리 (Photobook Library)
- **버전**: 0.1.0
- **목적**: 개인 소장 사진책 컬렉션을 온라인으로 전시하고 탐색할 수 있는 아카이브 사이트
- **배포 환경**: Vercel (프론트엔드) + Cloudflare R2 (이미지 스토리지)

---

## 기술 스택

| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| 프레임워크 | Next.js | 16.x | 풀스택 React 프레임워크, App Router 사용 |
| 언어 | TypeScript | 5.x | 정적 타입 시스템 |
| 스타일링 | Tailwind CSS | v4 | 유틸리티 기반 CSS 프레임워크 |
| CMS | Sanity | 7.x | 헤드리스 CMS (Phase 2 연동 예정) |
| 스토리지 | Cloudflare R2 | — | 사진책 이미지 저장소 |
| 검색 | Fuse.js | 7.x | 클라이언트 사이드 퍼지 검색 |
| 애니메이션 | Framer Motion | 12.x | 페이지 전환 및 UI 인터랙션 |
| 배포 | Vercel | — | 정적/서버 사이드 렌더링 호스팅 |
| 런타임 | React | 19.x | UI 라이브러리 |

---

## 디렉토리 구조

```
photobook-library/
├── src/
│   ├── app/                        # Next.js App Router 페이지
│   │   ├── page.tsx                # 홈 페이지 (/)
│   │   ├── layout.tsx              # 루트 레이아웃 (폰트, 메타데이터)
│   │   ├── globals.css             # 전역 CSS 변수 및 기본 스타일
│   │   ├── not-found.tsx           # 404 페이지
│   │   ├── books/
│   │   │   ├── page.tsx            # 컬렉션 목록 (/books)
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # 책 상세 (/books/:slug)
│   │   ├── about/
│   │   │   └── page.tsx            # 소개 페이지 (/about)
│   │   └── search/
│   │       └── page.tsx            # 검색 페이지 (/search)
│   │
│   ├── components/                 # UI 컴포넌트
│   │   ├── layout/                 # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx          # 글로벌 헤더 (네비게이션, 검색 버튼)
│   │   │   ├── Footer.tsx          # 글로벌 푸터
│   │   │   └── Breadcrumb.tsx      # 브레드크럼 내비게이션
│   │   ├── book/                   # 책 관련 컴포넌트
│   │   │   ├── BookCard.tsx        # 카드형 책 미리보기 (sm/md/lg 사이즈)
│   │   │   ├── BookCover.tsx       # 책 표지 이미지 (라이트박스 연동)
│   │   │   ├── BookMeta.tsx        # 책 메타정보 (출판사, ISBN, 판형 등)
│   │   │   └── RelatedBooks.tsx    # 연관 책 목록
│   │   ├── viewer/                 # 뷰어 컴포넌트
│   │   │   └── LightboxViewer.tsx  # 이미지 라이트박스 (키보드 지원)
│   │   ├── search/                 # 검색 컴포넌트
│   │   │   ├── SearchModal.tsx     # 전체화면 검색 모달
│   │   │   ├── SearchInput.tsx     # 검색 입력 필드
│   │   │   └── SearchPageClient.tsx # 검색 결과 페이지 클라이언트
│   │   ├── ui/                     # 기본 UI 원자 컴포넌트
│   │   │   ├── Button.tsx          # 버튼 (primary/secondary/ghost)
│   │   │   ├── Tag.tsx             # 태그 필터 (default/active/removable)
│   │   │   ├── Badge.tsx           # 카테고리 배지 (컬러 도트 포함)
│   │   │   ├── Skeleton.tsx        # 로딩 스켈레톤
│   │   │   └── FilterSidebar.tsx   # 필터 사이드바 (카테고리/태그/연도)
│   │   ├── home/
│   │   │   └── HomeClient.tsx      # 홈 페이지 클라이언트 컴포넌트
│   │   ├── books/
│   │   │   ├── BooksClient.tsx     # 컬렉션 목록 클라이언트 (필터/정렬)
│   │   │   └── BookDetailClient.tsx # 책 상세 클라이언트
│   │   └── about/
│   │       └── AboutClient.tsx     # 소개 페이지 클라이언트
│   │
│   ├── data/                       # 샘플 데이터 (Sanity 연동 전 임시)
│   │   ├── books.ts                # 사진책 샘플 데이터 (8권)
│   │   └── categories.ts           # 카테고리 데이터 (10개)
│   │
│   ├── hooks/                      # 커스텀 React 훅
│   │
│   ├── lib/                        # 유틸리티 및 비즈니스 로직
│   │   ├── books.ts                # 책 데이터 조회 함수
│   │   ├── utils.ts                # 공통 유틸리티 (cn 등)
│   │   └── search/
│   │       └── fuseConfig.ts       # Fuse.js 검색 설정 및 인스턴스
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript 타입 정의
│   │
│   └── styles/
│       └── fonts/
│           └── PretendardVariable.woff2  # 로컬 폰트 파일
│
├── public/                         # 정적 파일
│   └── images/
│       └── books/                  # 책 표지 이미지
├── docs/                           # 설계 문서
├── next.config.ts
├── package.json
├── tsconfig.json
└── postcss.config.mjs
```

---

## 페이지 구성

| 경로 | 페이지 | 렌더링 방식 | 설명 |
|------|--------|-------------|------|
| `/` | 홈 | SSG | 추천책, 최신책, 카테고리 목록 |
| `/books` | 컬렉션 | SSG + CSR | 전체 목록, 필터/정렬 기능 |
| `/books/[slug]` | 책 상세 | SSG | 표지, 내지 이미지, 메타정보, 연관책 |
| `/about` | 소개 | SSG | 큐레이터 소개 및 컬렉션 철학 |
| `/search` | 검색 | CSR | Fuse.js 퍼지 검색 결과 |

---

## 개발 로드맵

### Phase 1 — MVP (현재)

- Next.js App Router 기반 정적 사이트 구축
- 사진책 목록 및 상세 페이지
- 카테고리/태그 필터링
- Fuse.js 클라이언트 사이드 검색
- 라이트박스 이미지 뷰어
- 다크모드 기본 적용
- 반응형 레이아웃 (모바일~데스크탑)

### Phase 2 — 기능 확장

- Sanity CMS 연동 (콘텐츠 관리 시스템)
- Cloudflare R2 이미지 스토리지 연동
- 플립 뷰어 (페이지 넘기기 인터랙션)
- 즐겨찾기 / 북마크 기능
- SNS 공유 기능 (Open Graph 최적화)
- 라이트/다크 테마 토글

### Phase 3 — 커뮤니티 및 글로벌

- 독자 코멘트 기능
- 뉴스레터 구독 (신규 입수 알림)
- 다국어 지원 (한국어/영어/일본어)
- 관련 전시/이벤트 연동
- 컬렉터 네트워크 기능

---

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

개발 서버는 기본적으로 `http://localhost:3000` 에서 실행됩니다.
