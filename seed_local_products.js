const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/home/harun/.gemini/antigravity/scratch/enterprise-ecommerce/.env' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateProducts = () => {
    const categories = [
        { id: 'tech', prefix: 'tech' },
        { id: 'fashion', prefix: 'fashion' },
        { id: 'watches', prefix: 'watch' },
        { id: 'audio', prefix: 'audio' },
        { id: 'sneakers', prefix: 'sneaker' }
    ];

    let products = [];

    // Tech
    products.push(
        { name: 'MacBook Pro M3 Max', price: 249000, cat: 'tech', img: 'tech_1.jpg' },
        { name: 'iPhone 15 Pro Titanium', price: 149000, cat: 'tech', img: 'tech_2.jpg' },
        { name: 'iPad Pro 12.9"', price: 119000, cat: 'tech', img: 'tech_3.jpg' },
        { name: 'Dell XPS 15', price: 189000, cat: 'tech', img: 'tech_4.jpg' }
    );

    // Fashion
    products.push(
        { name: 'Designer Summer Dress', price: 4999, cat: 'fashion', img: 'fashion_1.jpg' },
        { name: 'Urban Streetwear Hoodie', price: 2999, cat: 'fashion', img: 'fashion_2.jpg' },
        { name: 'Classic Denim Jacket', price: 3499, cat: 'fashion', img: 'fashion_3.jpg' },
        { name: 'Formal Blazer Slim Fit', price: 7999, cat: 'fashion', img: 'fashion_4.jpg' }
    );

    // Watches
    products.push(
        { name: 'Classic Chronograph', price: 14999, cat: 'watches', img: 'watch_1.jpg' },
        { name: 'Smart Fitness Pro', price: 5999, cat: 'watches', img: 'watch_2.jpg' },
        { name: 'Luxury Auto Watch', price: 49999, cat: 'watches', img: 'watch_3.jpg' },
        { name: 'Minimalist Gold', price: 8999, cat: 'watches', img: 'watch_4.jpg' }
    );

    // Audio
    products.push(
        { name: 'Sony WH-1000XM5', price: 29990, cat: 'audio', img: 'audio_1.jpg' },
        { name: 'Nothing Ear (2)', price: 9999, cat: 'audio', img: 'audio_2.jpg' },
        { name: 'Bose QuietComfort', price: 24990, cat: 'audio', img: 'audio_3.jpg' },
        { name: 'Marshall Speaker', price: 19999, cat: 'audio', img: 'audio_4.jpg' }
    );

    // Sneakers
    products.push(
        { name: 'Nike Air Max 270', price: 13995, cat: 'sneakers', img: 'sneaker_1.jpg' },
        { name: 'Adidas Ultraboost', price: 17999, cat: 'sneakers', img: 'sneaker_2.jpg' },
        { name: 'Jordan 1 Retro', price: 19999, cat: 'sneakers', img: 'sneaker_3.jpg' },
        { name: 'Puma RS-X', price: 8999, cat: 'sneakers', img: 'sneaker_4.jpg' }
    );

    return products.map((p) => ({
        name: p.name,
        slug: p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description: `Premium ${p.name} designed for excellence. High quality materials and superior craftsmanship.`,
        base_price: p.price,
        compare_price: Math.round(p.price * 1.2),
        category_id: p.cat,
        images: [{ url: `/products/${p.img}` }],
        is_featured: true,
        is_active: true
    }));
};

async function seed() {
    console.log('Clearing existing products...');
    const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) console.error('Delete error:', deleteError);

    const products = generateProducts();

    console.log(`Seeding ${products.length} products...`);
    const { data, error } = await supabase.from('products').insert(products).select();

    if (error) {
        console.error('Error inserting products:', error);
    } else {
        console.log(`Successfully inserted ${data.length} products!`);
    }
}

seed();
