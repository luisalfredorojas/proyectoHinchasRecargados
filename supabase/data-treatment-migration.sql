-- Add data treatment consent fields to participants table
-- Run this migration in your Supabase SQL editor

ALTER TABLE participants
  ADD COLUMN IF NOT EXISTS data_treatment_accepted     BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS data_treatment_accepted_at  TIMESTAMPTZ;
