import { ZoomableImage } from "@/components/ZoomableImage";
import { PageEnter } from "@/components/PageEnter";

export const metadata = {
  title: "About — embrace",
};

export default function AboutPage() {
  return (
    <PageEnter className="max-w-2xl mx-auto space-y-8 rounded-2xl border border-border/60 bg-surface/30 p-8 sm:p-12">
      <div className="space-y-2">
        <ZoomableImage
          src="/images/site/about-hero.jpg"
          alt="embrace"
          width={3212}
          height={1178}
          className="w-full h-auto rounded-lg"
          priority
          quality={90}
          sizes="(min-width: 768px) 672px, 100vw"
          wrapperClassName="block w-full cursor-zoom-in border-0 bg-transparent p-0"
        />
        <p className="text-xs text-muted/70 text-right">
          Art by{" "}
          <a
            href="https://x.com/LIATE_1021"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            LIATE
          </a>
          {" — "}
          <a
            href="https://www.pixiv.net/en/artworks/117957003"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            source
          </a>
        </p>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">About</h1>
      <div className="text-fg leading-relaxed">
        <p>
          Hi, it&apos;s Bryan / <span className="text-accent">embrace</span>.
          I created this site as a personal hub for any written content,
          reviews, and whatever else.
        </p>
      </div>
    </PageEnter>
  );
}
