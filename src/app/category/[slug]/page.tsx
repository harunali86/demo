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
        // Newest default logic

        return result;
    }, [baseProducts, priceRange, sortBy]);

    const categoryName = slug.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="min-h-screen bg-[#f1f3f6] font-sans">
            <Navbar />

            <div className="pt-20 pb-8 px-2 max-w-[1600px] mx-auto flex gap-2">

                {/* Sidebar - Desktop (Always Visible) & Mobile (Toggle) */}
                <div className={`
                    fixed inset-0 z-40 bg-black/50 md:static md:bg-transparent md:block md:w-[280px] md:shrink-0
                    ${mobileFilterOpen ? 'block' : 'hidden'}
                `} onClick={() => setMobileFilterOpen(false)}>
                    <div
                        className="h-full w-[280px] md:w-full bg-white md:rounded-sm shadow-sm p-4 overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <SidebarFilter
                            minPrice={0}
                            maxPrice={300000}
                            onPriceChange={(min, max) => setPriceRange({ min, max })}
                            onSortChange={setSortBy}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header & Mobile Toggle */}
                    <div className="bg-white p-4 mb-2 shadow-sm rounded-sm flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-medium text-gray-900">
                                {categoryName}
                                <span className="text-xs text-gray-500 ml-2 font-normal">
                                    (Showing {filteredProducts.length} items)
                                </span>
                            </h1>
                        </div>
                        <button
                            onClick={() => setMobileFilterOpen(true)}
                            className="md:hidden flex items-center gap-2 text-sm font-medium text-blue-600"
                        >
                            <Menu className="w-4 h-4" />
                            Filters
                        </button>
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                            {filteredProducts.map((product, i) => (
                                <ProductCard key={product.id} {...product} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 text-center rounded-sm shadow-sm">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                                <span className="text-4xl">🛍️</span>
                            </div>
                            <h2 className="text-xl font-medium text-gray-900 mb-2">No Products Found</h2>
                            <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
