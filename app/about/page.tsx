import { ZoomableImage } from "@/components/ZoomableImage";

export const metadata = {
  title: "About — embrace",
};

export default function AboutPage() {
  return (
    <div className="page-enter max-w-2xl mx-auto space-y-8">
      <ZoomableImage
        src="/images/site/about-hero.jpg"
        alt="embrace"
        width={3212}
        height={1367}
        className="w-full h-auto rounded-lg ring-1 ring-border"
        priority
        unoptimized
        wrapperClassName="block w-full cursor-zoom-in border-0 bg-transparent p-0"
      />
      <h1 className="text-2xl font-semibold tracking-tight">About</h1>
      <div className="text-fg leading-relaxed">
        <p>
          Hi, it&apos;s Bryan / <span className="text-accent">embrace</span>.
          Created this site as a personal hub for any written content,
          reviews, and whatever else.
        </p>
      </div>
    </div>
  );
}
