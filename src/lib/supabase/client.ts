'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ─── Environment variables ────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. ' +
      'Add it to your .env.local file.',
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Add it to your .env.local file.',
  );
}

// ─── Singleton ────────────────────────────────────────────────────────────────

/**
 * Module-level singleton so every call to `createBrowserClient()` reuses the
 * same Supabase client instance across the entire browser session. This avoids
 * creating multiple GoTrue auth listeners and WebSocket connections.
 */
let browserClient: SupabaseClient | null = null;

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Returns the browser-side Supabase client initialised with the public anon
 * key. This client is safe to use inside React components, hooks, and client
 * components (`'use client'`).
 *
 * IMPORTANT: This client is intentionally restricted by Row Level Security.
 * It must NEVER be used in API routes that require privileged access — use
 * `createServerClient()` from `@/lib/supabase/server` instead.
 *
 * @returns A singleton SupabaseClient bound to the anon role
 *
 * @example
 * // Inside a client component:
 * const supabase = createBrowserClient();
 * const { data, error } = await supabase.storage
 *   .from('invoices')
 *   .upload(fileName, compressedFile);
 */
export function createBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        /**
         * Participants do not need an authenticated Supabase session.
         * Disabling auto-refresh prevents unnecessary token requests.
         */
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return browserClient;
}
