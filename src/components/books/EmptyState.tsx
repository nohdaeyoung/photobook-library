export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center rounded-2xl"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          style={{ color: "var(--text-muted)" }}
        >
          <rect x="8" y="4" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="12" y="8" width="20" height="2" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="12" y="13" width="20" height="2" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="12" y="18" width="14" height="2" rx="1" fill="currentColor" opacity="0.3" />
          <line x1="8" y1="6" x2="8" y2="38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <p className="text-base font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
        조건에 맞는 사진책이 없습니다
      </p>
      <p className="text-sm mb-6 max-w-xs" style={{ color: "var(--text-muted)" }}>
        다른 카테고리나 태그를 선택하거나 필터를 초기화해 보세요.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 bg-[var(--accent)] text-[var(--text-on-accent)] hover:bg-[var(--accent-hover)]"
      >
        필터 초기화
      </button>
    </div>
  );
}
