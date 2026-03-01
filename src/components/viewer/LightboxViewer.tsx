"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

interface LightboxViewerProps {
  images: ImageAsset[];
  initialIndex: number;
  bookTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Inner content (only mounted when isOpen is true) ───────────────────────

function LightboxContent({
  images,
  initialIndex,
  bookTitle,
  onClose,
}: Omit<LightboxViewerProps, "isOpen">) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const total = images.length;
  const currentImage = images[currentIndex];

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbnailRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>("[data-active='true']");
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      key="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span
          className="text-sm font-medium truncate max-w-[60%]"
          style={{ color: "var(--text-primary, #F5F5F0)" }}
        >
          {bookTitle}
        </span>

        <span
          className="text-sm tabular-nums flex-shrink-0 mx-4"
          style={{ color: "var(--text-muted, rgba(245,245,240,0.4))" }}
        >
          {currentIndex + 1} / {total}
        </span>

        <button
          onClick={onClose}
          aria-label="닫기"
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0",
            "transition-colors duration-150",
            "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--text-primary, #F5F5F0)" }}
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* ── Main image area ── */}
      <div className="relative flex-1 flex items-center justify-center min-h-0 px-14">
        {/* Previous arrow */}
        {total > 1 && (
          <button
            onClick={goPrev}
            aria-label="이전 이미지"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10",
              "flex items-center justify-center w-10 h-10 rounded-full",
              "transition-colors duration-150",
              "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--text-primary, #F5F5F0)" }}
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Current image with enter/exit animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center w-full h-full"
          >
            {currentImage && (
              <div className="relative max-h-[80vh] max-w-full flex items-center justify-center">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  width={currentImage.width}
                  height={currentImage.height}
                  placeholder={currentImage.blurDataURL ? "blur" : "empty"}
                  blurDataURL={currentImage.blurDataURL}
                  className="object-contain max-h-[80vh] w-auto"
                  style={{ maxWidth: "100%" }}
                  priority
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next arrow */}
        {total > 1 && (
          <button
            onClick={goNext}
            aria-label="다음 이미지"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10",
              "flex items-center justify-center w-10 h-10 rounded-full",
              "transition-colors duration-150",
              "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--text-primary, #F5F5F0)" }}
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {total > 1 && (
        <div
          className="flex-shrink-0 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            ref={thumbnailRef}
            className="flex gap-2 overflow-x-auto px-4 pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                data-active={idx === currentIndex ? "true" : "false"}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`이미지 ${idx + 1}로 이동`}
                aria-current={idx === currentIndex ? "true" : undefined}
                className={cn(
                  "relative flex-shrink-0 w-14 h-14 rounded overflow-hidden",
                  "transition-all duration-150 focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-white/40",
                  idx === currentIndex
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70",
                )}
                style={
                  idx === currentIndex
                    ? { boxShadow: "0 0 0 2px var(--accent, #E0C080)" }
                    : {}
                }
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

export default function LightboxViewer({
  images,
  initialIndex,
  bookTitle,
  isOpen,
  onClose,
}: LightboxViewerProps) {
  return (
    <AnimatePresence>
      {isOpen && images.length > 0 && (
        <LightboxContent
          images={images}
          initialIndex={initialIndex}
          bookTitle={bookTitle}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
