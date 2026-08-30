import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mirrors the social-card unfurl bots allowlisted in robots.txt — they fetch
// preview images server-side and need /media/ regardless of Referer.
const UNFURL_BOT_UA =
  /Twitterbot|facebookexternalhit|LinkedInBot|Slackbot|Discordbot|TelegramBot/i;

/**
 * Block direct hotlinking of self-hosted media (images/video) from other
 * sites. Same-origin requests, requests with no Referer (curl, direct
 * navigation), and the known unfurl bots above are allowed through; only a
 * foreign Referer origin gets rejected.
 */
export function middleware(request: NextRequest) {
  if (UNFURL_BOT_UA.test(request.headers.get("user-agent") ?? "")) {
    return NextResponse.next();
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      if (new URL(referer).origin !== request.nextUrl.origin) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } catch {
      // Malformed referer header — fall through and allow.
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/media/:path*",
};
