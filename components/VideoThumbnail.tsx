import Image from "next/image";

type Props = {
  /** External URL the thumbnail links to (e.g. a YouTube video). */
  href: string;
  /** Thumbnail image path. */
  src: string;
  alt: string;
};

/**
 * A thumbnail that links out to a video. Unlike the default MDX `img`
 * (which maps to ZoomableImage and opens a lightbox), this only navigates
 * to `href` — no zoom/expand — and shows a play affordance so it reads as a
 * video link rather than an inline image.
 */
export function VideoThumbnail({ href, src, alt }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt}
      className="group relative my-8 block overflow-hidden rounded-lg"
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        sizes="100vw"
        unoptimized
        className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <span className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-bg/60 ring-1 ring-white/70 backdrop-blur-sm transition group-hover:bg-bg/80">
          <span className="ml-1 border-y-[12px] border-l-[20px] border-y-transparent border-l-white" />
        </span>
      </span>
    </a>
  );
}
