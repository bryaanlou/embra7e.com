import { ZoomableImage } from "@/components/ZoomableImage";
import { PageEnter } from "@/components/PageEnter";
import { socials } from "@/components/Socials";

export const metadata = {
  title: "About — embrace",
};

export default function AboutPage() {
  return (
    <PageEnter className="max-w-2xl mx-auto space-y-8 rounded-2xl border border-border/60 bg-surface/30 p-8 sm:p-12">
      <div className="space-y-2">
        <ZoomableImage
          src="/media/site/about-hero.jpg"
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
          Art by <a href="https://www.pixiv.net/en/artworks/117957003" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LIATE</a>
        </p>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">About</h1>
      <div className="text-fg leading-relaxed">
        <p>
          Hi, it&apos;s Bryan / <span className="text-accent">embrace</span>.
          I built this as a personal hub for reviews, thought dumps, and anything future me might find cool to look back on.
        </p>
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Socials</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {socials.map(({ href, label, handle, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-3 rounded-lg border border-border/60 p-4 text-muted hover:border-accent/60 hover:text-accent transition-colors"
              >
                <Icon size={22} />
                <span className="flex flex-col">
                  <span className="text-fg group-hover:text-accent transition-colors">{label}</span>
                  <span className="text-sm">{handle}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PageEnter>
  );
}
