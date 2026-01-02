'use client';

import { PRODUCTS } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    currentProductId: string;
    category: string;
}

export default function CustomersAlsoViewed({ currentProductId, category }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Get products from same and related categories
    const relatedProducts = PRODUCTS
        .filter(p => p.id !== currentProductId)
        .sort(() => Math.random() - 0.5) // Shuffle
        .slice(0, 8);

    if (relatedProducts.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const getReviewCount = (id: string) => {
        const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return 50 + (hash % 500);
    };

    return (
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3d4f5f]">
            <h3 className="text-lg font-bold text-[#e3e6e6] mb-4">Customers who viewed this item also viewed</h3>

            <div className="relative">
                {/* Scroll Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-white/90 hover:bg-white shadow-md flex items-center justify-center rounded-r"
                >
                    <ChevronLeft className="w-6 h-6 text-[#0f1111]" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-white/90 hover:bg-white shadow-md flex items-center justify-center rounded-l"
                >
                    <ChevronRight className="w-6 h-6 text-[#0f1111]" />
                </button>

                {/* Products Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide px-2"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {relatedProducts.map((product, index) => {
                        const reviewCount = getReviewCount(product.id);
                        const rating = (4.0 + (reviewCount % 10) / 10).toFixed(1);

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex-shrink-0 w-40"
                            >
                                <Link
                                    href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}
                                    className="block group"
                                >
                                    <div className="aspect-square bg-white rounded overflow-hidden mb-2">
                                        <Image
                                            src={product.img}
                                            alt={product.name}
                                            width={160}
                                            height={160}
                                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <h4 className="text-sm text-[#56c5d3] group-hover:text-[#febd69] line-clamp-2 mb-1">
                                        {product.name}
                                    </h4>
                                    <div className="flex items-center gap-1 mb-1">
                                        <div className="flex text-[#de7921]">
                                            {[1, 2, 3, 4].map((star) => (
                                                <Star key={star} className="w-3 h-3 fill-current" />
                                            ))}
                                            <Star className="w-3 h-3" />
                                        </div>
                                        <span className="text-[10px] text-[#56c5d3]">{reviewCount}</span>
                                    </div>
                                    <div className="text-[#e3e6e6] font-medium">
                                        ₹{product.price.toLocaleString()}
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
