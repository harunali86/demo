-- Harun Store - Complete Schema Migration for Extra Features
-- Run this in Supabase SQL Editor to fix missing tables

-- 1. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_name TEXT -- Cached name for easier display
);

-- Enable RLS for Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Review Policies
CREATE POLICY "Public can view reviews" 
ON public.reviews FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" 
ON public.reviews FOR UPDATE 
USING (auth.uid() = user_id);

-- 2. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Enable RLS for Wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Wishlist Policies
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
  ON public.wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
  ON public.wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- 3. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT, -- 'percentage' or 'fixed'
  discount_value NUMERIC,
  min_purchase_amount NUMERIC DEFAULT 0,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for Coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Coupon Policies
CREATE POLICY "Enable read access for all users"
ON public.coupons FOR SELECT
USING (is_active = true);

-- 4. STORAGE POLICIES (Review Images)
-- Note: You must ensure a bucket named 'review-images' exists in Storage first!

-- Allow public access to review images
BEGIN; 
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('review-images', 'review-images', true)
  ON CONFLICT (id) DO NOTHING;
COMMIT;

CREATE POLICY "Public Access Review Images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'review-images' );

CREATE POLICY "Authenticated Users Upload Review Images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'review-images' AND auth.role() = 'authenticated' );
