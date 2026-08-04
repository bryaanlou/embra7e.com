"use client";

import { useState } from "react";

/**
 * A YouTube playlist embed as a click-to-load facade: shows a poster + label
 * until clicked, then mounts the playlist player. Nothing loads (no player JS,
 * no autoplay) until the reader opts in, so it's free on page load.
 */

export type PlaylistProps = {
  /** YouTube playlist id (the `list=` value). */
  list: string;
  /** Overlay label, e.g. "All 18 Master runs". */
  label?: string;
  /** Poster image (filename in the article media folder or absolute path). */
  poster?: string;
};

const MEDIA_BASE = "/media/articles/voltaic-s5-master-complete/";

export function Playlist({ list, label = "Watch the runs", poster }: PlaylistProps) {
  const [loaded, setLoaded] = useState(false);
  const posterSrc = poster
    ? poster.startsWith("/")
      ? poster
      : MEDIA_BASE + poster
    : undefined;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative aspect-video bg-bg">
        {loaded ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/videoseries?list=${list}&rel=0&modestbranding=1`}
            title="Voltaic S5 Master Complete — full playlist"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 grid place-items-center"
            aria-label={`Load playlist: ${label}`}
          >
            {posterSrc ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={posterSrc}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-surface-hover to-bg"
              />
            )}
            <span className="absolute inset-0 bg-bg/40 transition group-hover:bg-bg/25" />
            <span className="relative z-10 flex flex-col items-center gap-3">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-accent/90 ring-1 ring-white/30 transition group-hover:scale-105">
                <span className="ml-1 border-y-[11px] border-l-[18px] border-y-transparent border-l-white" />
              </span>
              <span className="text-sm font-medium uppercase tracking-widest text-fg">
                {label}
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
