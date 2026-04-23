-- Add password column for owner login.
-- Run this in Supabase SQL Editor.
--
-- NOTE: In production, store password hashes instead of plaintext.
-- This project currently uses simple plaintext for simplicity.

alter table public.owners
add column if not exists password text;

-- Optional: set default password for existing owners that don't have one
update public.owners
set password = '123456'
where password is null;

