-- Create Guests Table
create table public.guests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text not null,
  email text, -- Optional, for contact
  attending boolean, -- Null = no response yet, True = Yes, False = No
  dietary_restrictions text,
  has_plus_one boolean default false,
  plus_one_name text,
  children_count int default 0,
  message text -- Message to the couple
);

-- Enable Row Level Security (RLS)
alter table public.guests enable row level security;

-- Policy: Allow anyone (anon) to insert specific fields (RSVP)
-- Note: In a stricter production app, you might use an 'invite code' to validate.
-- For this MVP, we allow open RSVPs but restrict reading.
create policy "Allow public inserts"
on public.guests
for insert
to anon
with check (true);

-- Policy: Only authenticated (admins) can view the list
create policy "Enable read access for admins"
on public.guests
for select
to authenticated
using (true);

-- Create Photos Table (for Real-time Gallery)
create table public.photos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  storage_path text not null,
  caption text,
  is_approved boolean default false -- Needs moderation
);

-- Enable RLS
alter table public.photos enable row level security;

-- Policy: Allow public to upload (insert)
create policy "Allow public uploads"
on public.photos
for insert
to anon
with check (true);

-- Policy: Public can view ONLY approved photos
create policy "Allow public to view approved photos"
on public.photos
for select
to anon
using (is_approved = true);

-- Policy: Admins can view all photos
create policy "Admins can view all photos"
on public.photos
for select
to authenticated
using (true);

-- Policy: Admins can update photos (approve/reject)
create policy "Admins can update photos"
on public.photos
for update
to authenticated
using (true);
