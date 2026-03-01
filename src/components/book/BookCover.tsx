import Image from "next/image";
import { ImageAsset } from "@/types";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  image: ImageAsset;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function BookCover({
  image,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
}: BookCoverProps) {
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
