-- Add images column to reviews table
alter table public.reviews add column images text[] default '{}';

-- Create storage bucket if it doesn't exist (this usually needs to be done via dashboard, but RLS policies can be added here)
-- Note: You MUST create a public bucket named 'review-images' in the dashboard.

-- Allow public access to review images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'review-images' );

-- Allow authenticated users to upload images
create policy "Authenticated Users Upload"
  on storage.objects for insert
  with check ( bucket_id = 'review-images' and auth.role() = 'authenticated' );
