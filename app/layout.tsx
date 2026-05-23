import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Logo } from "@/components/Logo";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://embra7e.com"),
  title: "embrace",
  description: "Reviews and thought dumps on peripherals, aim training, and whatever else is on my mind.",
  icons: {
    icon: "/media/site/logo.svg",
  },
  openGraph: {
    title: "embrace",
    description: "Reviews and thought dumps on peripherals, aim training, and whatever else is on my mind.",
    url: "https://embra7e.com",
    siteName: "embrace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "embrace",
    description: "Reviews and thought dumps on peripherals, aim training, and whatever else is on my mind.",
  },
};

type IconProps = { size?: number };

const YouTubeIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TwitchIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

const TwitterIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SteamIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.624 0 11.99-5.367 11.99-12C23.969 5.443 18.603 0 11.979 0zm-7.598 14.876l-1.92-.793c.51 1.063 1.557 1.873 2.804 1.873 1.379 0 2.504-1.126 2.504-2.506 0-1.379-1.124-2.503-2.504-2.503-.55 0-1.057.179-1.471.481l1.984.821c1.022.428 1.504 1.604 1.076 2.62-.428 1.018-1.605 1.499-2.629 1.075l-.844-.349m15.137-5.963c0-1.66-1.351-3.012-3.011-3.012-1.664 0-3.012 1.354-3.012 3.012 0 1.665 1.348 3.012 3.012 3.012 1.66 0 3.011-1.348 3.011-3.012zm-5.273-.006c0-1.25 1.018-2.262 2.27-2.262 1.252 0 2.27 1.012 2.27 2.262 0 1.252-1.018 2.265-2.27 2.265-1.252 0-2.27-1.013-2.27-2.265z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const socials = [
  { href: "https://twitter.com/embra7e", label: "Twitter", Icon: TwitterIcon },
  { href: "https://instagram.com/embra7e", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.youtube.com/@embra7e", label: "YouTube", Icon: YouTubeIcon },
  { href: "https://twitch.tv/embra7e", label: "Twitch", Icon: TwitchIcon },
  { href: "https://steamcommunity.com/id/embra7e/", label: "Steam", Icon: SteamIcon },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interTight.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <header className="border-b border-border px-6 py-4">
          <nav className="max-w-2xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2 font-semibold tracking-tight text-fg hover:text-accent transition-colors"
            >
              <Logo size={22} className="text-accent" />
              <span>embrace</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted">
              <Link href="/articles" className="hover:text-fg transition-colors">
                Articles
              </Link>
              <Link href="/benchmarks" className="hover:text-fg transition-colors">
                Benchmarks
              </Link>
              <Link href="/about" className="hover:text-fg transition-colors">
                About
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 w-full px-6 py-12">{children}</main>
        <footer className="border-t border-border px-6 py-8 mt-16">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
            <div className="flex items-center gap-4">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
              <a
                href="https://gearz.gg/embrace"
                aria-label="gearz.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-accent transition-colors"
                style={{
                  display: "inline-block",
                  width: "52px",
                  height: "14px",
                  maskImage: "url(/media/site/gearz-logo.png)",
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskImage: "url(/media/site/gearz-logo.png)",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                }}
              />

            </div>
            <p>© embrace</p>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
