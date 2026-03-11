export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY_SECONDS = 8 * 60 * 60; // 8 hours

// ─── POST /api/admin/login ────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── 1. Parse JSON body ───────────────────────────────────────────────────
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

    // ── 2. Validate credentials ──────────────────────────────────────────────
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
      username.trim() === adminUser.trim() &&
      password.trim() === adminPassword.trim();

    if (!credentialsMatch) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 },
      );
    }

    // ── 3. Generate JWT ──────────────────────────────────────────────────────
    const token = jwt.sign({ role: 'admin' }, jwtSecret, {
      expiresIn: TOKEN_EXPIRY_SECONDS,
    });

    // ── 4. Set httpOnly cookie and return success ────────────────────────────
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
