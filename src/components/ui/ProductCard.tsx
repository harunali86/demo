'use client';

import { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
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
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const reviewCount = getReviewCount(id);
    const rating = (3.8 + (reviewCount % 12) / 10).toFixed(1);
    const inWishlist = isInWishlist(id);
    const [mounted, setMounted] = useState(false);
    const discount = sale ? Math.round(((sale - price) / sale) * 100) : 0;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const showWishlisted = mounted && inWishlist;

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-white hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden border border-gray-100/50 hover:border-gray-200 flex flex-col h-full"
        >
            <Link href={`/product/${name.toLowerCase().replace(/ /g, '-')}`} className="flex flex-col h-full p-4">
                {/* Wishlist Button */}
                <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 z-10 text-gray-300 hover:text-red-500 transition-colors"
                >
                    <Heart className={`w-5 h-5 ${showWishlisted ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} />
                </motion.button>

                {/* Image */}
                <div className="relative aspect-[4/5] w-full mb-4">
                    <Image
                        src={img}
                        alt={name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1 flex-1">
                    {/* Title */}
                    <h3 className="text-sm text-gray-800 font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {name}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[3px]">
                            {rating} <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                            ({reviewCount.toLocaleString()})
                        </span>
                        {/* Assured Badge Simulation */}
                        <div className="ml-auto w-16 h-5 relative grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100">
                            <Image
                                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                                alt="Assured"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Price Block */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-gray-900">₹{price.toLocaleString()}</span>
                        {sale && (
                            <>
                                <span className="text-sm text-gray-500 line-through">₹{sale.toLocaleString()}</span>
                                <span className="text-sm font-bold text-green-600">{discount}% off</span>
                            </>
                        )}
                    </div>

                    {/* Free Delivery Tag */}
                    {price > 500 && (
                        <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                            Free delivery
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
