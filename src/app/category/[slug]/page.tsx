'use client';

import { use, useState, useMemo } from 'react';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import Navbar from '@/components/ui/Navbar';
import SidebarFilter from '@/components/ui/SidebarFilter';
import { Menu } from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    // Initial basic filtering
    const baseProducts = useMemo(() => PRODUCTS.filter(p => p.cat === slug), [slug]);

    // State for advanced filtering
    const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
    const [sortBy, setSortBy] = useState('newest');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let result = baseProducts.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        if (sortBy === 'price_low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_high') {
            result.sort((a, b) => b.price - a.price);
        }
        // Newest default (no specific date in mock data so assume file order/index, logic can be added later)

        return result;
    }, [baseProducts, priceRange, sortBy]);

    const categoryName = slug.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
            <Navbar />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    className="md:hidden flex items-center justify-center gap-2 bg-white/10 p-3 rounded-lg font-bold mb-4"
                >
                    <Menu className="w-5 h-5" />
                    Filters & Sort
                </button>

                {/* Sidebar - Desktop (Always Visible) & Mobile (Toggle) */}
                <div className={`${mobileFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-auto`}>
                    <SidebarFilter
                        minPrice={0}
                        maxPrice={300000}
                        onPriceChange={(min, max) => setPriceRange({ min, max })}
                        onSortChange={setSortBy}
                    />
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-8">
                        <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Collection</p>
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                            {categoryName}
                        </h1>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, i) => (
                                <ProductCard key={product.id} {...product} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border border-white/10">
                            <div className="p-6 rounded-full bg-white/5 mb-4">
                                <span className="text-4xl">🛍️</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">No Products in Range</h2>
                            <p className="text-gray-400">Try adjusting your price filter.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
