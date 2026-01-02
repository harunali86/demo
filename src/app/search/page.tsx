'use client';

import { useSearchParams } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import Navbar from '@/components/ui/Navbar';
import { Search } from 'lucide-react';
import { Suspense } from 'react';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';

    // Get filter params
    const maxPrice = searchParams.get('max_price');
    const saleOnly = searchParams.get('sale') === 'true';
    const sortBy = searchParams.get('sort');
    const minRating = searchParams.get('min_rating');
    const fastDelivery = searchParams.get('fast_delivery') === 'true';

    // Filter logic with all params
    let results = PRODUCTS.filter(p => {
        // Text search
        const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.cat.toLowerCase().includes(query);

        // Price filter
        const matchesPrice = !maxPrice || p.price <= parseInt(maxPrice);

        // Sale filter (products with a sale price)
        const matchesSale = !saleOnly || (p.sale !== null && p.sale > p.price);

        // Fast Delivery - simulate by filtering products under 10000
        const matchesFastDelivery = !fastDelivery || p.price < 10000;

        return matchesQuery && matchesPrice && matchesSale && matchesFastDelivery;
    });

    // Sorting
    if (sortBy === 'newest') {
        // Simulate newest by reversing (in production, use created_at)
        results = [...results].reverse();
    } else if (sortBy === 'popular') {
        // Simulate popular by items with sale tags first
        results = [...results].sort((a, b) => (b.sale ? 1 : 0) - (a.sale ? 1 : 0));
    } else if (sortBy === 'price_low') {
        results = [...results].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
        results = [...results].sort((a, b) => b.price - a.price);
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
            <Navbar />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Search Results</p>

                    {/* Search Input for Mobile/All */}
                    <div className="mb-6 relative max-w-xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            defaultValue={query} // Use defaultValue so it's editable
                            placeholder="What are you looking for?"
                            className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    window.location.href = `/search?q=${e.currentTarget.value}`;
                                }
                            }}
                            autoFocus // Helpful for mobile users landing here
                        />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold">
                        "{query}" <span className="text-gray-500 text-2xl">({results.length} items)</span>
                    </h1>
                </div>

                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {results.map((product, i) => (
                            <ProductCard key={product.id} {...product} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border border-white/10">
                        <div className="p-6 rounded-full bg-white/5 mb-4">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No matches found</h2>
                        <p className="text-gray-400 max-w-md mx-auto">
                            We couldn't find any products matching "{query}". Try checking for typos or using broader terms.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <SearchResults />
        </Suspense>
    );
}
