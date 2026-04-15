-- =============================================
-- Admin Audit Log - Security Audit Migration
-- =============================================
-- Run this SQL in Supabase SQL Editor to create
-- the audit log table for tracking admin actions.

-- 1. Create audit log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON admin_audit_log (action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON admin_audit_log (created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Only service_role can insert and read
CREATE POLICY "Allow service_role full access on audit log"
  ON admin_audit_log FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Optional: Auto-cleanup entries older than 90 days (run periodically via cron)
-- DELETE FROM admin_audit_log WHERE created_at < now() - interval '90 days';
