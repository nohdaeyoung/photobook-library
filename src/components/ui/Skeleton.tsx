import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      aria-hidden="true"
    />
  );
}

export function BookCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3"
      aria-busy="true"
      aria-label="책 정보 불러오는 중"
    >
      {/* 커버 이미지 */}
      <Skeleton className="w-full aspect-[3/4] rounded-[var(--radius-md)]" />

      {/* 제목 */}
      <div className="flex flex-col gap-2 px-0.5">
        <Skeleton className="h-4 w-3/4 rounded-[var(--radius-sm)]" />
        <Skeleton className="h-4 w-1/2 rounded-[var(--radius-sm)]" />
      </div>

      {/* 작가 */}
      <Skeleton className="h-3.5 w-2/5 rounded-[var(--radius-sm)]" />
    </div>
  );
}
