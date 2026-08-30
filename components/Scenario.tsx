"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A single benchmark scenario: the gameplay clip plays (muted, looping) in a
 * 16:9 band at the top of the card, with the metadata + hand-written write-up
 * underneath.
 *
 * Clip source, in priority order:
 *   1. A self-hosted mp4 in the article media folder, named after the scenario
 *      (kebab-case, e.g. "floating heads" -> floating-heads.mp4). Override the
 *      derived name with the `video` prop.
 *   2. If that file is missing (404 on play), it falls back to the YouTube
 *      embed from `youtube`.
 *   3. If neither is available, a "clip coming soon" placeholder.
 * So dropping the mp4s into the folder later switches each card to self-hosted
 * with no MDX changes.
 *
 * Performance: an IntersectionObserver plays/mounts a clip only while its card
 * is near the viewport and pauses/unmounts it once it scrolls away, so only a
 * couple run at once. Honors `prefers-reduced-motion` (no autoplay).
 */

const MEDIA_BASE = "/media/articles/voltaic-s5-master-complete/";

function mediaSrc(file: string): string {
  return file.startsWith("/") ? file : MEDIA_BASE + file;
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ytThumb(id: string, res: "maxres" | "hq"): string {
  return `https://i.ytimg.com/vi/${id}/${res}default.jpg`;
}

/** Silent, chromeless, looping background embed. */
function ytBackgroundSrc(id: string): string {
  const p = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
}

/** Normal, user-initiated embed with controls (reduced-motion / click). */
function ytPlayableSrc(id: string): string {
  const p = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex flex-col rounded-md bg-bg/60 px-2.5 py-1.5 ring-1 ring-border">
      <span className="text-[10px] uppercase tracking-widest text-muted leading-none">
        {label}
      </span>
      <span className="text-xs text-fg leading-tight mt-1">{value}</span>
    </span>
  );
}

export type ScenarioProps = {
  /** Scenario name, e.g. "pasu". */
  name: string;
  /** Final energy score, e.g. "1021.75". */
  score: string;
  /** Tier reached. Defaults to "Master". */
  tier?: string;
  /** Time to clear, e.g. "14h 55m". */
  time: string;
  /** Sensitivity in cm/360, e.g. "47cm". */
  sens: string;
  mouse: string;
  skate: string;
  pad: string;
  /** YouTube video id — fallback clip if no self-hosted mp4 exists yet. */
  youtube?: string;
  /** Override the derived self-hosted filename (default: `<slug(name)>.mp4`). */
  video?: string;
  /** The hand-written write-up. */
  children: React.ReactNode;
};

export function Scenario({
  name,
  score,
  tier = "Master",
  time,
  sens,
  mouse,
  skate,
  pad,
  youtube,
  video,
  children,
}: ScenarioProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [thumbHq, setThumbHq] = useState(false);
  const [localFailed, setLocalFailed] = useState(false);

  // TOC anchor. Must match the slug lib/articles.ts emits for this scenario
  // (both slug `name` the same way) so the Contents links resolve here.
  const anchorId = slugify(name);
  const localSrc = mediaSrc(video ?? `${anchorId}.mp4`);
  const useLocal = !localFailed;
  const useYouTube = !useLocal && !!youtube;
  const posterSrc = youtube ? ytThumb(youtube, thumbHq ? "hq" : "maxres") : undefined;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "150px 0px" },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // The self-hosted <video> is mounted only while in view, which releases its
  // decoder when it scrolls away — browsers cap simultaneous video decoders,
  // so leaving every past clip mounted starves later ones. These are muted,
  // looping, decorative background clips, so they autoplay regardless of
  // reduced-motion (only the heavier YouTube embed honors that preference).
  const showLocalVideo = useLocal && inView;

  // Kick off playback once the freshly-mounted <video> is on screen.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !showLocalVideo) return;
    // React doesn't reliably apply the `muted` *property* from the JSX
    // attribute, so browsers can treat the video as unmuted and block
    // autoplay. Force it before play() so muted autoplay is allowed.
    el.muted = true;
    el.play().catch(() => {});
  }, [showLocalVideo]);

  // Mount the autoplay YouTube iframe only while near the viewport; click overrides.
  const showBgFrame = useYouTube && !!youtube && inView && !reducedMotion;
  const showClickFrame = useYouTube && !!youtube && clicked;

  return (
    <div
      ref={cardRef}
      id={anchorId}
      className="not-prose my-8 scroll-mt-24 overflow-hidden rounded-xl border border-border bg-surface"
    >
      {/* 16:9 clip band */}
      <div className="relative aspect-video bg-bg">
        {useLocal ? (
          <>
            {posterSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterSrc}
                onError={() => setThumbHq(true)}
                alt={`${name} — final Master run`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            {showLocalVideo ? (
              <video
                ref={videoRef}
                src={localSrc}
                poster={posterSrc}
                onError={() => setLocalFailed(true)}
                onCanPlay={(e) => {
                  // Retry playback once the clip is actually ready — the
                  // one-shot play() in the effect can fire before decode is
                  // available (busy decoders), leaving it stuck on the poster.
                  const v = e.currentTarget;
                  v.muted = true;
                  v.play().catch(() => {});
                }}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
          </>
        ) : useYouTube && youtube ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ytThumb(youtube, thumbHq ? "hq" : "maxres")}
              onError={() => setThumbHq(true)}
              alt={`${name} — final Master run`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {showClickFrame ? (
              <iframe
                src={ytPlayableSrc(youtube)}
                title={`${name} gameplay clip`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : showBgFrame ? (
              <iframe
                src={ytBackgroundSrc(youtube)}
                title={`${name} gameplay clip`}
                allow="autoplay; encrypted-media"
                aria-hidden="true"
                tabIndex={-1}
                className="pointer-events-none absolute inset-0 h-full w-full border-0"
              />
            ) : reducedMotion ? (
              <button
                type="button"
                onClick={() => setClicked(true)}
                aria-label={`Play ${name} clip`}
                className="group absolute inset-0 grid place-items-center bg-bg/20"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-bg/60 ring-1 ring-white/60 backdrop-blur-sm transition group-hover:bg-bg/80">
                  <span className="ml-1 border-y-[9px] border-l-[15px] border-y-transparent border-l-white" />
                </span>
              </button>
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-surface-hover to-bg">
            <span className="text-xs uppercase tracking-widest text-muted">
              clip coming soon
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-fg">
              {name}
            </h3>
            <span className="rounded border border-accent/50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-widest text-accent">
              {tier}
            </span>
          </div>
          <div className="flex items-baseline gap-3 text-sm text-muted">
            <span className="font-mono text-base text-fg tabular-nums">
              {score}
            </span>
            <span aria-hidden="true">·</span>
            <span>{time}</span>
            {youtube ? (
              <>
                <span aria-hidden="true">·</span>
                <a
                  href={`https://www.youtube.com/watch?v=${youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap text-accent underline-offset-2 hover:underline"
                >
                  Full run ↗
                </a>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip label="Sens" value={sens} />
          <Chip label="Mouse" value={mouse} />
          <Chip label="Skates" value={skate} />
          <Chip label="Mousepad" value={pad} />
        </div>

        <div className="space-y-4 leading-relaxed [&_strong]:font-semibold [&_strong]:text-fg [&_em]:italic [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </div>
  );
}
