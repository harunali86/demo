import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://harunstore.com';

    // Static pages
    const staticPages = [
        '',
        '/products',
        '/cart',
        '/wishlist',
        '/login',
        '/register',
        '/about',
        '/contact',
        '/help',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic product pages
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const { data: products } = await supabase
            .from('products')
            .select('slug, updated_at')
            .eq('is_active', true);

        if (products) {
            productPages = (products as any[]).map((product) => ({
                url: `${baseUrl}/product/${product.slug}`,
                lastModified: new Date(product.updated_at || new Date()),
                changeFrequency: 'daily' as const,
                priority: 0.9,
            }));
        }
    } catch (error) {
        console.error('Error fetching products for sitemap:', error);
    }

    // Dynamic category pages
    let categoryPages: MetadataRoute.Sitemap = [];
    try {
        const { data: categories } = await supabase
            .from('categories')
            .select('slug')
            .eq('is_active', true);

        if (categories) {
            categoryPages = (categories as any[]).map((category) => ({
                url: `${baseUrl}/category/${category.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
        }
    } catch (error) {
        console.error('Error fetching categories for sitemap:', error);
    }

    return [...staticPages, ...productPages, ...categoryPages];
}
