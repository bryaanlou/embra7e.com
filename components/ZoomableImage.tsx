"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

type Props = ImageProps & {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
};

export function ZoomableImage({
  wrapperClassName,
  wrapperStyle,
  ...imageProps
}: Props) {
  const [open, setOpen] = useState(false);
  const fullSrc =
    typeof imageProps.src === "string" ? imageProps.src : "";
  const alt =
    typeof imageProps.alt === "string" ? imageProps.alt : "image";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open ${alt} in lightbox`}
        className={wrapperClassName ?? "block w-full cursor-zoom-in"}
        style={wrapperStyle}
      >
        <Image {...imageProps} />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 animate-[fadeIn_120ms_ease-out]"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-fg text-2xl leading-none transition-colors cursor-pointer"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullSrc}
            alt={alt}
            className="max-w-full max-h-full object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </>
  );
}
