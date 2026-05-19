export const metadata = {
  title: "About — embrace",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">About</h1>
      <div className="text-fg leading-relaxed">
        <p>
          hi it&apos;s bryan/ <span className="text-accent">embrace</span>.
          created this site as a personal hub for any written content,
          reviews, and whatever else.
        </p>
      </div>
    </div>
  );
}
