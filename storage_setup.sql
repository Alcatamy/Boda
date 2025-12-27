-- Create a public bucket for photos
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Allow public access to view photos
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'photos' );

-- Allow public to upload photos
create policy "Public Upload"
on storage.objects for insert
to public
with check ( bucket_id = 'photos' );

-- Allow admins to delete/update
create policy "Admin Control"
on storage.objects
for all
to authenticated
using ( bucket_id = 'photos' );
