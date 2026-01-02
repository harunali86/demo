'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { ShoppingCart, Star, Truck, ShieldCheck, ArrowLeft, Zap, MapPin, Calendar, ChevronDown, ChevronUp, MessageCircle, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cart';
import { useLocationStore } from '@/store/location';
import { useRecentlyViewedStore } from '@/store/recentlyViewed';
import { useWishlistStore } from '@/store/wishlist';
import { PRODUCTS } from '@/data/products';
import Navbar from '@/components/ui/Navbar';
import ProductReviews from '@/components/product/ProductReviews';
// Amazon-style feature components
import FrequentlyBoughtTogether from '@/components/product/FrequentlyBoughtTogether';
import CustomersAlsoViewed from '@/components/product/CustomersAlsoViewed';
import StockIndicator from '@/components/product/StockIndicator';
import RatingBreakdown from '@/components/product/RatingBreakdown';
import BankOffers from '@/components/product/BankOffers';
import EMIOptions from '@/components/product/EMIOptions';
import PincodeDelivery from '@/components/product/PincodeDelivery';


type Product = Database['public']['Tables']['products']['Row'] & {
    images: { url: string }[] | null;
};

// Fallback image if needed
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000";

// Dynamic Q&A based on category
const getProductQA = (category: string, productName: string) => {
    const baseQA = [
        { q: "Is this product original?", a: "Yes, 100% original with brand warranty.", votes: Math.floor(Math.random() * 50) + 20 },
    ];

    const categoryQA: Record<string, { q: string; a: string; votes: number }[]> = {
        premium_tech: [
            { q: `Does ${productName} come with warranty?`, a: "Yes, 1 year manufacturer warranty included.", votes: Math.floor(Math.random() * 40) + 30 },
            { q: "Is international warranty available?", a: "Yes, international warranty is applicable.", votes: Math.floor(Math.random() * 30) + 15 },
            { q: "What's in the box?", a: "Device, charger, cable, user manual, and warranty card.", votes: Math.floor(Math.random() * 25) + 10 },
        ],
        fashion: [
            { q: "What material is this made of?", a: "Premium quality cotton blend for comfort and durability.", votes: Math.floor(Math.random() * 35) + 20 },
            { q: "Is size chart accurate?", a: "Yes, follow the size chart. We recommend ordering your usual size.", votes: Math.floor(Math.random() * 40) + 25 },
            { q: "Is this machine washable?", a: "Yes, machine wash cold. Tumble dry low.", votes: Math.floor(Math.random() * 20) + 10 },
        ],
        watches: [
            { q: "Is this water resistant?", a: "Yes, water resistant up to 50 meters.", votes: Math.floor(Math.random() * 45) + 30 },
            { q: "What is the battery life?", a: "Battery lasts approximately 2-3 years with normal use.", votes: Math.floor(Math.random() * 35) + 20 },
            { q: "Does it come with extra straps?", a: "No, but compatible straps are available separately.", votes: Math.floor(Math.random() * 15) + 5 },
        ],
        audio: [
            { q: "What is the battery backup?", a: "Up to 30 hours on a single charge.", votes: Math.floor(Math.random() * 50) + 40 },
            { q: "Is noise cancellation available?", a: "Yes, Active Noise Cancellation (ANC) is supported.", votes: Math.floor(Math.random() * 40) + 30 },
            { q: "Can I use this for calls?", a: "Yes, built-in mic for crystal clear calls.", votes: Math.floor(Math.random() * 25) + 15 },
        ],
        sneakers: [
            { q: "Are these true to size?", a: "Yes, order your regular size. Half sizes go up.", votes: Math.floor(Math.random() * 50) + 35 },
            { q: "Is this suitable for running?", a: "Yes, designed for both running and casual wear.", votes: Math.floor(Math.random() * 30) + 20 },
            { q: "How to clean these shoes?", a: "Wipe with damp cloth. Do not machine wash.", votes: Math.floor(Math.random() * 20) + 10 },
        ],
        gaming: [
            { q: "What games come pre-installed?", a: "No games pre-installed. Games sold separately.", votes: Math.floor(Math.random() * 40) + 25 },
            { q: "Is online gaming free?", a: "Some features require subscription for online play.", votes: Math.floor(Math.random() * 35) + 20 },
            { q: "Does it support 4K?", a: "Yes, supports 4K gaming at 60fps.", votes: Math.floor(Math.random() * 45) + 30 },
        ],
        lifestyle: [
            { q: "What is the power consumption?", a: "Energy efficient with low power consumption.", votes: Math.floor(Math.random() * 25) + 15 },
            { q: "Is installation included?", a: "No, but easy self-installation. Manual included.", votes: Math.floor(Math.random() * 20) + 10 },
            { q: "What is the warranty period?", a: "1 year warranty on manufacturing defects.", votes: Math.floor(Math.random() * 30) + 20 },
        ],
        accessories: [
            { q: "Is this genuine leather?", a: "Yes, made from premium genuine leather.", votes: Math.floor(Math.random() * 35) + 25 },
            { q: "Will this fit all sizes?", a: "Adjustable design fits most sizes.", votes: Math.floor(Math.random() * 25) + 15 },
            { q: "Is gift wrapping available?", a: "Yes, select gift wrap option at checkout.", votes: Math.floor(Math.random() * 15) + 5 },
        ],
    };

    const specificQA = categoryQA[category] || categoryQA['lifestyle'];
    return [...baseQA, ...specificQA];
};

export default function ProductClient({ product }: { product: Product }) {
    const [expandedQA, setExpandedQA] = useState<number | null>(null);

    const addItem = useCartStore((state) => state.addItem);
    useCartStore((state) => state.items); // hydration check helper if needed

    const router = useRouter();
    const { location } = useLocationStore();
    const addToRecentlyViewed = useRecentlyViewedStore((state) => state.addItem);

    const [deliveryDate, setDeliveryDate] = useState<string>('');

    useEffect(() => {
        // Calculate delivery date on client side to avoid hydration mismatch
        const days = 3 + Math.floor(Math.random() * 3); // 3-5 days
        const date = new Date();
        date.setDate(date.getDate() + days);
        setDeliveryDate(date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }));
    }, []);

    const handleAddToCart = () => {
        if (product) {
            addItem(product as any);
            toast.success('Added to cart', {
                description: `${product.name} is now in your cart.`
            });
        }
    };

    const handleBuyNow = () => {
        if (product) {
            addItem(product as any);
            router.push('/checkout');
        }
    };

    useEffect(() => {
        if (product) {
            addToRecentlyViewed({
                id: product.id,
                name: product.name,
                price: product.base_price,
                img: product.images?.[0]?.url || FALLBACK_IMAGE,
                cat: product.category_id || 'general'
            });
        }
    }, [product, addToRecentlyViewed]);

    const reviewCount = 100 + (product.id.length * 13) % 500;
    const rating = (4.0 + (reviewCount % 10) / 10).toFixed(1);

    return (
        <main className="min-h-screen bg-[#0f1111] text-[#e3e6e6] pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 pt-4">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shopping
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="aspect-square relative rounded-3xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 group"
                    >
                        <Image
                            src={product.images?.[0]?.url || FALLBACK_IMAGE}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            priority
                        />
                        {/* Zoom hint */}
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            Hover to zoom
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="mb-2 text-primary font-bold uppercase tracking-wider text-sm">
                            {product.category_id?.replace('_', ' ') || 'Premium'}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            {/* Rating with Count */}
                            <div className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded text-white text-sm">
                                <span className="font-bold">{rating}</span>
                                <Star className="w-3 h-3 fill-current" />
                            </div>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">{reviewCount.toLocaleString()} Ratings</span>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                            <div className="text-green-600 dark:text-green-500 text-sm font-bold">In Stock</div>
                        </div>

                        <p className="text-gray-900 dark:text-gray-300 text-lg leading-relaxed mb-6">
                            {product.description || "Experience premium quality with this exclusive item."}
                        </p>

                        {/* Price Section */}
                        <div className="flex items-end gap-4 mb-6">
                            <p className="text-4xl font-bold text-black dark:text-white">₹{product.base_price.toLocaleString()}</p>
                            {product.compare_price && (
                                <>
                                    <p className="text-xl text-gray-500 line-through mb-1">₹{product.compare_price.toLocaleString()}</p>
                                    <span className="mb-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                        {Math.round(((product.compare_price - product.base_price) / product.compare_price) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Delivery Estimate */}
                        <div className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-primary" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Deliver to</p>
                                    <p className="font-medium truncate max-w-xs text-black dark:text-white">{location || 'Select Location'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                                <Calendar className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-green-600 dark:text-green-400 font-bold">Delivery by {deliveryDate || '...'}</p>
                                    <p className="text-xs text-gray-500">Order within 2 hrs for faster delivery</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-transparent border-2 border-orange-500 text-orange-500 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-lg"
                            >
                                <Zap className="w-5 h-5" />
                                Buy Now
                            </button>

                            <button
                                onClick={() => {
                                    const { addItem, removeItem, isInWishlist } = useWishlistStore.getState();
                                    if (isInWishlist(product.id)) {
                                        removeItem(product.id);
                                    } else {
                                        addItem({
                                            id: product.id,
                                            name: product.name,
                                            price: product.base_price,
                                            image: product.images?.[0]?.url || '/placeholder.png',
                                            slug: product.slug,
                                            description: product.description || ''
                                        });
                                        toast.success('Added to wishlist');
                                    }
                                }}
                                className={`px-4 rounded-xl border-2 transition active:scale-95 flex items-center justify-center ${useWishlistStore(state => state.isInWishlist(product.id))
                                    ? 'bg-red-500/20 border-red-500 text-red-500'
                                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-500'
                                    }`}
                            >
                                <Heart className={`w-6 h-6 ${useWishlistStore(state => state.isInWishlist(product.id)) ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Stock Indicator */}
                        <div className="mb-4">
                            <StockIndicator productId={product.id} />
                        </div>

                        {/* Pincode Delivery Check */}
                        <div className="mb-4">
                            <PincodeDelivery price={product.base_price} />
                        </div>

                        {/* Bank Offers */}
                        <div className="mb-4">
                            <BankOffers price={product.base_price} />
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-[#1a1a1a] border border-[#3d4f5f]">
                                <Truck className="w-6 h-6 text-[#febd69]" />
                                <div>
                                    <p className="font-bold text-sm text-[#e3e6e6]">Free Delivery</p>
                                    <p className="text-xs text-[#999]">On orders above ₹499</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-[#1a1a1a] border border-[#3d4f5f]">
                                <ShieldCheck className="w-6 h-6 text-[#febd69]" />
                                <div>
                                    <p className="font-bold text-sm text-[#e3e6e6]">1 Year Warranty</p>
                                    <p className="text-xs text-[#999]">Official guarantee</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Frequently Bought Together */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-8"
                >
                    <FrequentlyBoughtTogether
                        currentProductId={product.id}
                        category={product.category_id || ''}
                    />
                </motion.div>

                {/* Customers Also Viewed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                >
                    <CustomersAlsoViewed
                        currentProductId={product.id}
                        category={product.category_id || ''}
                    />
                </motion.div>

                {/* Rating Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.33 }}
                    className="mt-8"
                >
                    <RatingBreakdown productId={product.id} productName={product.name} />
                </motion.div>

                {/* Reviews Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-16"
                >
                    <ProductReviews productId={product.id} productName={product.name} />
                </motion.div>

                {/* Q&A Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <MessageCircle className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Questions & Answers</h2>
                    </div>

                    <div className="space-y-4">
                        {getProductQA(product.category_id || 'lifestyle', product.name).map((qa: { q: string; a: string; votes: number }, i: number) => (
                            <div
                                key={i}
                                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedQA(expandedQA === i ? null : i)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary font-bold">Q:</span>
                                        <span className="font-medium text-left">{qa.q}</span>
                                    </div>
                                    {expandedQA === i ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedQA === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="px-4 pb-4"
                                    >
                                        <div className="flex items-start gap-3 pt-3 border-t border-black/10 dark:border-white/10">
                                            <span className="text-green-500 font-bold">A:</span>
                                            <div>
                                                <p className="text-gray-700 dark:text-gray-300">{qa.a}</p>
                                                <p className="text-xs text-gray-500 mt-2">{qa.votes} people found this helpful</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button className="mt-4 text-primary hover:underline text-sm font-medium">
                        + Ask a Question
                    </button>
                </motion.div>
            </div >
        </main >
    );
}
