-- Add start_date and end_date columns to sprint_items table
-- Run this SQL against the Railway PostgreSQL database

-- Add start_date column
ALTER TABLE sprint_items ADD COLUMN IF NOT EXISTS start_date DATE;

-- Add end_date column
ALTER TABLE sprint_items ADD COLUMN IF NOT EXISTS end_date DATE;

-- Migrate existing due_date data to start_date
UPDATE sprint_items SET start_date = due_date WHERE due_date IS NOT NULL AND start_date IS NULL;

-- Drop the old due_date column
ALTER TABLE sprint_items DROP COLUMN IF EXISTS due_date;

-- Optional: Add indexes for date range queries
CREATE INDEX IF NOT EXISTS idx_sprint_items_start_date ON sprint_items(start_date);
CREATE INDEX IF NOT EXISTS idx_sprint_items_end_date ON sprint_items(end_date);
