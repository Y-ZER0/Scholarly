-- Migration 002: Add password reset token columns to users table
-- Run this in Supabase SQL Editor

ALTER TABLE users
  ADD COLUMN reset_token_hash   VARCHAR(255),
  ADD COLUMN reset_token_expiry TIMESTAMPTZ;
