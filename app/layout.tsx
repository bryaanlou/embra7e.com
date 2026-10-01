import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Logo } from "@/components/Logo";
import { socials } from "@/components/Socials";
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
    images: [
      {
        url: "https://embra7e.com/media/site/about-hero.jpg",
        alt: "embrace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "embrace",
    description: "Reviews and thought dumps on peripherals, aim training, and whatever else is on my mind.",
    images: ["https://embra7e.com/media/site/about-hero.jpg"],
  },
};

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
              {socials.map(({ href, label, Icon, Wordmark }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex hover:text-accent transition-colors"
                >
                  {Wordmark ? <Wordmark /> : <Icon size={18} />}
                </a>
              ))}
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
