'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';

export default function FlashSales() {
    const flashDeals = PRODUCTS.filter(p => p.sale && p.sale > p.price).slice(0, 6);

    const getSoldPercent = (id: string) => {
        const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return 40 + (hash % 50);
    };

    if (flashDeals.length === 0) return null;

    return (
        <section className="bg-white py-4 md:py-6 shadow-sm border border-gray-200 rounded-sm">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[20px] font-medium text-gray-900">
                        Top Selection
                    </h2>
                    <Link
                        href="/deals"
                        className="flex items-center justify-center bg-primary hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2 rounded-[2px] shadow-sm transition-colors"
                    >
                        VIEW ALL
                    </Link>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {flashDeals.map((product, i) => {
                        const discount = Math.round(((product.sale! - product.price) / product.sale!) * 100);

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <Link
                                    href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}
                                    className="block group border border-transparent hover:border-gray-100 hover:shadow-lg rounded-md p-2 transition-all duration-300 h-full"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/5] mb-2">
                                        <Image
                                            src={product.img}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-2 group-hover:scale-105 transition-transform"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="text-center px-1">
                                        <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>

                                        <div className="text-green-600 font-medium text-sm mb-1">
                                            Min. {discount}% Off
                                        </div>

                                        <p className="text-xs text-gray-500">
                                            Grab Now
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
