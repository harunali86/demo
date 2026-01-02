'use client';

import { useWishlistStore } from '@/store/wishlist';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { PRODUCTS } from '@/data/products';

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
            images: [{ url: item.image }],
        } as any);
        removeItem(item.id);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-20">
                        <Heart className="w-24 h-24 mx-auto text-gray-600 mb-6" />
                        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
                        <p className="text-gray-400 mb-8">Save your favorite items here for later!</p>
                        <Link
                            href="/"
                            className="inline-block bg-primary text-black px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Wishlist</h1>
                        <p className="text-gray-400 mt-1">{items.length} item{items.length > 1 ? 's' : ''} saved</p>
                    </div>
                    <button
                        onClick={clearWishlist}
                        className="text-red-500 hover:text-red-400 flex items-center gap-2 transition"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                    </button>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-primary/50 transition group"
                        >
                            <Link href={`/product/${item.slug}`}>
                                <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                                    <img
                                        src={getProductImage(item.id, item.image)}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link href={`/product/${item.slug}`}>
                                    <h3 className="font-semibold text-lg mb-2 hover:text-primary transition line-clamp-2">
                                        {item.name}
                                    </h3>
                                </Link>
                                <p className="text-primary text-xl font-bold mb-4">
                                    ₹{item.price.toLocaleString()}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="flex-1 bg-primary text-black py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2.5 bg-zinc-800 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
