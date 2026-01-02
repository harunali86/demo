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
        <section className="bg-white dark:bg-[#1a1a1a] py-5 mx-4 rounded shadow-card">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#cc0c39]" fill="#cc0c39" />
                        <h2 className="text-[21px] font-bold text-[#0f1111] dark:text-[#e3e6e6]">
                            Today's Deals
                        </h2>
                    </div>
                    <Link
                        href="/deals"
                        className="flex items-center gap-1 text-[13px] text-[#007185] dark:text-[#56c5d3] hover:text-[#c45500] dark:hover:text-[#ff9900] hover:underline"
                    >
                        See all deals
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {flashDeals.map((product, i) => {
                        const soldPercent = getSoldPercent(product.id);
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
                                    className="block group"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square mb-2 bg-white dark:bg-[#1a1a1a]">
                                        <Image
                                            src={product.img}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-2 group-hover:scale-105 transition-transform"
                                        />
                                        {/* Deal badge */}
                                        <div className="absolute top-1 left-1 bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5">
                                            {discount}% off
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="text-center">
                                        <span className="inline-block bg-[#cc0c39] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm mb-1">
                                            Up to {discount}% off
                                        </span>
                                        <p className="text-[12px] text-[#565959] dark:text-[#999]">
                                            Limited time deal
                                        </p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-2 relative h-4 bg-[#f5f5f5] dark:bg-[#333] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${soldPercent}%` }}
                                            transition={{ delay: i * 0.05 + 0.2, duration: 0.4 }}
                                            className="absolute h-full bg-gradient-to-r from-[#c45500] to-[#ff9900] rounded-full"
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-[#0f1111] dark:text-white">
                                            {soldPercent}% claimed
                                        </span>
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
