import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "embrace",
  description: "Reviews and notes on peripherals, gear, and whatever else.",
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

const socials = [
  { href: "https://www.youtube.com/@embra7e", label: "YouTube", Icon: YouTubeIcon },
  { href: "https://twitch.tv/embra7e", label: "Twitch", Icon: TwitchIcon },
  { href: "https://twitter.com/embra7e", label: "Twitter", Icon: TwitterIcon },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <header className="border-b border-border px-6 py-4">
          <nav className="max-w-2xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="font-semibold tracking-tight hover:text-accent transition-colors"
            >
              embrace
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
                href="https://gearz.gg/embra7e"
                aria-label="gearz.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-accent transition-colors"
                style={{
                  display: "inline-block",
                  width: "52px",
                  height: "14px",
                  maskImage: "url(/images/site/gearz-logo.png)",
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskImage: "url(/images/site/gearz-logo.png)",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                }}
              />

            </div>
            <p>© embrace</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
