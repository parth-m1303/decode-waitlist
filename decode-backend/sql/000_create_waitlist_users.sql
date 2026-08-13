-- Creates the waitlist_users table for the Decode alpha waitlist.
-- Run this BEFORE 001_enforce_waitlist_capacity.sql.

CREATE TABLE public.waitlist_users (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             text        NOT NULL,
  email            text        NOT NULL,
  device_type      text        NOT NULL,
  primary_use_case text,
  preferred_ide    text,
  created_at       timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT waitlist_users_email_unique UNIQUE (email)
);

-- Block direct access via the Supabase Data API (anon / authenticated keys).
-- The backend uses the service-role key, which bypasses RLS.
ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;
