import { PhotoBook } from "@/types";
import { cn } from "@/lib/utils";
import { BookCard } from "./BookCard";

interface RelatedBooksProps {
  books: PhotoBook[];
  currentSlug: string;
  className?: string;
}

export function RelatedBooks({ books, currentSlug, className }: RelatedBooksProps) {
  const related = books
    .filter((book) => book.slug !== currentSlug)
    .slice(0, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className={cn("flex flex-col gap-5", className)}>
      {/* 섹션 제목 */}
      <div className="flex items-center gap-3">
        <h2
          className={cn(
            "font-[family-name:var(--font-heading)]",
            "text-xl font-medium text-[var(--text-primary)]",
          )}
        >
          관련 사진책
        </h2>
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-sm text-[var(--text-muted)]">
          {related.length}권
        </span>
      </div>

      {/* 가로 스크롤 카드 목록 */}
      <div
        className={cn(
          "flex gap-4 overflow-x-auto",
          "pb-2",
          // 스크롤바 여백이 레이아웃을 덮지 않도록 음수 마진 보정
          "-mx-1 px-1",
          // 스냅 스크롤로 UX 개선
          "snap-x snap-mandatory",
        )}
      >
        {related.map((book, index) => (
          <div key={book.id} className="snap-start flex-shrink-0 w-44 sm:w-52">
            <BookCard
              book={book}
              priority={index === 0}
              size="md"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
