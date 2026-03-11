-- =============================================
-- Duracell Hinchas Recargados - Supabase Setup
-- =============================================

-- 1. Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL CHECK (char_length(full_name) >= 3),
  cedula TEXT NOT NULL CHECK (char_length(cedula) BETWEEN 9 AND 13),
  phone TEXT NOT NULL CHECK (char_length(phone) = 10),
  store TEXT NOT NULL,
  invoice_url TEXT NOT NULL,
  prize_type TEXT NOT NULL CHECK (prize_type IN ('cine_en_casa', 'camiseta_ecuador')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_participants_cedula ON participants (cedula);
CREATE INDEX IF NOT EXISTS idx_participants_store ON participants (store);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants (created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Allow anonymous insert
CREATE POLICY "Allow anonymous insert"
  ON participants FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. RLS Policy: Allow service_role full access
CREATE POLICY "Allow service_role full access"
  ON participants FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 6. Storage bucket setup (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', false);

-- 7. Storage policies
-- Allow anonymous upload to invoices bucket
-- CREATE POLICY "Allow anonymous upload" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'invoices');
-- Allow service_role to read from invoices bucket
-- CREATE POLICY "Allow service_role read" ON storage.objects FOR SELECT TO service_role USING (bucket_id = 'invoices');
