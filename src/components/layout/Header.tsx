"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "컬렉션", href: "/books" },
  { label: "소개", href: "/about" },
] as const;

interface HeaderProps {
  onSearchClick?: () => void;
}

export default function Header({ onSearchClick }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // 초기 테마 읽기
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light") setTheme("light");
  }, []);

  // 모바일 드로어 열릴 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // 라우트 변경 시 드로어 닫기
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center"
        style={{
          height: "var(--header-height)",
          backgroundColor: "var(--bg-overlay, rgba(13,13,13,0.92))",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* 로고 */}
          <Link
            href="/"
            className="shrink-0 tracking-widest text-sm font-bold leading-none transition-opacity duration-150 hover:opacity-80"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--accent)",
              letterSpacing: "0.15em",
            }}
          >
            PHOTOBOOK LIBRARY
          </Link>

          {/* 가운데 네비게이션 — md 이상에서만 표시 */}
          <nav className="hidden md:flex items-center gap-8" aria-label="주 내비게이션">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative text-sm pb-1 transition-colors duration-150",
                  isActive(href)
                    ? "font-medium"
                    : "hover:opacity-100"
                )}
                style={{
                  color: isActive(href) ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {label}
                {/* 골드색 밑줄 */}
                {isActive(href) && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* 오른쪽 액션 영역 */}
          <div className="flex items-center gap-1">
            {/* 검색 버튼 */}
            <button
              type="button"
              onClick={onSearchClick}
              aria-label="검색 열기"
              className="p-2 rounded-md transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {/* 돋보기 SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* 테마 토글 버튼 */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
              className="p-2 rounded-md text-base transition-colors duration-150 leading-none"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {theme === "dark" ? "☀" : "🌙"}
            </button>

            {/* 햄버거 버튼 — md 미만에서만 표시 */}
            <button
              type="button"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={mobileOpen}
              className="md:hidden p-2 rounded-md transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
            >
              {mobileOpen ? (
                // X 아이콘
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                // 햄버거 아이콘
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 드로어 오버레이 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        />
      )}

      {/* 모바일 사이드 드로어 */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-72 md:hidden flex flex-col",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border)",
          paddingTop: "var(--header-height)",
        }}
        aria-label="모바일 내비게이션"
      >
        <nav className="flex flex-col py-6 px-6 gap-1">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors duration-150"
              )}
              style={{
                color: isActive(href) ? "var(--accent)" : "var(--text-secondary)",
                backgroundColor: isActive(href) ? "var(--accent-muted)" : "transparent",
                fontWeight: isActive(href) ? 600 : 400,
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* 드로어 하단 구분선 + 테마 */}
        <div
          className="mt-auto px-6 py-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 text-sm transition-colors duration-150"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>{theme === "dark" ? "☀" : "🌙"}</span>
            <span>{theme === "dark" ? "라이트 모드" : "다크 모드"}</span>
          </button>
        </div>
      </aside>

      {/* 헤더 높이만큼 여백 (레이아웃 push) */}
      <div style={{ height: "var(--header-height)" }} aria-hidden="true" />
    </>
  );
}
