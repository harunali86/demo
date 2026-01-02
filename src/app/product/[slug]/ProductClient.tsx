'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Zap, Heart, Share2, Tag, ChevronDown, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProductReviews from '@/components/product/ProductReviews';
import BankOffers from '@/components/product/BankOffers';
import PincodeDelivery from '@/components/product/PincodeDelivery';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'] & {
    images: { url: string }[] | null;
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000";

export default function ProductClient({ product }: { product: Product }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const addItem = useCartStore((state) => state.addItem);
    const router = useRouter();

    // Calculate discount
    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.base_price) / product.compare_price) * 100)
        : 0;

    const handleAddToCart = () => {
        addItem(product as any);
        toast.success('Added to cart');
    };

    const handleBuyNow = () => {
        addItem(product as any);
        router.push('/checkout');
    };

    const images = product.images?.length ? product.images : [{ url: FALLBACK_IMAGE }];

    return (
        <main className="min-h-screen bg-[#f1f3f6]">
            <Navbar />

            <div className="max-w-[1248px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 pt-4 pb-12">

                {/* Left Column: Images & Buttons (Sticky) */}
                <div className="lg:col-span-5 lg:sticky lg:top-20 h-fit bg-white p-4 shadow-sm border border-gray-200">
                    <div className="flex flex-col-reverse lg:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex lg:flex-col gap-2 overflow-auto lg:h-[450px] scrollbar-hide">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onMouseEnter={() => setSelectedImage(i)}
                                    className={`relative w-16 h-16 border-2 rounded-sm overflow-hidden flex-shrink-0 ${selectedImage === i ? 'border-primary' : 'border-gray-200 hover:border-primary'
                                        }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`View ${i}`}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="relative flex-1 aspect-[4/5] lg:aspect-auto lg:h-[450px] border border-gray-100 flex items-center justify-center">
                            <Image
                                src={images[selectedImage].url}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                            <button
                                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors"
                                onClick={() => {
                                    const { addItem, removeItem, isInWishlist } = useWishlistStore.getState();
                                    if (isInWishlist(product.id)) {
                                        removeItem(product.id);
                                        toast.success('Removed from wishlist');
                                    } else {
                                        addItem(product as any);
                                        toast.success('Added to wishlist');
                                    }
                                }}
                            >
                                <Heart className={`w-5 h-5 ${useWishlistStore(state => state.isInWishlist(product.id)) ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-[#ff9f00] hover:bg-[#f39700] text-white font-medium py-4 rounded-[2px] shadow-sm uppercase text-sm md:text-base flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" fill="white" />
                            Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 bg-[#fb641b] hover:bg-[#f45f18] text-white font-medium py-4 rounded-[2px] shadow-sm uppercase text-sm md:text-base flex items-center justify-center gap-2"
                        >
                            <Zap className="w-5 h-5" fill="white" />
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-7 bg-white p-6 shadow-sm border border-gray-200">
                    {/* Breadcrumbs (Mock) */}
                    <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                        Home <ChevronDown className="w-3 h-3 -rotate-90" />
                        {product.category_id || 'Electronics'} <ChevronDown className="w-3 h-3 -rotate-90" />
                        <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl md:text-2xl font-medium text-gray-900 mb-2">
                        {product.name}
                    </h1>

                    {/* Rating & Action Links */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-[4px]">
                            4.5 <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-gray-500 font-medium text-sm">12,345 Ratings & 1,234 Reviews</span>
                        <Image src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" width={77} height={21} />
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-medium text-gray-900">₹{product.base_price.toLocaleString()}</span>
                            {product.compare_price && (
                                <>
                                    <span className="text-base text-gray-500 line-through">₹{product.compare_price.toLocaleString()}</span>
                                    <span className="text-base font-medium text-green-600">{discount}% off</span>
                                </>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">+99 Secured Packaging Fee</p>
                    </div>

                    {/* Offers */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-2">Available offers</h3>
                        <div className="space-y-2">
                            <BankOffers price={product.base_price} />
                        </div>
                    </div>

                    {/* Delivery */}
                    <div className="flex gap-16 mb-8 py-4 border-t border-b border-gray-100">
                        <div className="flex gap-4">
                            <div className="text-sm font-medium text-gray-500 mt-1">Delivery</div>
                            <div>
                                <PincodeDelivery price={product.base_price} />
                                <p className="text-xs text-gray-500 mt-1">Delivery by {new Date(Date.now() + 3 * 86400000).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="flex gap-16 mb-8">
                        <div className="text-sm font-medium text-gray-500">Highlights</div>
                        <div className="flex-1">
                            <ul className="list-disc pl-4 space-y-2 text-sm text-gray-800">
                                <li>Top-notch performance with latest processor</li>
                                <li>Premium build quality and finish</li>
                                <li>1 Year Domestic Warranty</li>
                                <li>Supports Fast Charging</li>
                                <li>High resolution stunning display</li>
                            </ul>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex gap-16 mb-8 py-4 border-t border-gray-100">
                        <div className="text-sm font-medium text-gray-500">Description</div>
                        <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                            {product.description || "Experience the best quality products at unbeatable prices."}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="border rounded-sm p-4">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Ratings & Reviews</h3>
                        <ProductReviews productId={product.id} productName={product.name} />
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}
