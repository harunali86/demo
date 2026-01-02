'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';
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
        <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto bg-white dark:bg-[#0a0a0a]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                        <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Recently Viewed</h2>
                </div>
                <button
                    onClick={clearAll}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                >
                    <X className="w-4 h-4" />
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
                            className="block w-40 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-3 hover:border-blue-500/50 hover:bg-gray-100 dark:hover:bg-white/10 transition-all group"
                        >
                            {/* Image */}
                            <div className="relative aspect-square mb-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-black/50">
                                <Image
                                    src={product.img || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000'}
                                    alt={product.name || 'Product Image'}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>

                            {/* Info */}
                            <h3 className="font-medium text-sm truncate mb-1 text-gray-900 dark:text-white">{product.name}</h3>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">₹{product.price?.toLocaleString() || '0'}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
