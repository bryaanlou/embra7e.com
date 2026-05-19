import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-6 py-12">
      <p className="text-xs uppercase tracking-widest text-accent">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Nothing here.</h1>
      <p className="text-muted leading-relaxed">
        This page doesn&apos;t exist, or it moved. Try one of these instead.
      </p>
      <div className="flex gap-6 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">
          ← Home
        </Link>
        <Link href="/articles" className="hover:text-accent transition-colors">
          Articles
        </Link>
      </div>
    </div>
  );
}
