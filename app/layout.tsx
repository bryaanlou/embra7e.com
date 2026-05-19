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
  title: "embra7e",
  description: "Reviews and notes on peripherals, gear, and whatever else.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <header className="border-b border-neutral-200 px-6 py-4">
          <nav className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight hover:opacity-70 transition-opacity">
              embra7e
            </Link>
            <Link href="/articles" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Articles
            </Link>
          </nav>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
