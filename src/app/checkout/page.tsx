'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useLocationStore } from '@/store/location';
import { motion } from 'framer-motion';
import { Check, CreditCard, Loader2, MapPin, Truck, Wallet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/ui/Navbar';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const { location, pincode } = useLocationStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call and redirect to tracking
        setTimeout(() => {
            setLoading(false);
            clearCart();
            // Generate random order ID
            const orderId = 'ORD-' + Math.floor(Math.random() * 100000);
            router.push(`/orders/${orderId}`);
        }, 2000);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>Your cart is empty. <Link href="/" className="text-primary underline">Shop now</Link></p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-white pb-32">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid md:grid-cols-2 gap-12">

                    {/* Form */}
                    <form onSubmit={handleCheckout} className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MapPin className="text-primary" />
                                Shipping Address
                            </h2>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
                                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">CHANGE</div>
                                <h3 className="font-bold mb-1">Harun User</h3>
                                <p className="text-sm text-gray-400">123, Tech Street, Silicon Valley</p>
                                <p className="text-sm text-gray-400">{location !== 'Select Location' ? `${location}, ${pincode}` : 'Mumbai, India 400001'}</p>
                                <p className="text-sm text-gray-400 mt-2">+91 98765 43210</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Wallet className="text-primary" />
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                <div
                                    onClick={() => setPaymentMethod('online')}
                                    className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'online' ? 'bg-orange-500/10 border-orange-500' : 'bg-white/5 border-white/10'}`}
                                >
                                    <CreditCard className={paymentMethod === 'online' ? 'text-orange-500' : 'text-gray-400'} />
                                    <div>
                                        <span className="font-bold block">UPI / Credit Card</span>
                                        <span className="text-xs text-gray-400">Pay securely with Razorpay</span>
                                    </div>
                                    {paymentMethod === 'online' && <Check className="ml-auto text-orange-500" />}
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-orange-500/10 border-orange-500' : 'bg-white/5 border-white/10'}`}
                                >
                                    <Truck className={paymentMethod === 'cod' ? 'text-orange-500' : 'text-gray-400'} />
                                    <div>
                                        <span className="font-bold block">Cash on Delivery</span>
                                        <span className="text-xs text-gray-400">Pay when order arrives</span>
                                    </div>
                                    {paymentMethod === 'cod' && <Check className="ml-auto text-orange-500" />}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Pay Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="hidden md:flex w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all items-center justify-center gap-2 text-lg shadow-lg"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : `Pay ₹${(total() * 1.18).toLocaleString()}`}
                        </button>
                    </form>

                    {/* Mobile Fixed Pay Button */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 z-50">
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 text-lg shadow-lg"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : `Pay ₹${(total() * 1.18).toLocaleString()}`}
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="bg-white/5 p-6 rounded-3xl h-fit border border-white/10">
                        <h2 className="font-bold text-xl mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-white/10 rounded-lg relative overflow-hidden">
                                        {item.images?.[0]?.url && <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-sm">₹{(item.base_price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 py-4 border-t border-white/10 text-sm text-gray-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{total().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST (18%)</span>
                                <span>₹{Math.round(total() * 0.18).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-green-400">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span>₹{(total() * 1.18).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
