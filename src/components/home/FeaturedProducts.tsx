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
        <section className="bg-[#1a1a1a] py-5 rounded-lg">
            <div className="px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[18px] sm:text-[21px] font-bold text-[#e3e6e6]">
                        {hasFilters ? `Results (${featured.length})` : 'Popular Products'}
                    </h2>
                    <Link
                        href="/shop"
                        className="flex items-center gap-1 text-[12px] sm:text-[13px] text-[#56c5d3] hover:text-[#febd69] hover:underline"
                    >
                        See all deals
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {featured.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {featured.map((product, i) => (
                            <ProductCard key={product.id} {...product} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-[#999]">No products match your filters</p>
                        <Link href="/" className="text-[#56c5d3] hover:underline mt-2 inline-block">
                            Clear Filters
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
