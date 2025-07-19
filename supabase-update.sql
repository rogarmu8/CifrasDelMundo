-- Update script to add new columns to existing rooms table
-- Run this in your Supabase SQL editor

-- Add new columns for centralized game state management
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS game_state TEXT NOT NULL DEFAULT 'lobby';

ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS time_left INTEGER DEFAULT 30;

ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS show_results BOOLEAN DEFAULT FALSE;

ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS results JSONB DEFAULT '[]';

-- Update existing rooms to have the correct default state
UPDATE rooms 
SET game_state = 'lobby', 
    time_left = 30, 
    show_results = FALSE, 
    results = '[]'::jsonb 
WHERE game_state IS NULL; 