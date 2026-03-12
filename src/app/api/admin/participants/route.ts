export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import type { Participant } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_NAME = 'admin_token';
const STORAGE_BUCKET = 'invoices';
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60; // 1 hour
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Verifies the admin JWT from the cookie store.
 * Returns true if the token is present and cryptographically valid.
 */
function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('[admin/participants] JWT_SECRET environment variable is not set');
    return false;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as Record<string, unknown>;
    return decoded?.role === 'admin';
  } catch {
    return false;
  }
}

// ─── GET /api/admin/participants ──────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
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

    // ── 2. Parse query parameters ────────────────────────────────────────────
    const { searchParams } = request.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get('page') ?? String(DEFAULT_PAGE), 10) || DEFAULT_PAGE);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));
    const storeFilter = searchParams.get('store') ?? undefined;
    const search = searchParams.get('search') ?? undefined;

    // ── 3. Build Supabase query ──────────────────────────────────────────────
    const supabase = createServerClient();

    // Count query (separate from data query for accuracy)
    let countQuery = supabase
      .from('participants')
      .select('id', { count: 'exact', head: true });

    if (storeFilter) {
      countQuery = countQuery.eq('store', storeFilter);
    }
    if (search) {
      countQuery = countQuery.or(
        `full_name.ilike.%${search}%,cedula.ilike.%${search}%`,
      );
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('[admin/participants] Count query error:', countError);
      return NextResponse.json(
        { success: false, error: 'Error al consultar participantes.' },
        { status: 502 },
      );
    }

    // Data query with pagination
    let dataQuery = supabase
      .from('participants')
      .select('id, full_name, cedula, phone, store, invoice_url, prize_type, terms_accepted, terms_accepted_at, created_at')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (storeFilter) {
      dataQuery = dataQuery.eq('store', storeFilter);
    }
    if (search) {
      dataQuery = dataQuery.or(
        `full_name.ilike.%${search}%,cedula.ilike.%${search}%`,
      );
    }

    const { data: participants, error: dataError } = await dataQuery;

    if (dataError) {
      console.error('[admin/participants] Data query error:', dataError);
      return NextResponse.json(
        { success: false, error: 'Error al obtener los participantes.' },
        { status: 502 },
      );
    }

    // ── 4. Generate signed URLs for invoice images ───────────────────────────
    const participantsWithUrls = await Promise.all(
      (participants ?? []).map(async (participant: Participant) => {
        if (!participant.invoice_url) {
          return participant;
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(participant.invoice_url, SIGNED_URL_EXPIRY_SECONDS);

        if (signedError || !signedData?.signedUrl) {
          // Return participant without a usable URL rather than failing the whole request
          console.warn(
            `[admin/participants] Could not generate signed URL for ${participant.invoice_url}:`,
            signedError,
          );
          return { ...participant, invoice_signed_url: null };
        }

        return { ...participant, invoice_signed_url: signedData.signedUrl };
      }),
    );

    // ── 5. Return paginated response ─────────────────────────────────────────
    return NextResponse.json({
      data: participantsWithUrls,
      total: count ?? 0,
      page,
      limit,
    });
  } catch (err) {
    console.error('[admin/participants] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 500 },
    );
  }
}
