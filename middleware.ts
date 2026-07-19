import { NextRequest, NextResponse } from "next/server";

// Subdomain routing (domain-agnostic):
//   resume-cli.<domain>/  → serves the terminal experience (rewrites to /terminal)
//   resume.<domain>/ (or apex) → serves the résumé (the root route, unchanged)
//
// Path routes (`/`, `/terminal`) keep working everywhere, so local dev needs no
// host tricks — the subdomains are just a production-facing entry point.
export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const { pathname } = req.nextUrl;

  if (host.startsWith("resume-cli") && pathname === "/") {
    return NextResponse.rewrite(new URL("/terminal", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
