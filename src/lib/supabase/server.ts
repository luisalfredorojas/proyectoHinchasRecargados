import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ─── Environment variables ────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. ' +
      'Add it to your .env.local file.',
  );
}

if (!serviceRoleKey) {
  throw new Error(
    'Missing environment variable: SUPABASE_SERVICE_ROLE_KEY. ' +
      'Add it to your .env.local file and NEVER expose it to the browser.',
  );
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a new server-side Supabase client authenticated with the
 * `service_role` key. This client bypasses Row Level Security and has full
 * read/write access to every table and Storage bucket.
 *
 * SECURITY CONTRACT:
 * - This function must ONLY be called inside Next.js API Route handlers
 *   (files under `app/api/`) or Server Components that never send their
 *   output to the browser in a way that leaks the key.
 * - NEVER import or call this function from a file with `'use client'` at
 *   the top, or from any module that is bundled for the browser.
 * - The `SUPABASE_SERVICE_ROLE_KEY` env var does NOT have the
 *   `NEXT_PUBLIC_` prefix intentionally, so Next.js will refuse to include
 *   it in the client bundle.
 *
 * A new client instance is returned on every call instead of a singleton so
 * that each request context is fully isolated (important for concurrent API
 * route executions in serverless/edge environments).
 *
 * @returns A SupabaseClient with service_role privileges
 *
 * @example
 * // Inside an API route handler:
 * import { createServerClient } from '@/lib/supabase/server';
 *
 * export async function GET() {
 *   const supabase = createServerClient();
 *   const { data, error } = await supabase
 *     .from('participants')
 *     .select('*')
 *     .order('created_at', { ascending: false });
 *   // ...
 * }
 */
export function createServerClient(): SupabaseClient {
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      /**
       * API routes run in a stateless serverless environment.
       * There is no browser session to persist or refresh.
       */
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
