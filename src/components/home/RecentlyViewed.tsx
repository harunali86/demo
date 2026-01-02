'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRecentlyViewedStore } from '@/store/recentlyViewed';

export default function RecentlyViewed() {
    const { items, clearAll } = useRecentlyViewedStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || items.length === 0) return null;

    return (
        <section className="bg-white py-6 border-t border-gray-200 mt-4">
            <div className="max-w-[1248px] mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[20px] font-medium text-gray-900">
                        Recently Viewed
                    </h2>
                    <button
                        onClick={clearAll}
                        className="text-[13px] font-medium text-gray-500 hover:text-primary transition-colors uppercase"
                    >
                        Clear All
                    </button>
                </div>

                {/* Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {items.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex-shrink-0"
                        >
                            <Link
                                href={`/product/${(product.name || '').toLowerCase().replace(/ /g, '-')}`}
                                className="block w-48 border border-gray-200 hover:shadow-lg rounded-sm p-4 bg-white transition-all group"
                            >
                                {/* Image */}
                                <div className="relative aspect-square mb-3">
                                    <Image
                                        src={product.img || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000'}
                                        alt={product.name || 'Product Image'}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Info */}
                                <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors h-10">
                                    {product.name}
                                </h3>
                                <p className="font-bold text-gray-900 text-base">₹{product.price?.toLocaleString() || '0'}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
