import { cn } from "@/lib/utils";

export interface CategoryItem {
  name: string;
  slug: string;
  count: number;
}

export interface TagItem {
  name: string;
  count: number;
}

export interface FilterSidebarProps {
  categories: CategoryItem[];
  tags: TagItem[];
  selectedCategory: string | null;
  selectedTags: string[];
  featuredOnly: boolean;
  onCategoryChange: (slug: string | null) => void;
  onTagChange: (tag: string) => void;
  onFeaturedChange: (featured: boolean) => void;
  onReset: () => void;
}

export function SidebarContent({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  featuredOnly,
  onCategoryChange,
  onTagChange,
  onFeaturedChange,
  onReset,
}: FilterSidebarProps) {
  const hasActiveFilters = selectedCategory !== null || selectedTags.length > 0 || featuredOnly;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between pb-4 mb-4"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          필터
        </h2>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
            )}
            style={{
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              backgroundColor: "transparent",
            }}
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* ── 전체 / 추천 ── */}
        <section>
          <div className="flex gap-2">
            {([
              { key: false, label: "전체" },
              { key: true, label: "추천" },
            ] as const).map((item) => {
              const isActive = item.key === featuredOnly;
              return (
                <button
                  key={item.label}
                  onClick={() => onFeaturedChange(item.key)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: "var(--accent-muted)",
                          color: "var(--accent)",
                          border: "1px solid var(--accent)",
                        }
                      : {
                          backgroundColor: "transparent",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-light)",
                        }
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Category section ── */}
        <section>
          <h3
            className="text-xs font-medium uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            카테고리
          </h3>
          <ul className="space-y-0.5" role="radiogroup" aria-label="카테고리 필터">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <li key={cat.slug}>
                  <button
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onCategoryChange(isSelected ? null : cat.slug)}
                    className={cn(
                      "w-full flex items-center justify-between gap-2",
                      "px-3 py-2 rounded-lg text-sm text-left",
                      "transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                    )}
                    style={
                      isSelected
                        ? { backgroundColor: "var(--accent-muted)", color: "var(--accent)" }
                        : { color: "var(--text-secondary)", backgroundColor: "transparent" }
                    }
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className="flex-shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center"
                        style={{ borderColor: isSelected ? "var(--accent)" : "var(--border-medium)" }}
                      >
                        {isSelected && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "var(--accent)" }}
                          />
                        )}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className="flex-shrink-0 text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                      ({cat.count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Tags section ── */}
        {tags.length > 0 && (
          <section>
            <h3
              className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              태그
            </h3>
            <ul className="space-y-0.5" role="group" aria-label="태그 필터">
              {tags.map((tag) => {
                const isChecked = selectedTags.includes(tag.name);
                return (
                  <li key={tag.name}>
                    <button
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => onTagChange(tag.name)}
                      className={cn(
                        "w-full flex items-center justify-between gap-2",
                        "px-3 py-2 rounded-lg text-sm text-left",
                        "transition-colors duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                      )}
                      style={
                        isChecked
                          ? { backgroundColor: "var(--accent-muted)", color: "var(--accent)" }
                          : { color: "var(--text-secondary)", backgroundColor: "transparent" }
                      }
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="flex-shrink-0 w-3.5 h-3.5 rounded flex items-center justify-center"
                          style={{
                            border: isChecked ? "none" : "1.5px solid var(--border-medium)",
                            backgroundColor: isChecked ? "var(--accent)" : "transparent",
                          }}
                        >
                          {isChecked && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="9"
                              height="9"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              style={{ color: "var(--text-on-accent)" }}
                            >
                              <polyline points="2 6 5 9 10 3" />
                            </svg>
                          )}
                        </span>
                        <span className="truncate">{tag.name}</span>
                      </span>
                      <span className="flex-shrink-0 text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                        ({tag.count})
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {/* Reset button (bottom) */}
      <div className="pt-4 mt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={onReset}
          disabled={!hasActiveFilters}
          className={cn(
            "w-full py-2.5 rounded-lg text-sm font-medium",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
            "disabled:opacity-30 disabled:cursor-not-allowed",
          )}
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
}
