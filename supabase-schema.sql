-- Run this in your Supabase SQL editor

-- Create inquiries table
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  service text not null,
  budget text default 'Not specified',
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.inquiries enable row level security;

-- Allow anyone to INSERT (contact form submissions)
create policy "Anyone can submit inquiry"
  on public.inquiries
  for insert
  to anon
  with check (true);

-- Only authenticated admins can SELECT, UPDATE, DELETE
create policy "Admins can read inquiries"
  on public.inquiries
  for select
  to authenticated
  using (true);

create policy "Admins can update inquiries"
  on public.inquiries
  for update
  to authenticated
  using (true);

create policy "Admins can delete inquiries"
  on public.inquiries
  for delete
  to authenticated
  using (true);

-- Index for performance
create index if not exists inquiries_created_at_idx on public.inquiries(created_at desc);
create index if not exists inquiries_status_idx on public.inquiries(status);
