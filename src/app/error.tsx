"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <p className="text-4xl mb-4" style={{ color: "var(--accent)" }}>!</p>
      <h2
        className="text-xl font-medium mb-2"
        style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
      >
        페이지를 불러오지 못했습니다
      </h2>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        일시적인 오류가 발생했습니다. 다시 시도해주세요.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-150"
          style={{ backgroundColor: "var(--accent)", color: "var(--text-on-accent)" }}
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full text-sm font-medium border transition-colors duration-150"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
