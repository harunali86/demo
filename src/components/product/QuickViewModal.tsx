'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { toast } from 'sonner';

interface Product {
    id: string;
    name: string;
    price: number;
    sale?: number | null;
    img: string;
    cat: string;
}

interface QuickViewModalProps {
    product: Product | null;
    onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

    if (!product) return null;

    const hash = product.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const rating = (4.0 + (hash % 10) / 10).toFixed(1);
    const reviewCount = 100 + (hash % 500);
    const discount = product.sale ? Math.round(((product.sale - product.price) / product.sale) * 100) : 0;

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                base_price: product.price,
                category_id: product.cat,
                images: [{ url: product.img }],
                slug: product.name.toLowerCase().replace(/ /g, '-'),
            } as any);
        }
        toast.success(`${quantity} item(s) added to cart`);
        onClose();
    };

    const handleAddToWishlist = () => {
        addToWishlist({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.img,
            slug: product.name.toLowerCase().replace(/ /g, '-'),
            description: '',
        });
        toast.success('Added to wishlist');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#0f1111] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-[#232323] rounded-full flex items-center justify-center text-[#999] hover:text-white hover:bg-[#333] z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="grid md:grid-cols-2 gap-6 p-6">
                        {/* Image */}
                        <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                            <Image
                                src={product.img}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                            />
                            {discount > 0 && (
                                <div className="absolute top-2 left-2 bg-[#cc0c39] text-white text-xs font-bold px-2 py-1 rounded">
                                    -{discount}%
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col">
                            <Link
                                href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}
                                className="text-xl font-bold text-[#e3e6e6] hover:text-[#febd69] mb-2"
                                onClick={onClose}
                            >
                                {product.name}
                            </Link>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex text-[#de7921]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className={`w-4 h-4 ${star <= Math.floor(parseFloat(rating)) ? 'fill-current' : ''}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-[#56c5d3]">{reviewCount} reviews</span>
                            </div>

                            {/* Price */}
                            <div className="mb-4">
                                <div className="flex items-baseline gap-2">
                                    {discount > 0 && (
                                        <span className="text-sm text-[#cc0c39]">-{discount}%</span>
                                    )}
                                    <span className="text-2xl font-bold text-[#e3e6e6]">
                                        ₹{product.price.toLocaleString()}
                                    </span>
                                </div>
                                {product.sale && (
                                    <p className="text-sm text-[#999]">
                                        M.R.P.: <span className="line-through">₹{product.sale.toLocaleString()}</span>
                                    </p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-sm text-[#999]">Qty:</span>
                                <div className="flex items-center border border-[#3d4f5f] rounded">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-1 text-[#e3e6e6] hover:bg-[#232323]"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1 text-[#e3e6e6] border-x border-[#3d4f5f]">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                        className="px-3 py-1 text-[#e3e6e6] hover:bg-[#232323]"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mb-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-3 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-[#0f1111] font-medium rounded-full flex items-center justify-center gap-2 hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734]"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleAddToWishlist}
                                    className={`px-4 rounded-full border transition ${isInWishlist(product.id)
                                            ? 'bg-red-500/10 border-red-500 text-red-500'
                                            : 'border-[#3d4f5f] text-[#e3e6e6] hover:border-[#febd69]'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            {/* View Full Details */}
                            <Link
                                href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}
                                onClick={onClose}
                                className="text-center text-sm text-[#56c5d3] hover:text-[#febd69] hover:underline"
                            >
                                View full product details →
                            </Link>

                            {/* Delivery Info */}
                            <div className="mt-auto pt-4 border-t border-[#3d4f5f] text-sm text-[#999]">
                                <p className="text-[#3d9c4a] font-medium">✓ In Stock</p>
                                <p>FREE Delivery on orders above ₹499</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
