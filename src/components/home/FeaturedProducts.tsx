'use client';

import { PRODUCTS } from '@/data/products';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../ui/ProductCard';

export default function FeaturedProducts() {
    const searchParams = useSearchParams();

    const maxPrice = searchParams.get('max_price');
    const saleOnly = searchParams.get('sale') === 'true';
    const sortBy = searchParams.get('sort');
    const fastDelivery = searchParams.get('fast_delivery') === 'true';

    const hasFilters = maxPrice || saleOnly || sortBy || fastDelivery;

    let filtered = PRODUCTS.filter(p => {
        const matchesPrice = !maxPrice || p.price <= parseInt(maxPrice);
        const matchesSale = !saleOnly || (p.sale !== null && p.sale > p.price);
        const matchesFastDelivery = !fastDelivery || p.price < 10000;
        return matchesPrice && matchesSale && matchesFastDelivery;
    });

    if (sortBy === 'newest') filtered = [...filtered].reverse();
    else if (sortBy === 'popular') filtered = [...filtered].sort((a, b) => (b.sale ? 1 : 0) - (a.sale ? 1 : 0));
    else if (sortBy === 'price_low') filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_high') filtered = [...filtered].sort((a, b) => b.price - a.price);

    const featured = hasFilters ? filtered : filtered.slice(0, 10);

    return (
        <section className="bg-white py-4 md:py-6 shadow-sm border-b border-gray-200">
            <div className="max-w-[1248px] mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[18px] sm:text-[22px] font-bold text-gray-900">
                        {hasFilters ? `Results (${featured.length})` : 'Best of Electronics'}
                    </h2>
                    <Link
                        href="/shop"
                        className="flex items-center justify-center bg-primary hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2 rounded-[2px] shadow-sm transition-colors"
                    >
                        VIEW ALL
                    </Link>
                </div>

                {featured.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {featured.map((product, i) => (
                            <ProductCard key={product.id} {...product} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white">
                        <p className="text-gray-500">No products match your filters</p>
                        <Link href="/" className="text-primary hover:underline mt-2 inline-block">
                            Clear Filters
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
