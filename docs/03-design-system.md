# 03. 디자인 시스템

## 개요

사진책 라이브러리는 **사진 중심의 다크 테마**를 기본으로 하며, 사진의 색감을 방해하지 않도록
절제된 색상 팔레트와 세리프 서체를 조합합니다. 모든 디자인 토큰은 CSS 변수로 정의되어
라이트/다크 테마 전환을 지원합니다.

---

## 색상 팔레트

### CSS 변수 전체 목록

| 변수명 | 다크모드 | 라이트모드 | 용도 |
|--------|----------|------------|------|
| `--bg-primary` | `#0D0D0D` | `#FAFAF8` | 페이지 배경 |
| `--bg-secondary` | `#1A1A1A` | `#FFFFFF` | 카드, 섹션 배경 |
| `--bg-tertiary` | `#242424` | `#F0F0EE` | 입력 필드, 호버 배경 |
| `--bg-card` | `#1A1A1A` | `#FFFFFF` | 카드 컴포넌트 배경 |
| `--bg-overlay` | `rgba(13,13,13,0.95)` | `rgba(250,250,248,0.95)` | 모달/오버레이 배경 |
| `--text-primary` | `#F0F0F0` | `#1A1A1A` | 본문 주요 텍스트 |
| `--text-secondary` | `#A0A0A0` | `#555555` | 보조 텍스트, 메타정보 |
| `--text-muted` | `#6B6B6B` | `#888888` | 비활성, 힌트 텍스트 |
| `--accent` | `#E0C080` | `#B8932E` | 주요 액션, 강조 |
| `--accent-hover` | `#D4AE5E` | `#9A7A20` | 액센트 호버 상태 |
| `--accent-muted` | `rgba(224,192,128,0.15)` | `rgba(184,147,46,0.1)` | 액센트 배경 (투명) |
| `--border` | `#2A2A2A` | `#E0E0E0` | 기본 테두리 |
| `--border-hover` | `#3A3A3A` | `#CCCCCC` | 호버 시 테두리 |
| `--danger` | `#E53E3E` | `#E53E3E` | 에러, 삭제 액션 |
| `--success` | `#38A169` | `#38A169` | 성공, 완료 상태 |

### 테마 적용 방식

```css
/* 기본값: 다크모드 (:root) */
:root {
  --bg-primary: #0D0D0D;
  /* ... */
}

/* 라이트모드: data-theme="light" 속성으로 전환 */
[data-theme="light"] {
  --bg-primary: #FAFAF8;
  /* ... */
}
```

현재 `<html>` 태그에 `data-theme="dark"` 가 기본 적용됩니다.

### 카테고리 색상

각 카테고리는 고유 색상을 가지며 Badge 컴포넌트에서 컬러 도트로 표시됩니다.

| 카테고리 | 색상 |
|----------|------|
| 다큐멘터리 | `#E53E3E` |
| 인물/초상 | `#DD6B20` |
| 풍경/자연 | `#38A169` |
| 스트리트 | `#3182CE` |
| 파인아트 | `#805AD5` |
| 한국 사진 | `#E0C080` |
| 패션/광고 | `#ED64A6` |
| 독립/아티스트북 | `#4FD1C5` |
| 전시 도록 | `#9F7AEA` |
| 역사/아카이브 | `#718096` |

---

## 타이포그래피

### 서체

| 변수 | 서체명 | 종류 | 용도 | 로딩 방식 |
|------|--------|------|------|-----------|
| `--font-heading` | Nanum Myeongjo | 세리프 | 제목, h1~h6 | Google Fonts (웨이트: 400, 700, 800) |
| `--font-body` | Pretendard | 산세리프 | 본문, UI 텍스트 | 로컬 폰트 (`PretendardVariable.woff2`) |
| `--font-mono` | JetBrains Mono | 모노스페이스 | 코드, ISBN 등 | 시스템 폰트 폴백 |

### 서체 사용 원칙

- **제목류** (`h1`~`h6`, 책 제목, 섹션 타이틀): Nanum Myeongjo — 서정적이고 문학적인 느낌
- **UI 텍스트** (버튼, 레이블, 본문, 메타정보): Pretendard — 가독성 우선
- **숫자/코드**: JetBrains Mono — ISBN, 페이지 수 등

### 타입 스케일

Tailwind CSS 기본 스케일을 사용합니다.

| 클래스 | 크기 | 용도 |
|--------|------|------|
| `text-xs` | 12px | 태그, 배지, 캡션 |
| `text-sm` | 14px | 보조 정보, 소 카드 |
| `text-base` | 16px | 본문 기본 크기 |
| `text-lg` | 18px | 소제목, 카드 제목 (lg) |
| `text-xl` | 20px | 섹션 소제목 |
| `text-2xl` | 24px | 섹션 제목 |
| `text-3xl` | 30px | 페이지 제목 |
| `text-4xl` | 36px | 홈 히어로 제목 |

### 줄 높이

| 컨텍스트 | line-height | 설명 |
|----------|-------------|------|
| 제목 (heading) | 1.3 | 압축된 제목 줄 간격 |
| 본문 (body) | 1.6 | 가독성 우선 줄 간격 |

---

## 간격 및 여백 체계

Tailwind CSS 기본 간격 단위 (1단위 = 4px) 를 사용합니다.

### 주요 레이아웃 변수

| 변수 | 값 | 용도 |
|------|----|------|
| `--header-height` | `72px` | 헤더 기본 높이 |
| `--header-height-scrolled` | `56px` | 스크롤 후 축소된 헤더 높이 |

### 컨테이너 패딩

| 브레이크포인트 | 패딩 |
|----------------|------|
| 모바일 (< 768px) | `px-4` (16px) |
| 태블릿 (768px~) | `px-6` (24px) |
| 데스크탑 (1024px~) | `px-8` (32px) |

### 보더 반경

| 변수 | 값 | 용도 |
|------|----|------|
| `--radius-sm` | `4px` | 배지, 태그 내 버튼 |
| `--radius-md` | `8px` | 입력 필드, 버튼 |
| `--radius-lg` | `12px` | 카드, 모달 |
| `--radius-xl` | `16px` | 라이트박스, 대형 패널 |

### 쉐도우

| 변수 | 값 | 용도 |
|------|----|------|
| `--shadow-card` | `0 2px 8px rgba(0,0,0,0.3)` | 카드 기본 그림자 |
| `--shadow-card-hover` | `0 12px 32px rgba(0,0,0,0.5)` | 카드 호버 그림자 |
| `--shadow-overlay` | `0 25px 50px rgba(0,0,0,0.6)` | 모달/라이트박스 그림자 |

---

## 전환 애니메이션

| 변수 | 값 | 용도 |
|------|----|------|
| `--transition-fast` | `150ms ease` | 호버 색상 변화 |
| `--transition-normal` | `250ms ease` | 카드 이동, 크기 변화 |
| `--transition-slow` | `400ms ease` | 모달 등장, 페이지 전환 |

접근성을 위해 `prefers-reduced-motion: reduce` 미디어 쿼리로 모든 애니메이션을 비활성화합니다.

---

## 컴포넌트 명세

### Button

경로: `src/components/ui/Button.tsx`

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `variant` | `primary \| secondary \| ghost` | `primary` | 버튼 스타일 종류 |
| `size` | `sm \| md \| lg` | `md` | 버튼 크기 |
| `disabled` | `boolean` | `false` | 비활성 상태 |

**variant별 스타일:**

| variant | 배경 | 텍스트 | 테두리 |
|---------|------|--------|--------|
| `primary` | `--accent` | `#0D0D0D` | 없음 |
| `secondary` | 투명 | `--accent` | `--accent` |
| `ghost` | 투명 | `--text-secondary` | 투명 |

**size별 패딩:**

| size | 패딩 | 폰트 | 반경 |
|------|------|------|------|
| `sm` | `px-3 py-1.5` | `text-sm` | `--radius-sm` |
| `md` | `px-5 py-2.5` | `text-base` | `--radius-md` |
| `lg` | `px-7 py-3.5` | `text-lg` | `--radius-lg` |

```tsx
// 사용 예시
<Button variant="primary" size="md">컬렉션 보기</Button>
<Button variant="secondary" size="sm">필터 초기화</Button>
<Button variant="ghost">취소</Button>
```

---

### Tag

경로: `src/components/ui/Tag.tsx`

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `name` | `string` | — | 표시할 태그 이름 |
| `variant` | `default \| active \| removable` | `default` | 태그 상태 |
| `onClick` | `() => void` | — | 클릭 핸들러 (클릭 가능 시 cursor-pointer) |
| `onRemove` | `() => void` | — | removable 변형에서 X 버튼 클릭 핸들러 |

**variant별 스타일:**

| variant | 배경 | 텍스트 | 테두리 | 용도 |
|---------|------|--------|--------|------|
| `default` | `--bg-secondary` | `--text-secondary` | `--border` | 일반 태그 |
| `active` | `--accent` | `#0D0D0D` | `--accent` | 선택된 필터 태그 |
| `removable` | `--bg-secondary` | `--text-secondary` | `--border` | 제거 가능한 태그 (X 버튼 포함) |

```tsx
// 사용 예시
<Tag name="흑백" variant="default" onClick={() => handleFilter("흑백")} />
<Tag name="도쿄" variant="active" onClick={() => handleFilter("도쿄")} />
<Tag name="스트리트" variant="removable" onRemove={() => removeTag("스트리트")} />
```

---

### Badge

경로: `src/components/ui/Badge.tsx`

카테고리를 컬러 도트와 함께 표시하는 소형 레이블 컴포넌트

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | `string` | 필수 | 배지 텍스트 (카테고리명) |
| `color` | `string` | 필수 | 도트 색상 (HEX) |

```tsx
// 사용 예시
<Badge name="다큐멘터리" color="#E53E3E" />
<Badge name="스트리트" color="#3182CE" />
```

---

### Skeleton

경로: `src/components/ui/Skeleton.tsx`

데이터 로딩 중 표시하는 플레이스홀더 컴포넌트

```css
/* 애니메이션: globals.css */
.skeleton {
  background: linear-gradient(90deg, --bg-secondary 25%, --bg-tertiary 37%, --bg-secondary 63%);
  animation: skeleton-loading 1.4s ease infinite;
}
```

---

### BookCard

경로: `src/components/book/BookCard.tsx`

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `book` | `PhotoBook` | — | 표시할 책 데이터 |
| `priority` | `boolean` | `false` | LCP 이미지 우선 로딩 여부 |
| `size` | `sm \| md \| lg` | `md` | 카드 크기 |

**size별 치수:**

| size | 카드 너비 | 제목 | 메타 | 태그 |
|------|-----------|------|------|------|
| `sm` | `160px` | `text-sm` | `text-xs` | `text-xs px-2 py-0.5` |
| `md` | `224px` | `text-base` | `text-sm` | `text-xs px-2.5 py-1` |
| `lg` | `288px` | `text-lg` | `text-sm` | `text-xs px-3 py-1` |

**인터랙션:**
- 호버 시: `-translate-y-1` 부상 효과 + 그림자 강화
- 이미지 호버 시: `scale(1.03)` 줌인
- `featured: true` 일 때 좌상단에 "추천" 배지 표시
- 태그는 최대 3개까지 표시

```tsx
// 사용 예시
<BookCard book={book} size="md" priority={true} />
```

---

### FilterSidebar

경로: `src/components/ui/FilterSidebar.tsx`

카테고리, 태그, 연도 범위를 선택하는 필터 패널

**기능:**
- 카테고리 단일 선택
- 태그 다중 선택
- 연도 범위 필터
- 활성 필터 수 표시
- 필터 전체 초기화

---

## 반응형 브레이크포인트

| 이름 | 너비 | 대상 기기 | 주요 레이아웃 변화 |
|------|------|-----------|-------------------|
| 모바일 | 375px | 스마트폰 (기본) | 1열 레이아웃, 햄버거 메뉴 |
| 태블릿 | 768px (`md:`) | 태블릿 세로 | 2열 그리드, 사이드바 등장 |
| 노트북 | 1024px (`lg:`) | 노트북, 태블릿 가로 | 3~4열 그리드, 전체 네비게이션 |
| 데스크탑 | 1440px (`2xl:`) | 와이드 모니터 | 최대 컨테이너 너비 제한 |

### 그리드 레이아웃 예시 (컬렉션 페이지)

| 브레이크포인트 | 열 수 |
|----------------|-------|
| 기본 (< 640px) | 2열 |
| `sm` (640px~) | 3열 |
| `lg` (1024px~) | 4열 |
| `xl` (1280px~) | 5열 |

---

## 접근성 지침

- **포커스 표시**: `:focus-visible` 시 `2px solid --accent` 아웃라인 표시
- **키보드 내비게이션**: Tag, SearchModal 등 인터랙티브 요소에 `tabIndex`, `onKeyDown` 구현
- **스크린 리더**: 장식 이미지에 `aria-hidden="true"`, 기능 버튼에 `aria-label` 제공
- **모션 감소**: `prefers-reduced-motion` 쿼리로 모든 전환 효과 `0.01ms`로 축소
- **색상 대비**: 액센트 골드(`#E0C080`)와 다크 배경(`#0D0D0D`)의 대비비 충족

---

## 아이콘 시스템

별도 아이콘 라이브러리 없이 인라인 SVG를 사용합니다.

- **BookCard 빈 표지**: 책 모양 SVG (직접 정의)
- **Tag X 버튼**: 닫기 SVG (직접 정의)
- **검색/메뉴/닫기**: 각 컴포넌트에 인라인 SVG
- `aria-hidden="true"` 로 장식 아이콘 처리
