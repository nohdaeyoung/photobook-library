"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { label: "홈", href: "/" },
  { label: "컬렉션", href: "/books" },
  { label: "소개", href: "/about" },
] as const;

const SNS_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      // Instagram SVG
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    icon: (
      // Twitter / X SVG
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
] as const;

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* 3열 그리드: 모바일은 1열, md 이상 3열 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* 1열 — 사이트 정보 */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="self-start tracking-widest text-sm font-bold leading-none transition-opacity duration-150 hover:opacity-75"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--accent)",
                letterSpacing: "0.15em",
              }}
            >
              PHOTOBOOK & ArtBook LIBRARY
            </Link>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--text-muted)" }}
            >
              개인 소장 사진책 컬렉션을 온라인으로 감상할 수 있는 공간입니다.
              다큐멘터리, 포트레이트, 풍경, 스트리트 등 다양한 장르를 탐색해보세요.
            </p>
          </div>

          {/* 2열 — 빠른 링크 */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "var(--text-secondary)" }}
            >
              빠른 링크
            </h3>
            <nav aria-label="푸터 내비게이션">
              <ul className="flex flex-col gap-2">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "text-sm transition-colors duration-150 inline-block"
                      )}
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.color = "var(--text-primary)")
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 3열 — SNS 링크 */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "var(--text-secondary)" }}
            >
              소셜 미디어
            </h3>
            <ul className="flex flex-col gap-3">
              {SNS_LINKS.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} 바로가기 (새 탭에서 열림)`}
                    className="flex items-center gap-2 text-sm transition-colors duration-150 w-fit"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = "var(--accent)")
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                  >
                    {icon}
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div
          className="mt-10 pt-6 flex flex-col items-center gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-4">
            <Link
              href="/dev-notes"
              className="text-xs transition-colors duration-150"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              개발노트
            </Link>
            <span className="text-xs" style={{ color: "var(--border)" }}>|</span>
            <Link
              href="/prompts"
              className="text-xs transition-colors duration-150"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              프롬프트
            </Link>
          </div>
          <p
            className="text-xs text-center"
            style={{ color: "var(--text-muted)" }}
          >
            &copy; {new Date().getFullYear()} Photobook & ArtBook Library. All rights reserved.
          </p>
          <p
            className="text-xs text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Built with Next.js &amp; Claude Code
          </p>
        </div>
      </div>
    </footer>
  );
}
