"use client";

import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { label: "홈", href: "/" },
  { label: "컬렉션", href: "/books" },
  { label: "소개", href: "/about" },
] as const;

// SNS_LINKS: 실제 프로필 URL로 교체하거나 href를 추가하면 표시됩니다.
// 예) href: "https://instagram.com/yourprofile"
const SNS_LINKS: { label: string; href: string; icon: React.ReactNode }[] = [];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* 그리드: SNS 링크가 있으면 3열, 없으면 2열 */}
        <div className={`grid grid-cols-1 gap-10 md:gap-8 ${SNS_LINKS.length > 0 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>

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
                      className="text-sm transition-colors duration-150 inline-block text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:text-[var(--text-primary)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 3열 — SNS 링크 (링크가 있을 때만 표시) */}
          {SNS_LINKS.length > 0 && (
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
                      className="flex items-center gap-2 text-sm transition-colors duration-150 w-fit text-[var(--text-muted)] hover:text-[var(--accent)] focus-visible:text-[var(--accent)]"
                    >
                      {icon}
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 하단 저작권 */}
        <div
          className="mt-10 pt-6 flex flex-col items-center gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-4">
            <Link
              href="/dev-notes"
              className="text-xs transition-colors duration-150 text-[var(--text-muted)] hover:text-[var(--accent)] focus-visible:text-[var(--accent)]"
            >
              개발노트
            </Link>
            <span className="text-xs text-[var(--border)]">|</span>
            <Link
              href="/prompts"
              className="text-xs transition-colors duration-150 text-[var(--text-muted)] hover:text-[var(--accent)] focus-visible:text-[var(--accent)]"
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
