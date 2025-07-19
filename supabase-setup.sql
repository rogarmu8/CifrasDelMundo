-- Create the rooms table
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',
  question_count INTEGER,
  current_question_index INTEGER DEFAULT 0,
  current_question_id TEXT,
  players JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  game_state TEXT NOT NULL DEFAULT 'lobby',
  time_left INTEGER DEFAULT 30,
  show_results BOOLEAN DEFAULT FALSE,
  results JSONB DEFAULT '[]'
);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for simplicity)
-- In production, you might want more restrictive policies
CREATE POLICY "Allow all operations" ON rooms FOR ALL USING (true);

-- Create an index on the id for faster lookups
CREATE INDEX idx_rooms_id ON rooms(id);

-- Create an index on created_at for cleanup operations
CREATE INDEX idx_rooms_created_at ON rooms(created_at); 