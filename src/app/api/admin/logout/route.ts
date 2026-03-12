export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

// ─── POST /api/admin/logout ───────────────────────────────────────────────────
// Invalidates the admin session cookie server-side.
// Client-side cookie deletion alone is insufficient because a captured token
// would remain cryptographically valid until its 8-hour expiry. This endpoint
// overwrites the cookie with an expired value using all security flags intact.

const COOKIE_NAME = 'admin_token';

export async function POST(): Promise<NextResponse> {
  const isProduction = process.env.NODE_ENV === 'production';

  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'strict',
    secure: isProduction,
  });

  return response;
}
