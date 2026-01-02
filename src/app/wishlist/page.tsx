'use client';

import { useWishlistStore } from '@/store/wishlist';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { PRODUCTS } from '@/data/products';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

// Helper to get correct image from product data (fallback for stale localStorage)
const getProductImage = (itemId: string, storedImage: string) => {
    const product = PRODUCTS.find(p => p.id === itemId);
    return product?.img || storedImage || '/placeholder.png';
};

export default function WishlistPage() {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const addToCart = useCartStore((state) => state.addItem);

    const handleAddToCart = (item: typeof items[0]) => {
        addToCart({
            id: item.id,
            name: item.name,
            base_price: item.price,
            images: [{ url: item.image || (item as any).src || '/placeholder.png' }],
        } as any);
        removeItem(item.id);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] font-sans">
                <Navbar />
                <div className="max-w-[1248px] mx-auto px-4 py-8">
                    <div className="bg-white rounded-[2px] shadow-sm p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                        <div className="w-32 h-32 mb-6">
                            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_3942a7.png" alt="Empty Wishlist" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-xl font-medium text-gray-900 mb-2">Empty Wishlist</h1>
                        <p className="text-sm text-gray-500 mb-6">You have no items in your wishlist. Start adding!</p>
                        <Link
                            href="/"
                            className="bg-primary text-white px-12 py-3 rounded-[2px] font-medium hover:bg-primary/90 transition uppercase text-sm shadow-sm"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] font-sans text-gray-900">
            <Navbar />
            <div className="max-w-[1248px] mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-medium">My Wishlist ({items.length})</h1>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-[2px] hover:shadow-lg transition group relative flex flex-col"
                        >
                            <button
                                onClick={() => removeItem(item.id)}
                                className="absolute top-2 right-2 p-2 text-gray-300 hover:text-gray-400 z-10"
                                title="Remove from wishlist"
                            >
                                <Trash2 className="w-5 h-5 fill-current" />
                            </button>

                            <Link href={`/product/${item.slug}`} className="block p-4 flex-1">
                                <div className="aspect-[4/5] relative mb-4 flex items-center justify-center">
                                    <img
                                        src={getProductImage(item.id, item.image || (item as any).src || '')}
                                        alt={item.name}
                                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                                    />
                                </div>

                                <h3 className="font-medium text-[14px] text-gray-900 mb-1 hover:text-primary transition line-clamp-2 leading-tight">
                                    {item.name}
                                </h3>

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-green-600 text-white text-[12px] font-bold px-1.5 py-0.5 rounded-[2px] flex items-center gap-1">
                                        4.5 <Heart className="w-3 h-3 fill-current" />
                                    </span>
                                    <span className="text-gray-500 text-sm">(1,234)</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <p className="text-gray-900 text-lg font-medium">
                                        ₹{item.price.toLocaleString()}
                                    </p>
                                    <p className="text-gray-500 text-sm line-through">
                                        ₹{(item.price * 1.2).toLocaleString()}
                                    </p>
                                    <span className="text-green-600 text-xs font-bold">20% off</span>
                                </div>
                            </Link>

                            <div className="border-t border-gray-100 p-3">
                                <button // Replaced Trash2 logic/button with Add to Cart for better UX as primary action
                                    onClick={() => handleAddToCart(item)}
                                    className="w-full text-primary font-medium text-sm uppercase flex items-center justify-center gap-2 py-1 hover:bg-blue-50 transition rounded-[2px]"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Move to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
