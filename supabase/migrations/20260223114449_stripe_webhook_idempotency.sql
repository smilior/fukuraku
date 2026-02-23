CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id text PRIMARY KEY,
  processed_at timestamptz DEFAULT now()
);
