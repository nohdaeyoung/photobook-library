import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="text-9xl font-bold leading-none select-none mb-4"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--accent)",
          opacity: 0.9,
          letterSpacing: "-0.04em",
        }}
        aria-hidden="true"
      >
        404
      </div>

      <div
        className="w-12 h-px mb-8"
        style={{ backgroundColor: "var(--accent)" }}
        aria-hidden="true"
      />

      <h1
        className="text-2xl sm:text-3xl font-bold text-center mb-3"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--text-primary)",
        }}
      >
        페이지를 찾을 수 없습니다
      </h1>

      <p
        className="text-sm sm:text-base text-center leading-relaxed max-w-sm mb-10"
        style={{ color: "var(--text-muted)" }}
      >
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
        <br />
        주소를 다시 확인해주세요.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="not-found-btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          홈으로 돌아가기
        </Link>

        <Link
          href="/books"
          className="not-found-btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          컬렉션 탐색하기
        </Link>
      </div>

      <p
        className="mt-16 text-xs tracking-widest uppercase"
        style={{ color: "var(--text-muted)", opacity: 0.5 }}
      >
        Photobook Library
      </p>
    </div>
  );
}
