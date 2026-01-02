export const mockOrders = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        order_number: 'HS-4001',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        status: 'processing',
        total: 129999,
        customer_name: 'Rahul Sharma',
        customer_email: 'rahul.s@example.com',
        term_id: '1'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        order_number: 'HS-4000',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        status: 'delivered',
        total: 4999,
        customer_name: 'Priya Patel',
        customer_email: 'priya.p@example.com',
        term_id: '2'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        order_number: 'HS-3999',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        status: 'cancelled',
        total: 89999,
        customer_name: 'Amit Kumar',
        customer_email: 'amit.k@example.com',
        term_id: '3'
    }
];

export const mockProducts = [
    {
        id: '101',
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        base_price: 159900,
        compare_price: 169900,
        category_id: 'electronics',
        is_active: true,
        is_featured: true,
        created_at: new Date().toISOString(),
        images: [{ url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80' }]
    },
    {
        id: '102',
        name: 'MacBook Air M3',
        slug: 'macbook-air-m3',
        base_price: 114900,
        compare_price: 124900,
        category_id: 'laptops',
        is_active: true,
        is_featured: true,
        created_at: new Date().toISOString(),
        images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80' }]
    },
    {
        id: '103',
        name: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        base_price: 26990,
        compare_price: 29990,
        category_id: 'audio',
        is_active: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80' }]
    }
];

export const mockCustomers = [
    {
        id: 'c1',
        email: 'rahul.s@example.com',
        full_name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        avatar_url: '',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        total_orders: 5,
        total_spent: 450000
    },
    {
        id: 'c2',
        email: 'priya.p@example.com',
        full_name: 'Priya Patel',
        phone: '+91 98765 12345',
        avatar_url: '',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        total_orders: 2,
        total_spent: 8500
    }
];

export const mockCategories = [
    {
        id: "cat_1",
        name: "Premium Tech",
        slug: "premium_tech",
        description: "High-end electronics and gadgets for the modern lifestyle.",
        image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
        product_count: 12,
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: "cat_2",
        name: "Audio",
        slug: "audio",
        description: "Immersive sound experiences with top-tier headphones and speakers.",
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
        product_count: 8,
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: "cat_3",
        name: "Fashion",
        slug: "fashion",
        description: "Trendy apparel and accessories for men and women.",
        image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
        product_count: 24,
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: "cat_4",
        name: "Gaming",
        slug: "gaming",
        description: "Consoles, accessories, and games for the ultimate setup.",
        image_url: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
        product_count: 15,
        is_active: true,
        created_at: new Date().toISOString()
    }
];

