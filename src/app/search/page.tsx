'use client';

import { useSearchParams } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Suspense } from 'react';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';

    // Get filter params
    const maxPrice = searchParams.get('max_price');
    const saleOnly = searchParams.get('sale') === 'true';
    const sortBy = searchParams.get('sort');
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
        <div className="min-h-screen bg-[#f1f3f6]">
            <Navbar />

            <main className="py-2 px-2 max-w-[1600px] mx-auto">
                <div className="flex gap-2">
                    {/* Sidebar Filters (Desktop) */}
                    <div className="hidden lg:block w-[270px] bg-white shadow-sm border border-gray-200 min-h-[80vh] flex-shrink-0 self-start">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                            <button className="text-xs text-primary font-medium uppercase">Clear All</button>
                        </div>

                        {/* Price */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-800 uppercase text-[12px] tracking-wide">Price</h3>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="h-1 bg-gray-200 rounded-full mb-4 relative">
                                <div className="absolute left-0 w-1/2 h-full bg-primary rounded-full"></div>
                                <div className="absolute left-1/2 w-4 h-4 bg-white border border-gray-300 rounded-full top-1/2 -translate-y-1/2 shadow-sm cursor-pointer"></div>
                            </div>
                            <div className="flex gap-2">
                                <select className="flex-1 border border-gray-300 text-sm p-1 rounded-sm bg-white">
                                    <option>Min</option>
                                    <option>₹500</option>
                                </select>
                                <span className="text-gray-400">to</span>
                                <select className="flex-1 border border-gray-300 text-sm p-1 rounded-sm bg-white">
                                    <option>₹10000+</option>
                                </select>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-800 uppercase text-[12px] tracking-wide">Categories</h3>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="space-y-2 pl-2">
                                {['Mobiles', 'Electronics', 'Fashion', 'Home'].map(c => (
                                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary" />
                                        <span className="text-sm text-gray-700">{c}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Customer Ratings */}
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-sm font-medium text-gray-800 uppercase text-[12px] tracking-wide mb-2">Customer Ratings</h3>
                            <div className="space-y-1">
                                {[4, 3, 2, 1].map(r => (
                                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary" />
                                        <span className="text-sm text-gray-700">{r}★ & above</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1 bg-white shadow-sm border border-gray-200 min-h-[80vh]">
                        {/* Sort Bar */}
                        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                            <span className="font-medium text-gray-900">Sort By</span>
                            {['Relevance', 'Popularity', 'Price -- Low to High', 'Price -- High to Low', 'Newest First'].map((s, i) => (
                                <button
                                    key={s}
                                    className={`text-sm ${i === 0 ? 'text-primary font-medium border-b-2 border-primary pb-0.5' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Search Query Info */}
                        {query && (
                            <div className="p-4 pb-0">
                                <h1 className="text-lg font-medium">
                                    Results for "{query}" <span className="text-gray-500 text-sm">({results.length} items)</span>
                                </h1>
                            </div>
                        )}

                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                                {results.map((product, i) => (
                                    <ProductCard key={product.id} {...product} index={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <img
                                    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png"
                                    alt="No Results"
                                    className="w-64 h-auto mb-4"
                                />
                                <h2 className="text-xl font-medium text-gray-900 mb-2">Sorry, no results found!</h2>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    Please check the spelling or try searching for something else
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f1f3f6]" />}>
            <SearchResults />
        </Suspense>
    );
}
