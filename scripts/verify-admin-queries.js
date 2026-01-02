const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyQueries() {
    console.log('--- Verifying Admin Queries ---');

    console.log('\n1. Fetching Products (Simple)...');
    const { data: products, error: productError } = await supabase
        .from('products')
        .select('*')
        .limit(5);

    if (productError) {
        console.error('FAIL: Products fetch failed:', productError.message);
    } else {
        console.log(`SUCCESS: Fetched ${products.length} products`);
        if (products.length > 0) {
            console.log('Sample Product:', products[0].name);

            console.log('\n2. Fetching Images for Sample Product...');
            const { data: images, error: imageError } = await supabase
                .from('product_images')
                .select('url')
                .eq('product_id', products[0].id);

            if (imageError) {
                console.error('FAIL: Image fetch failed:', imageError.message);
            } else {
                console.log(`SUCCESS: Fetched ${images.length} images for product`);
            }
        }
    }

    console.log('\n2.5 Verifying Profiles Table...');
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profilesError) {
        console.error('FAIL: Profiles fetch failed:', profilesError.message);
    } else {
        console.log(`SUCCESS: Profiles table accessible. Found ${profiles.length} profiles.`);
    }

    console.log('\n3. Verifying Orders Table...');
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .limit(1);

    if (ordersError) {
        console.error('FAIL: Orders fetch failed:', ordersError.message);
        if (ordersError.message.includes('schema cache')) {
            console.error('CRITICAL: Table "orders" might differ from schema cache or missing.');
        }
    } else {
        console.log(`SUCCESS: Orders table accessible. Found ${orders.length} orders.`);
    }

    console.log('\n-------------------------------');
}

verifyQueries();
