-- Add terms_accepted audit columns to participants table
-- Run this migration in your Supabase SQL editor

ALTER TABLE participants
  ADD COLUMN IF NOT EXISTS terms_accepted     BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS terms_accepted_at  TIMESTAMPTZ;
