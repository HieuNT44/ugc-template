import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Rewrites Medium-style /@username URLs to /u/[username].
 * Auth is handled client-side (SPA guards) — no server redirects here.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const bookMatch = pathname.match(/^\/@([^/]+)\/books\/([^/]+)\/?$/);
  if (bookMatch?.[1] && bookMatch[2]) {
    const url = request.nextUrl.clone();
    url.pathname = `/u/${bookMatch[1]}/books/${bookMatch[2]}`;
    return NextResponse.rewrite(url);
  }

  const profileMatch = pathname.match(/^\/@([^/]+)\/?$/);
  if (profileMatch?.[1]) {
    const url = request.nextUrl.clone();
    url.pathname = `/u/${profileMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/@:username", "/@:username/books/:id"],
};
