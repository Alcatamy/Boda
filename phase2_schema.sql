-- Create Messages Table (Guestbook)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_name text not null,
  content text not null
);

-- Create Song Requests Table
create table public.song_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_name text not null,
  song_artist text not null,
  status text default 'pending' -- pending, played, rejected
);

-- RLS
alter table public.messages enable row level security;
alter table public.song_requests enable row level security;

create policy "Allow public inserts messages" on public.messages for insert to anon with check (true);
create policy "Allow public read messages" on public.messages for select to anon using (true);

create policy "Allow public inserts songs" on public.song_requests for insert to anon with check (true);
create policy "Allow public read songs" on public.song_requests for select to anon using (true);
