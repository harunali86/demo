import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/data/products';
import ProductClient from './ProductClient';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'] & {
    images: { url: string }[] | null;
};

// Fetch product data (shared between page and metadata)
async function getProduct(slug: string): Promise<Product | null> {
    // Check local constants first (for demo data)
    const localMatch = PRODUCTS.find(p => p.name.toLowerCase().replace(/ /g, '-') === slug);
    if (localMatch) {
        return {
            id: localMatch.id,
            name: localMatch.name,
            slug: slug,
            description: 'Experience premium quality with our flagship collection. Designed for excellence and crafted with precision.',
            base_price: localMatch.price,
            compare_price: localMatch.sale || null,
            category_id: localMatch.cat,
            images: [{ url: localMatch.img }],
            is_featured: true,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            seller_id: null,
            metadata: {},
        } as Product;
    }

    // Fetch from Supabase
    const { data } = await supabase
        .from('products')
        .select('*, images(url)')
        .eq('slug', slug)
        .single();

    return data ? (data as Product) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found | Harun Store',
        };
    }

    const imageUrl = product.images?.[0]?.url || '/logo.png';

    return {
        title: product.name,
        description: product.description || `Buy ${product.name} at the best price on Harun Store.`,
        openGraph: {
            title: product.name,
            description: product.description || `Buy ${product.name} at the best price on Harun Store.`,
            images: [{ url: imageUrl }],
            type: 'website',
        },
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images?.[0]?.url,
        description: product.description,
        offers: {
            '@type': 'Offer',
            price: product.base_price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductClient product={product} />
        </>
    );
}
