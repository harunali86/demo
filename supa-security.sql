-- Enable Row Level Security (RLS) on all tables (Safety Net)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES
-- readable by everyone (needed for reviews/names?) OR restricted? 
-- Let's restrict: Public can read basic info? No, only authenticated.
-- User can read own. Admin can read all.
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. ADDRESSES
-- Users can do everything with their own addresses.
DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- 3. PRODUCTS
-- Readable by everyone (public).
DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);

-- Admins can do everything.
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 4. ORDERS
-- Users can view own orders.
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders.
DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view/update all orders.
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 5. STORAGE (Avatars)
-- Allow public read of avatars.
-- Allow authenticated user to upload to own folder (or just 'avatars' bucket generally if filename is unique).
-- For simplicity, assuming 'avatars' bucket is public.
-- If RLS is enabled on storage.objects:
-- CREATE POLICY "Avatar Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
-- CREATE POLICY "Avatar Select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
