import { NextRequest, NextResponse } from 'next/server';

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_NAME = 'admin_token';

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * Next.js Edge Middleware for protecting admin routes.
 *
 * Strategy:
 * - /admin (page): allow through unconditionally — the page itself renders
 *   either a login form or the admin dashboard depending on the cookie state.
 *   This avoids a redirect loop and keeps the URL clean.
 * - /api/admin/* (except /api/admin/login): return 401 JSON if the
 *   admin_token cookie is absent or empty.
 *
 * NOTE: JWT signature verification is intentionally NOT performed here because
 * the Edge runtime does not support the Node.js `crypto` module required by
 * `jsonwebtoken`. Full cryptographic verification happens inside each API
 * route handler via `jsonwebtoken.verify()`.
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Retrieve the admin token cookie value (may be undefined or empty string)
  const adminToken = request.cookies.get(COOKIE_NAME)?.value?.trim();
  const hasToken = Boolean(adminToken);

  // ── /api/admin/* (protected API routes, login is excluded by matcher) ───────
  if (pathname.startsWith('/api/admin/')) {
    if (!hasToken) {
      return NextResponse.json(
        { success: false, error: 'No autorizado.' },
        { status: 401 },
      );
    }
    // Token present — let the API route handler perform full JWT verification
    return NextResponse.next();
  }

  // ── /admin (admin page and any sub-paths) ────────────────────────────────────
  // Allow all requests through; the page component handles session state
  return NextResponse.next();
}

// ─── Route Matcher ────────────────────────────────────────────────────────────

export const config = {
  /**
   * Apply this middleware to:
   *  - /admin and any /admin/** sub-paths
   *  - /api/admin/participants and /api/admin/export (explicitly protected)
   *  - /api/admin/login is intentionally excluded so unauthenticated
   *    POST requests can reach the login handler
   */
  matcher: ['/admin/:path*', '/api/admin/participants', '/api/admin/export'],
};
