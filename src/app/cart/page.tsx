'use client';

import { useCartStore } from '@/store/cart';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCartStore();

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-background text-white pb-20">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                    <Link href="/shop" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/80 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-white pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    Your Cart <span className="text-lg text-gray-500 font-normal">({items.length} items)</span>
                </h1>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex gap-6 p-4 rounded-3xl bg-white/5 border border-white/10"
                            >
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                    <Image
                                        src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1560393464-5c56cfaad484?q=80&w=100&auto=format&fit=crop'}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{item.name}</h3>
                                            <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-400 capitalize">{item.category_id}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-xl">₹{item.base_price.toLocaleString()}</p>

                                        <div className="flex items-center gap-3 bg-white/10 rounded-full px-3 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:text-primary transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:text-primary transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 p-6 rounded-3xl bg-white/5 border border-white/10">
                            <h2 className="font-bold text-xl mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{total().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-500">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax (18%)</span>
                                    <span className="text-white">₹{(total() * 0.18).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span>₹{(total() * 1.18).toLocaleString()}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-95"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
