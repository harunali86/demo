-- Create a table for coupons
create table public.coupons (
  id uuid not null default gen_random_uuid (),
  code text not null,
  discount_type text null, -- 'percentage' or 'fixed'
  discount_value numeric null,
  min_purchase_amount numeric null default 0,
  usage_limit integer null,
  usage_count integer null default 0,
  expires_at timestamp with time zone null,
  is_active boolean null default true,
  created_at timestamp with time zone not null default now(),
  constraint coupons_pkey primary key (id),
  constraint coupons_code_key unique (code)
) tablespace pg_default;

-- Add RLS policies (optional but recommended)
alter table public.coupons enable row level security;

-- Allow read access to everyone (so checkout can check coupons)
create policy "Enable read access for all users"
on public.coupons for select
to public
using (is_active = true);

-- Allow all access to authenticated admins (simplified for now, assumes service role or logged in)
create policy "Enable all access for authenticated users"
on public.coupons for all
to authenticated
using (true)
with check (true);
