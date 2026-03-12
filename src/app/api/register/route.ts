import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { registerSchema } from '@/lib/schemas';
import { getPrizeType } from '@/lib/constants';
import { createServerClient } from '@/lib/supabase/server';
import type { Store } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
const STORAGE_BUCKET = 'invoices';

// ─── POST /api/register ───────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── 1. Parse multipart FormData ──────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: 'La solicitud debe incluir datos de formulario válidos.' },
        { status: 400 },
      );
    }

    const full_name = formData.get('full_name') as string | null;
    const cedula = formData.get('cedula') as string | null;
    const phone = formData.get('phone') as string | null;
    const store = formData.get('store') as string | null;
    const invoice = formData.get('invoice') as File | null;
    const terms_accepted_raw = formData.get('terms_accepted') as string | null;
    const terms_accepted_at_raw = formData.get('terms_accepted_at') as string | null;

    // T&C must be explicitly accepted before submitting
    if (terms_accepted_raw !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Debes aceptar los términos y condiciones para participar.' },
        { status: 422 },
      );
    }

    const terms_accepted = true;
    const terms_accepted_at = terms_accepted_at_raw ?? new Date().toISOString();

    // ── 2. Validate text fields with Zod schema ──────────────────────────────
    let validated: { full_name: string; cedula: string; phone: string; store: Store };
    try {
      validated = registerSchema.parse({ full_name, cedula, phone, store }) as {
        full_name: string;
        cedula: string;
        phone: string;
        store: Store;
      };
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.issues[0];
        const message = firstIssue?.message ?? 'Datos de formulario inválidos.';
        return NextResponse.json({ success: false, error: message }, { status: 422 });
      }
      throw err;
    }

    // ── 3. Validate invoice file ─────────────────────────────────────────────
    if (!invoice || typeof invoice === 'string') {
      return NextResponse.json(
        { success: false, error: 'Debes adjuntar la imagen de tu factura.' },
        { status: 422 },
      );
    }

    if (!ALLOWED_MIME_TYPES.has(invoice.type)) {
      return NextResponse.json(
        { success: false, error: 'La factura debe ser una imagen JPG, PNG o WEBP.' },
        { status: 422 },
      );
    }

    if (invoice.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'La imagen de la factura no puede superar los 10 MB.' },
        { status: 422 },
      );
    }

    // ── 4. Build unique filename ─────────────────────────────────────────────
    // Derive extension from MIME type (e.g. image/jpeg → jpeg, image/png → png)
    const mimeExtension = invoice.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
    const fileName = `${crypto.randomUUID()}_${Date.now()}.${mimeExtension}`;

    // ── 5. Upload file to Supabase Storage ───────────────────────────────────
    const supabase = createServerClient();
    const invoiceBuffer = await invoice.arrayBuffer();

    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, invoiceBuffer, {
        contentType: invoice.type,
        upsert: false,
      });

    if (storageError) {
      console.error('[register] Storage upload error:', storageError);
      return NextResponse.json(
        { success: false, error: 'No se pudo guardar la imagen de la factura. Intenta de nuevo.' },
        { status: 502 },
      );
    }

    // ── 6. Determine prize type ──────────────────────────────────────────────
    const prize_type = getPrizeType(validated.store);

    // ── 7. Insert participant record ─────────────────────────────────────────
    const { error: dbError } = await supabase.from('participants').insert({
      full_name: validated.full_name,
      cedula: validated.cedula,
      phone: validated.phone,
      store: validated.store,
      invoice_url: fileName,
      prize_type,
      terms_accepted,
      terms_accepted_at,
    });

    if (dbError) {
      console.error('[register] Database insert error:', dbError);

      // Attempt to clean up the uploaded file so storage stays consistent
      await supabase.storage.from(STORAGE_BUCKET).remove([fileName]);

      // Duplicate cedula (unique constraint violation in Postgres is code 23505)
      if (dbError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Ya existe un registro con esta cédula.' },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { success: false, error: 'No se pudo completar el registro. Intenta de nuevo.' },
        { status: 502 },
      );
    }

    // ── 8. Return success ────────────────────────────────────────────────────
    return NextResponse.json({ success: true, prize_type }, { status: 201 });
  } catch (err) {
    console.error('[register] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 500 },
    );
  }
}
