// Script to set user as admin
// Run with: node scripts/set-admin.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lznyzfopogwqqgpsboku.supabase.co';
// We need the service role key for admin operations
// The anon key won't work for updating auth.users

console.log(`
=====================================
MANUAL SQL REQUIRED IN SUPABASE
=====================================

Please run this SQL in Supabase SQL Editor (https://supabase.com/dashboard/project/lznyzfopogwqqgpsboku/sql/new):

-- Step 1: Confirm email
UPDATE auth.users 
SET email_confirmed_at = NOW(), confirmed_at = NOW() 
WHERE email = 'harun@gmail.com';

-- Step 2: Set as admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'harun@gmail.com');

-- Step 3: Verify
SELECT email, email_confirmed_at, role FROM auth.users u 
LEFT JOIN public.profiles p ON u.id = p.id 
WHERE email = 'harun@gmail.com';

=====================================
`);
