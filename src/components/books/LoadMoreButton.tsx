export const LOAD_MORE_STEP = 12;

export function LoadMoreButton({
  remaining,
  onClick,
}: {
  remaining: number;
  onClick: () => void;
}) {
  const loadCount = Math.min(remaining, LOAD_MORE_STEP);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      <span>{loadCount}권 더 보기</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:translate-y-0.5"
        aria-hidden="true"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    </button>
  );
}
