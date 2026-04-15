import { createServerClient } from '@/lib/supabase/server';

// ─── Types ───────────────────────────────────────────────────────────────────

type AuditAction =
  | 'admin.login'
  | 'admin.login.failed'
  | 'admin.logout'
  | 'admin.participants.list'
  | 'admin.participants.export';

interface AuditLogEntry {
  action: AuditAction;
  ip: string;
  details?: Record<string, unknown>;
}

// ─── Audit Logger ────────────────────────────────────────────────────────────

/**
 * Logs an admin action to the `admin_audit_log` table in Supabase.
 * This is fire-and-forget — errors are logged to console but do not
 * block the main request flow.
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from('admin_audit_log').insert({
      action: entry.action,
      ip_address: entry.ip,
      details: entry.details ?? null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[audit] Failed to write audit log:', error);
    }
  } catch (err) {
    console.error('[audit] Unexpected error writing audit log:', err);
  }
}
