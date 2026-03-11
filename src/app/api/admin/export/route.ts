export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import type { Participant } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_NAME = 'admin_token';

// CSV column headers (Spanish labels for Duracell operations team)
const CSV_HEADERS = ['Nombre', 'Cédula', 'Celular', 'Local', 'Tipo de Premio', 'Fecha de Registro'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Verifies the admin JWT from the cookie store.
 * Returns true if the token is present and cryptographically valid.
 */
function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('[admin/export] JWT_SECRET environment variable is not set');
    return false;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as Record<string, unknown>;
    return decoded?.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Escapes a single CSV cell value.
 * Wraps the value in double-quotes and escapes any internal double-quotes
 * by doubling them (RFC 4180 compliant).
 */
function escapeCsvCell(value: string): string {
  const stringValue = value ?? '';
  // If the value contains a comma, double-quote, or newline it must be quoted
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Formats an ISO 8601 timestamp to a human-readable YYYY-MM-DD HH:mm string
 * using UTC time so exports are deterministic regardless of server timezone.
 */
function formatDate(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (isNaN(date.getTime())) return isoTimestamp;

  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

/**
 * Maps internal prize_type values to their human-readable Spanish labels.
 */
function formatPrizeType(prizeType: string): string {
  const labels: Record<string, string> = {
    cine_en_casa: 'Cine en Casa',
    camiseta_ecuador: 'Camiseta Ecuador',
  };
  return labels[prizeType] ?? prizeType;
}

// ─── GET /api/admin/export ────────────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // ── 1. Verify JWT from cookie ────────────────────────────────────────────
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(COOKIE_NAME);

    if (!verifyAdminToken(tokenCookie?.value)) {
      return NextResponse.json(
        { success: false, error: 'No autorizado.' },
        { status: 401 },
      );
    }

    // ── 2. Parse optional query parameters ──────────────────────────────────
    const { searchParams } = request.nextUrl;
    const storeFilter = searchParams.get('store') ?? undefined;

    // ── 3. Query all matching participants ───────────────────────────────────
    const supabase = createServerClient();

    let query = supabase
      .from('participants')
      .select('full_name, cedula, phone, store, prize_type, created_at')
      .order('created_at', { ascending: false });

    if (storeFilter) {
      query = query.eq('store', storeFilter);
    }

    const { data: participants, error: dbError } = await query;

    if (dbError) {
      console.error('[admin/export] Database query error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Error al exportar participantes.' },
        { status: 502 },
      );
    }

    // ── 4. Build CSV string ──────────────────────────────────────────────────
    const rows: string[] = [];

    // Header row
    rows.push(CSV_HEADERS.map(escapeCsvCell).join(','));

    // Data rows
    for (const participant of (participants ?? []) as Participant[]) {
      const row = [
        escapeCsvCell(participant.full_name),
        escapeCsvCell(participant.cedula),
        escapeCsvCell(participant.phone),
        escapeCsvCell(participant.store),
        escapeCsvCell(formatPrizeType(participant.prize_type)),
        escapeCsvCell(formatDate(participant.created_at)),
      ];
      rows.push(row.join(','));
    }

    // BOM prefix for Excel UTF-8 compatibility, then CRLF line endings (RFC 4180)
    const BOM = '\uFEFF';
    const csvContent = BOM + rows.join('\r\n');

    // ── 5. Return CSV response ───────────────────────────────────────────────
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=participantes_hinchas_recargados.csv',
      },
    });
  } catch (err) {
    console.error('[admin/export] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 500 },
    );
  }
}
