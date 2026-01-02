// Database Types - Generated from Supabase
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    role: 'customer' | 'seller' | 'admin';
                    first_name: string | null;
                    last_name: string | null;
                    phone: string | null;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    role?: 'customer' | 'seller' | 'admin';
                    first_name?: string | null;
                    last_name?: string | null;
                    phone?: string | null;
                    avatar_url?: string | null;
                };
                Update: {
                    role?: 'customer' | 'seller' | 'admin';
                    first_name?: string | null;
                    last_name?: string | null;
                    phone?: string | null;
                    avatar_url?: string | null;
                };
            };
            addresses: {
                Row: {
                    id: string;
                    user_id: string;
                    is_default: boolean;
                    name: string;
                    phone: string | null;
                    address_line1: string;
                    address_line2: string | null;
                    city: string;
                    state: string | null;
                    postal_code: string | null;
                    country: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    is_default?: boolean;
                    name: string;
                    phone?: string | null;
                    address_line1: string;
                    address_line2?: string | null;
                    city: string;
                    state?: string | null;
                    postal_code?: string | null;
                    country?: string;
                };
                Update: {
                    is_default?: boolean;
                    name?: string;
                    phone?: string | null;
                    address_line1?: string;
                    address_line2?: string | null;
                    city?: string;
                    state?: string | null;
                    postal_code?: string | null;
                };
            };
            categories: {
                Row: {
                    id: string;
                    parent_id: string | null;
                    name: string;
                    slug: string;
                    image_url: string | null;
                    is_active: boolean;
                    sort_order: number;
                };
                Insert: {
                    id?: string;
                    parent_id?: string | null;
                    name: string;
                    slug: string;
                    image_url?: string | null;
                    is_active?: boolean;
                    sort_order?: number;
                };
                Update: {
                    parent_id?: string | null;
                    name?: string;
                    slug?: string;
                    image_url?: string | null;
                    is_active?: boolean;
                    sort_order?: number;
                };
            };
            products: {
                Row: {
                    id: string;
                    seller_id: string | null;
                    category_id: string | null;
                    name: string;
                    slug: string;
                    description: string | null;
                    base_price: number;
                    compare_price: number | null;
                    is_active: boolean;
                    is_featured: boolean;
                    metadata: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    seller_id?: string | null;
                    category_id?: string | null;
                    name: string;
                    slug: string;
                    description?: string | null;
                    base_price: number;
                    compare_price?: number | null;
                    is_active?: boolean;
                    is_featured?: boolean;
                    metadata?: Json;
                };
                Update: {
                    seller_id?: string | null;
                    category_id?: string | null;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    base_price?: number;
                    compare_price?: number | null;
                    is_active?: boolean;
                    is_featured?: boolean;
                    metadata?: Json;
                };
            };
            product_variants: {
                Row: {
                    id: string;
                    product_id: string;
                    sku: string;
                    name: string | null;
                    price: number;
                    stock_quantity: number;
                    options: Json;
                    is_active: boolean;
                };
                Insert: {
                    id?: string;
                    product_id: string;
                    sku: string;
                    name?: string | null;
                    price: number;
                    stock_quantity?: number;
                    options?: Json;
                    is_active?: boolean;
                };
                Update: {
                    name?: string | null;
                    price?: number;
                    stock_quantity?: number;
                    options?: Json;
                    is_active?: boolean;
                };
            };
            product_images: {
                Row: {
                    id: string;
                    product_id: string;
                    url: string;
                    is_primary: boolean;
                    sort_order: number;
                };
                Insert: {
                    id?: string;
                    product_id: string;
                    url: string;
                    is_primary?: boolean;
                    sort_order?: number;
                };
                Update: {
                    url?: string;
                    is_primary?: boolean;
                    sort_order?: number;
                };
            };
            carts: {
                Row: {
                    id: string;
                    user_id: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                };
                Update: {
                    updated_at?: string;
                };
            };
            cart_items: {
                Row: {
                    id: string;
                    cart_id: string;
                    variant_id: string;
                    quantity: number;
                };
                Insert: {
                    id?: string;
                    cart_id: string;
                    variant_id: string;
                    quantity?: number;
                };
                Update: {
                    quantity?: number;
                };
            };
            wishlist: {
                Row: {
                    id: string;
                    user_id: string;
                    product_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    product_id: string;
                };
                Update: never;
            };
            orders: {
                Row: {
                    id: string;
                    order_number: string;
                    user_id: string;
                    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
                    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
                    subtotal: number;
                    discount: number;
                    tax: number;
                    shipping: number;
                    total: number;
                    shipping_address: Json;
                    billing_address: Json | null;
                    coupon_id: string | null;
                    payment_provider: string | null;
                    payment_id: string | null;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    order_number?: string;
                    user_id: string;
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
                    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
                    subtotal: number;
                    discount?: number;
                    tax?: number;
                    shipping?: number;
                    total: number;
                    shipping_address: Json;
                    billing_address?: Json | null;
                    coupon_id?: string | null;
                    payment_provider?: string | null;
                    payment_id?: string | null;
                    notes?: string | null;
                };
                Update: {
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
                    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
                    payment_provider?: string | null;
                    payment_id?: string | null;
                    notes?: string | null;
                };
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    variant_id: string;
                    product_snapshot: Json;
                    quantity: number;
                    unit_price: number;
                    total: number;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    variant_id: string;
                    product_snapshot: Json;
                    quantity: number;
                    unit_price: number;
                    total: number;
                };
                Update: never;
            };
            order_tracking: {
                Row: {
                    id: string;
                    order_id: string;
                    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
                    message: string | null;
                    location: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
                    message?: string | null;
                    location?: string | null;
                };
                Update: never;
            };
            reviews: {
                Row: {
                    id: string;
                    product_id: string;
                    user_id: string;
                    rating: number;
                    title: string | null;
                    content: string | null;
                    images: string[] | null;
                    is_approved: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    product_id: string;
                    user_id: string;
                    rating: number;
                    title?: string | null;
                    content?: string | null;
                    images?: string[] | null;
                    is_approved?: boolean;
                };
                Update: {
                    rating?: number;
                    title?: string | null;
                    content?: string | null;
                    images?: string[] | null;
                    is_approved?: boolean;
                };
            };
            banners: {
                Row: {
                    id: string;
                    title: string;
                    image_url: string;
                    link_url: string | null;
                    is_active: boolean;
                    sort_order: number;
                    starts_at: string | null;
                    ends_at: string | null;
                };
                Insert: {
                    id?: string;
                    title: string;
                    image_url: string;
                    link_url?: string | null;
                    is_active?: boolean;
                    sort_order?: number;
                    starts_at?: string | null;
                    ends_at?: string | null;
                };
                Update: {
                    title?: string;
                    image_url?: string;
                    link_url?: string | null;
                    is_active?: boolean;
                    sort_order?: number;
                    starts_at?: string | null;
                    ends_at?: string | null;
                };
            };
            coupons: {
                Row: {
                    id: string;
                    code: string;
                    type: 'percentage' | 'fixed';
                    value: number;
                    min_order: number | null;
                    max_discount: number | null;
                    usage_limit: number | null;
                    usage_count: number;
                    expires_at: string | null;
                    is_active: boolean;
                };
                Insert: {
                    id?: string;
                    code: string;
                    type: 'percentage' | 'fixed';
                    value: number;
                    min_order?: number | null;
                    max_discount?: number | null;
                    usage_limit?: number | null;
                    usage_count?: number;
                    expires_at?: string | null;
                    is_active?: boolean;
                };
                Update: {
                    code?: string;
                    type?: 'percentage' | 'fixed';
                    value?: number;
                    min_order?: number | null;
                    max_discount?: number | null;
                    usage_limit?: number | null;
                    usage_count?: number;
                    expires_at?: string | null;
                    is_active?: boolean;
                };
            };
        };
    };
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Address = Database['public']['Tables']['addresses']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
export type ProductImage = Database['public']['Tables']['product_images']['Row'];
export type Cart = Database['public']['Tables']['carts']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type Wishlist = Database['public']['Tables']['wishlist']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderTracking = Database['public']['Tables']['order_tracking']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Banner = Database['public']['Tables']['banners']['Row'];
export type Coupon = Database['public']['Tables']['coupons']['Row'];

// Extended types with relations
export interface ProductWithDetails extends Product {
    category?: Category;
    variants?: ProductVariant[];
    images?: ProductImage[];
    reviews?: Review[];
}

export interface CartItemWithDetails extends CartItem {
    variant: ProductVariant & {
        product: Product & {
            images: ProductImage[];
        };
    };
}

export interface OrderWithDetails extends Order {
    items: OrderItem[];
    tracking: OrderTracking[];
}
