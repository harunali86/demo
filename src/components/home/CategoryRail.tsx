'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const CATEGORIES = [
    { id: 'premium_tech', name: 'Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80' },
    { id: 'fashion', name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80' },
    { id: 'audio', name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=80' },
    { id: 'gaming', name: 'Home', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' },
    { id: 'sneakers', name: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' },
    { id: 'watches', name: 'Beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80' },
];

export default function CategoryRail() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 mx-4 -mt-12"
        >
            <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Shop by Category</h2>
                    <Link href="/products" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium">
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                        >
                            <Link
                                href={`/category/${cat.id}`}
                                className="flex flex-col items-center group"
                            >
                                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 ring-2 ring-gray-600 group-hover:ring-orange-400 transition-all duration-300 group-hover:scale-110">
                                    <Image
                                        src={cat.img}
                                        alt={cat.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-xs md:text-sm text-gray-300 group-hover:text-white font-medium text-center transition">
                                    {cat.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
