-- Create pings table for uptime tracking
CREATE TABLE IF NOT EXISTS pings (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'ok',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_pings_timestamp ON pings(timestamp);
CREATE INDEX IF NOT EXISTS idx_pings_status ON pings(status);
