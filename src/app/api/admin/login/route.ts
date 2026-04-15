export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { timingSafeEqual, createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import { loginLimiter, getClientIp } from '@/lib/ratelimit';
import { logAuditEvent } from '@/lib/audit';

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY_SECONDS = 2 * 60 * 60; // 2 hours (reduced from 8h for tighter security)

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
    const ip = getClientIp(request);

    const { limited } = loginLimiter.check(ip);
    if (limited) {
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

    // ── 3. Validate credentials ────────────────────────────────────────────
    const adminUser = process.env.ADMIN_USER;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const adminPassword = process.env.ADMIN_PASSWORD; // fallback if hash not set
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUser || (!adminPasswordHash && !adminPassword) || !jwtSecret) {
      console.error('[admin/login] Missing required environment variables');
      return NextResponse.json(
        { success: false, error: 'Error de configuración del servidor.' },
        { status: 500 },
      );
    }

    let credentialsMatch = false;

    if (typeof username === 'string' && typeof password === 'string') {
      const usernameValid = safeCompare(username.trim(), adminUser.trim());

      if (usernameValid && adminPasswordHash) {
        // Prefer bcrypt hash comparison (secure even if env vars are leaked)
        credentialsMatch = await bcrypt.compare(password.trim(), adminPasswordHash);
      } else if (usernameValid && adminPassword) {
        // Fallback to timing-safe comparison with plaintext password
        credentialsMatch = safeCompare(password.trim(), adminPassword.trim());
      }
    }

    if (!credentialsMatch) {
      logAuditEvent({ action: 'admin.login.failed', ip, details: { username: typeof username === 'string' ? username : 'invalid' } });
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 },
      );
    }

    // Credentials valid: clear the rate-limit counter for this IP
    loginLimiter.reset(ip);
    logAuditEvent({ action: 'admin.login', ip });

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
