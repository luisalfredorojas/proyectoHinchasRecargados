import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_NAME = 'admin_token';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Verifies the admin JWT using `jose` (Edge-runtime compatible).
 * Returns true only if the signature is valid and the payload contains
 * `role: 'admin'`.
 */
async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ['HS256'] },
    );
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

// ─── Proxy (formerly Middleware) ──────────────────────────────────────────────

/**
 * Next.js 16 Edge Proxy for protecting admin routes.
 *
 * - /admin (page): allow through — the page renders login or dashboard.
 * - /api/admin/* (except /api/admin/login): return 401 if the JWT is
 *   absent, invalid, or expired. Full cryptographic verification is
 *   performed here using `jose` (Edge-compatible).
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get(COOKIE_NAME)?.value?.trim();

  // ── /api/admin/* (protected API routes, login excluded by matcher) ─────────
  if (pathname.startsWith('/api/admin/')) {
    if (!adminToken || !(await verifyToken(adminToken))) {
      return NextResponse.json(
        { success: false, error: 'No autorizado.' },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  // ── /admin (page and sub-paths) ────────────────────────────────────────────
  return NextResponse.next();
}

// ─── Route Matcher ────────────────────────────────────────────────────────────

export const config = {
  matcher: ['/admin/:path*', '/api/admin/participants', '/api/admin/export'],
};
