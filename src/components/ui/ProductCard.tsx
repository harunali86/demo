'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';

interface ProductProps {
    id: string;
    name: string;
    price: number;
    cat: string;
    img: string;
    sale?: number | null;
    index?: number;
}

const getReviewCount = (id: string) => {
    const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return 100 + (hash % 900) + Math.floor(hash / 10);
};

export default function ProductCard({ id, name, price, cat, img, sale, index = 0 }: ProductProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const reviewCount = getReviewCount(id);
    const rating = (4.0 + (reviewCount % 10) / 10).toFixed(1);
    const inWishlist = isInWishlist(id);
    const [mounted, setMounted] = useState(false);
    const discount = sale ? Math.round(((sale - price) / sale) * 100) : 0;

    useEffect(() => {
        setMounted(true);
    }, []);

    const showWishlisted = mounted && inWishlist;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id, name, base_price: price, category_id: cat,
            images: [{ url: img }],
            slug: name.toLowerCase().replace(/ /g, '-'),
            description: 'Premium product',
            compare_price: sale || null,
            is_active: true, is_featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as any);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(id);
        } else {
            addToWishlist({ id, name, price, image: img, slug: name.toLowerCase().replace(/ /g, '-') });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            className="group"
        >
            <Link
                href={`/product/${name.toLowerCase().replace(/ /g, '-')}`}
                className="block bg-white dark:bg-[#1a1a1a] p-3 hover:shadow-card transition-shadow relative"
            >
                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-colors ${showWishlisted ? 'text-[#cc0c39]' : 'text-gray-400 hover:text-[#cc0c39]'
                        }`}
                >
                    <Heart className={`w-5 h-5 ${showWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Image */}
                <div className="relative aspect-square mb-2 bg-white dark:bg-[#1a1a1a]">
                    <Image
                        src={img}
                        alt={name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                    {/* Title */}
                    <h3 className="text-[13px] text-[#0f1111] dark:text-[#e3e6e6] line-clamp-2 group-hover:text-[#c45500] dark:group-hover:text-[#ff9900] transition-colors leading-tight">
                        {name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center text-[#de7921]">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= Math.floor(Number(rating)) ? 'fill-current' : ''}`}
                                />
                            ))}
                        </div>
                        <span className="text-[12px] text-[#007185] dark:text-[#56c5d3]">
                            {reviewCount.toLocaleString()}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-[12px] text-[#0f1111] dark:text-[#e3e6e6]">₹</span>
                        <span className="text-[21px] text-[#0f1111] dark:text-[#e3e6e6] font-medium">
                            {price.toLocaleString()}
                        </span>
                    </div>

                    {/* Original price and discount */}
                    {sale && (
                        <div className="flex items-center gap-2 text-[12px]">
                            <span className="text-[#565959] dark:text-[#999] line-through">
                                ₹{sale.toLocaleString()}
                            </span>
                            <span className="text-[#cc0c39] font-medium">
                                ({discount}% off)
                            </span>
                        </div>
                    )}

                    {/* Prime delivery */}
                    <p className="text-[12px] text-[#565959] dark:text-[#999]">
                        FREE delivery <strong className="text-[#0f1111] dark:text-[#e3e6e6]">Tomorrow</strong>
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
