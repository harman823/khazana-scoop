-- Run this in the Supabase SQL editor once per project.
-- Prisma manages commerce tables; this file creates Storage buckets and policies.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'product-images',
    'product-images',
    true,
    10485760,
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  ),
  (
    'inventory-images',
    'inventory-images',
    false,
    10485760,
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  ),
  (
    'scoop-photos',
    'scoop-photos',
    false,
    10485760,
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  ),
  (
    'packing-videos',
    'packing-videos',
    false,
    524288000,
    array['video/mp4', 'video/webm', 'video/quicktime']
  ),
  (
    'profile-avatars',
    'profile-avatars',
    true,
    5242880,
    array['image/png', 'image/jpeg', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read for public Mystery Scoop buckets"
on storage.objects
for select
to public
using (bucket_id in ('product-images', 'profile-avatars'));

create policy "Service role manages Mystery Scoop storage"
on storage.objects
for all
to service_role
using (
  bucket_id in ('product-images', 'inventory-images', 'scoop-photos', 'packing-videos', 'profile-avatars')
)
with check (
  bucket_id in ('product-images', 'inventory-images', 'scoop-photos', 'packing-videos', 'profile-avatars')
);
