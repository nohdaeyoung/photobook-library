import Image from "next/image";
import { ImageAsset } from "@/types";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  image: ImageAsset | null | undefined;
  coverUrl?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function BookCover({
  image,
  coverUrl,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
}: BookCoverProps) {
  if (!image?.src && coverUrl) {
    return (
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden rounded-lg",
          "bg-[var(--bg-tertiary)]",
          className,
        )}
      >
        <img
          src={coverUrl}
          alt="표지"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  if (!image?.src) {
    return (
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden rounded-lg flex items-center justify-center",
          "bg-[var(--bg-tertiary)]",
          className,
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--text-muted)", opacity: 0.4 }}
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-lg",
        "bg-[var(--bg-tertiary)]",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
        placeholder={image.blurDataURL ? "blur" : "empty"}
        blurDataURL={image.blurDataURL}
      />
    </div>
  );
}
