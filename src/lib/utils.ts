import imageCompression from 'browser-image-compression';

// ─── Image Compression ────────────────────────────────────────────────────────

/**
 * Compresses an image File in the browser before uploading it to Supabase
 * Storage. The output is always within 2 MB and at most 1920 px on its longest
 * side so that it remains legible as an invoice preview without straining
 * mobile connections.
 *
 * @param file - The original image File selected or captured by the user
 * @returns A new compressed File object with the same name and MIME type
 *
 * @example
 * const compressed = await compressImage(file);
 * // compressed.size <= 2 * 1024 * 1024
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    /** Target maximum size in megabytes */
    maxSizeMB: 1,
    /** Longest dimension (width or height) in pixels */
    maxWidthOrHeight: 1920,
    /** Offload compression work to a Web Worker to avoid blocking the UI */
    useWebWorker: true,
  };

  const compressed = await imageCompression(file, options);

  // imageCompression may return a Blob; ensure we always hand back a File so
  // callers can use .name and .type reliably.
  return new File([compressed], file.name, { type: compressed.type });
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

/**
 * Formats an ISO 8601 / TIMESTAMPTZ string into a human-readable date for
 * display in the admin panel (e.g. "10 mar 2026, 14:35").
 *
 * Uses the 'es-EC' locale to match Ecuador's date conventions.
 *
 * @param date - ISO date string from Supabase (e.g. "2026-03-10T14:35:00Z")
 * @returns Formatted string suitable for table cells and detail modals
 */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Guayaquil',
  }).format(new Date(date));
}

// ─── File Name Generation ─────────────────────────────────────────────────────

/**
 * Generates a unique, collision-resistant file name for Supabase Storage using
 * a UUID v4 combined with a Unix timestamp.
 *
 * Format: `{uuid}_{timestamp}.{ext}`
 *
 * The UUID is produced with `crypto.randomUUID()` which is available in all
 * modern browsers and in the Node.js runtime used by Next.js API routes.
 *
 * @param extension - File extension WITHOUT the leading dot (e.g. "jpg", "png")
 * @returns A unique storage key, e.g. "550e8400-e29b-41d4-a716-446655440000_1741612500000.jpg"
 */
export function generateFileName(extension: string): string {
  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  const safeExt = extension.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${uuid}_${timestamp}.${safeExt}`;
}
