-- Run once in the Supabase SQL editor after creating the project.
-- Prisma owns the public application tables; Supabase owns auth and storage.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-assets',
  'product-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Public product assets are readable"
on storage.objects for select
using (bucket_id = 'product-assets');

create policy "Admins can upload product assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-assets'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "Admins can update product uploads"
on storage.objects for update
to authenticated
using (
  bucket_id = 'product-assets'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'product-assets'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "Admins can delete product uploads"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-assets'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
