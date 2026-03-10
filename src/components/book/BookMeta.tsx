import { PhotoBook } from "@/types";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

interface BookMetaProps {
  book: PhotoBook;
  onOpenViewer?: () => void;
}

interface MetaRowProps {
  label: string;
  value: string | number;
}

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div className="flex gap-4 py-2.5 border-b border-[var(--border)] last:border-0">
      <dt className="w-24 flex-shrink-0 text-sm text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="flex-1 text-sm text-[var(--text-secondary)]">{value}</dd>
    </div>
  );
}

const formatLabels: Record<string, string> = {
  hardcover: "양장본",
  softcover: "소프트커버",
  spiral: "스프링제본",
  "box-set": "박스 세트",
};

export function BookMeta({ book, onOpenViewer }: BookMetaProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 제목 영역 */}
      <div className="flex flex-col gap-1">
        <h1
          className={cn(
            "font-[family-name:var(--font-heading)]",
            "text-3xl sm:text-4xl font-medium leading-tight",
            "text-[var(--text-primary)]",
          )}
        >
          {book.title}
        </h1>
        {book.titleEn && (
          <p className="text-base text-[var(--text-muted)] font-light tracking-wide">
            {book.titleEn}
          </p>
        )}
      </div>

      {/* 메타 정보 키-값 목록 */}
      <dl className="flex flex-col">
        <MetaRow label="작가" value={book.author} />
        <MetaRow label="출판연도" value={`${book.year}년`} />
        <MetaRow label="페이지" value={`${book.pages}p`} />
        {book.publisher && (
          <MetaRow label="출판사" value={book.publisher} />
        )}
        {book.format && (
          <MetaRow
            label="제본 형식"
            value={formatLabels[book.format] ?? book.format}
          />
        )}
        {book.language && (
          <MetaRow label="언어" value={book.language} />
        )}
        {book.isbn && (
          <MetaRow label="ISBN" value={book.isbn} />
        )}
        <MetaRow label="카테고리" value={book.category} />
      </dl>

      {/* 태그 목록 */}
      {book.tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
            태그
          </p>
          <div className="flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <Tag key={tag} name={tag} variant="default" />
            ))}
          </div>
        </div>
      )}

      {/* 설명 */}
      {book.description && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
            소개
          </p>
          <p
            className={cn(
              "text-sm text-[var(--text-secondary)] leading-relaxed",
              "whitespace-pre-line",
            )}
          >
            {book.description}
          </p>
        </div>
      )}

      {/* CTA 버튼 */}
      <div className="pt-2 flex flex-wrap gap-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          onClick={onOpenViewer}
          disabled={!book.images || book.images.length === 0}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          사진책 열기
        </Button>

        {book.bookUrl && (
          <a
            href={book.bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium",
              "border border-[var(--border)] text-[var(--text-secondary)]",
              "transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]",
            )}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            도서 페이지
          </a>
        )}
      </div>
    </div>
  );
}
