export const metadata = {
  title: "About — embrace",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">About</h1>
      <div className="space-y-4 text-fg leading-relaxed">
        <p>
          Hi — I&apos;m Bryan, but online I go by <span className="text-accent">embrace</span>.
          This is where I write about the things I use: peripherals, gear, and the
          occasional note that doesn&apos;t belong on Twitter.
        </p>
        <p>
          Reviews here come out of actually living with something, not a same-day take.
          If a piece of gear made my desk better, I&apos;ll tell you why. If it
          didn&apos;t, same.
        </p>
        <p className="text-muted">
          Find me on{" "}
          <a
            href="https://twitch.tv/embra7e"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Twitch
          </a>{" "}
          and{" "}
          <a
            href="https://www.youtube.com/@embra7e"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            YouTube
          </a>{" "}
          as @embra7e.
        </p>
      </div>
    </div>
  );
}
