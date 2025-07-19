# Multiplayer Setup Guide

## Overview
The multiplayer system allows players to create and join rooms to play trivia games together in real-time. Players answer questions using a numeric keyboard, and points are awarded based on accuracy.

## Features
- Create rooms with 6-character room IDs
- Join rooms using room IDs
- Real-time game synchronization
- 30-second timer per question
- Automatic scoring system (2 points for correct, 1 point for closest)
- Endless mode option
- Mobile-responsive design
- One-click room ID copying

## Setup Instructions

### 1. Supabase Configuration

1. Create a new Supabase project at https://supabase.com
2. Get your project URL and anon key from the API settings
3. Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the SQL commands from `supabase-schema.sql`:

```sql
-- Create rooms table for multiplayer functionality
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  question_count INTEGER,
  current_question_index INTEGER DEFAULT 0,
  current_question_id TEXT,
  players JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we're not using authentication)
CREATE POLICY "Allow all operations" ON rooms FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_created_at ON rooms(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_rooms_updated_at 
    BEFORE UPDATE ON rooms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Enable Realtime

1. In your Supabase dashboard, go to Database > Replication
2. Enable realtime for the `rooms` table
3. This allows real-time updates when players join, answer questions, etc.

### 4. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 5. Run the Application

```bash
npm run dev
```

## How to Play

### Creating a Room
1. Go to `/multiplayer`
2. Enter your name
3. Choose question count or enable endless mode
4. Click "Create Room"
5. Share the 6-character room ID with other players (click the 📋 button to copy)

### Joining a Room
1. Go to `/multiplayer`
2. Enter your name
3. Enter the 6-character room ID provided by the host
4. Click "Join Room"

### Game Flow
1. **Lobby**: Players wait for the host to start
2. **Playing**: Questions appear with a 30-second timer
3. **Answering**: Use the numeric keyboard to submit answers
4. **Results**: See who got correct answers and points awarded
5. **Next Question**: Automatically proceeds after 3 seconds

## Scoring System
- **Correct Answer**: 2 points
- **Closest Answer**: 1 point (if no one got it correct)
- **Wrong Answer**: 0 points

## Technical Details

### Real-time Updates
The system uses Supabase's real-time subscriptions to sync game state across all players in a room.

### Data Structure
- **Room**: Contains game state, player list, and current question
- **Player**: Contains name, score, host status, and current answer
- **Game States**: 'waiting', 'playing', 'finished'

### Room IDs
- 6-character alphanumeric codes (A-Z, 0-9)
- Generated randomly when creating a room
- Easy to share and remember
- Displayed prominently in the lobby with copy functionality

### Security
- Row Level Security is enabled but allows all operations since we're not using authentication
- Room IDs are generated using a custom algorithm for uniqueness
- Player IDs are generated using `crypto.randomUUID()`

## Troubleshooting

### Common Issues
1. **Room not found**: Check that the room ID is correct (6 characters, case-sensitive)
2. **Game not starting**: Ensure the host is present and there are at least 2 players
3. **Real-time not working**: Verify that realtime is enabled for the rooms table in Supabase

### Environment Variables
Make sure your `.env.local` file contains the correct Supabase credentials and that the variables are prefixed with `NEXT_PUBLIC_` for client-side access.

## Future Enhancements
- User authentication
- Persistent user profiles
- Leaderboards
- Custom question sets
- Voice chat integration
- Spectator mode 