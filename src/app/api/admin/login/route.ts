export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { timingSafeEqual, createHash } from 'crypto';

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY_SECONDS = 8 * 60 * 60; // 8 hours

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Simple in-memory rate limiter: max 10 attempts per IP per 15-minute window.
// For multi-instance deployments, replace with a shared store (Redis/KV).

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const loginAttempts = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

function clearRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Constant-time string comparison using crypto.timingSafeEqual.
 * Both strings are hashed to a fixed length before comparison to
 * prevent timing attacks that infer characters from response latency.
 */
function safeCompare(a: string, b: string): boolean {
  const bufA = createHash('sha256').update(a).digest();
  const bufB = createHash('sha256').update(b).digest();
  return timingSafeEqual(bufA, bufB);
}

// ─── POST /api/admin/login ────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── 1. Rate limit by IP ──────────────────────────────────────────────────
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Demasiados intentos. Intente nuevamente en 15 minutos.' },
        { status: 429 },
      );
    }

    // ── 2. Parse JSON body ───────────────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'El cuerpo de la solicitud debe ser JSON válido.' },
        { status: 400 },
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Cuerpo de solicitud inválido.' },
        { status: 400 },
      );
    }

    const { username, password } = body as Record<string, unknown>;

    // ── 3. Validate credentials (timing-safe) ────────────────────────────────
    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUser || !adminPassword || !jwtSecret) {
      console.error('[admin/login] Missing required environment variables: ADMIN_USER, ADMIN_PASSWORD, or JWT_SECRET');
      return NextResponse.json(
        { success: false, error: 'Error de configuración del servidor.' },
        { status: 500 },
      );
    }

    const credentialsMatch =
      typeof username === 'string' &&
      typeof password === 'string' &&
      safeCompare(username.trim(), adminUser.trim()) &&
      safeCompare(password.trim(), adminPassword.trim());

    if (!credentialsMatch) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 },
      );
    }

    // Credentials valid: clear the rate-limit counter for this IP
    clearRateLimit(ip);

    // ── 4. Generate JWT ──────────────────────────────────────────────────────
    const token = jwt.sign({ role: 'admin' }, jwtSecret, {
      expiresIn: TOKEN_EXPIRY_SECONDS,
      algorithm: 'HS256',
    });

    // ── 5. Set httpOnly cookie and return success ────────────────────────────
    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: TOKEN_EXPIRY_SECONDS,
      sameSite: 'strict',
      secure: isProduction,
    });

    return response;
  } catch (err) {
    console.error('[admin/login] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 500 },
    );
  }
}
