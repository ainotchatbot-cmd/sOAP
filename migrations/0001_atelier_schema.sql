-- GentleBubble by AR — Cloudflare D1 Relational Schema
-- Synchronizes Google / Firebase Auth collectors, browsing history, paid orders & tracking.

CREATE TABLE IF NOT EXISTS collectors (
  account_id TEXT PRIMARY KEY,
  firebase_uid TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  default_address TEXT,
  gps_label TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'google',
  email_verified INTEGER NOT NULL DEFAULT 0,
  created_at_ms INTEGER NOT NULL,
  last_active_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_collectors_email ON collectors (email);
CREATE INDEX IF NOT EXISTS idx_collectors_uid ON collectors (firebase_uid);

CREATE TABLE IF NOT EXISTS collector_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id TEXT NOT NULL,
  entry_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  price_thb INTEGER,
  viewed_at_ms INTEGER NOT NULL,
  UNIQUE (account_id, entry_id)
);

CREATE INDEX IF NOT EXISTS idx_history_account_time ON collector_history (account_id, viewed_at_ms DESC);

CREATE TABLE IF NOT EXISTS atelier_orders (
  order_number TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  firebase_uid TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  gps_label TEXT,
  engraving_note TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'paid',
  paid_at_ms INTEGER,
  payment_reference TEXT,
  tracking_code TEXT,
  carrier TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  completed_steps_json TEXT NOT NULL DEFAULT '[]',
  items_json TEXT NOT NULL,
  subtotal_thb INTEGER NOT NULL,
  shipping_thb INTEGER NOT NULL,
  total_thb INTEGER NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_email_time ON atelier_orders (customer_email, created_at_ms DESC);
CREATE INDEX IF NOT EXISTS idx_orders_uid_time ON atelier_orders (firebase_uid, created_at_ms DESC);
CREATE INDEX IF NOT EXISTS idx_orders_account_time ON atelier_orders (account_id, created_at_ms DESC);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  lang TEXT NOT NULL DEFAULT 'th',
  topics_json TEXT NOT NULL DEFAULT '[]',
  ad_cookies_accepted INTEGER NOT NULL DEFAULT 0,
  firebase_uid TEXT,
  created_at_ms INTEGER NOT NULL
);
