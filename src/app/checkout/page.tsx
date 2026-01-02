'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useLocationStore } from '@/store/location';
import { Check, CreditCard, Loader2, MapPin, Truck, Wallet, ShieldCheck, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const { location, pincode } = useLocationStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [activeStep, setActiveStep] = useState(4); // Default to Payment step for now as others are mock

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
            <div className="min-h-screen bg-[#f1f3f6] text-black">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh] flex-col">
                    <p className="text-lg mb-4">Your cart is empty.</p>
                    <Link href="/" className="bg-[#2874f0] text-white px-8 py-3 font-medium rounded-[2px] shadow-sm uppercase text-sm">Shop now</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const priceDetails = {
        subtotal: total(),
        discount: Math.round(total() * 0.2), // Mock discount
        delivery: 0,
        total: Math.round(total()) // total contains base price sum
    };

    return (
        <main className="min-h-screen bg-[#f1f3f6] text-gray-900 pb-32 font-sans">
            <Navbar />

            <div className="max-w-[1248px] mx-auto px-4 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">

                    {/* Left: Steps */}
                    <div className="space-y-4">

                        {/* Step 1: Login */}
                        <div className="bg-white p-4 items-center flex justify-between shadow-sm rounded-[2px]">
                            <div className="flex items-center gap-4">
                                <span className="bg-gray-100 text-primary text-xs font-bold px-2 py-1 rounded-[2px]">1</span>
                                <div>
                                    <h3 className="text-gray-500 font-medium text-sm uppercase">Login</h3>
                                    <p className="font-bold text-sm text-gray-900">Harun User <span className="text-primary font-normal text-sm ml-2">+91 98765 43210</span></p>
                                </div>
                            </div>
                            <button className="border border-gray-200 text-primary uppercase font-bold text-sm px-6 py-2 rounded-[2px] hover:bg-gray-50">Change</button>
                        </div>

                        {/* Step 2: Delivery Address */}
                        <div className="bg-white p-4 flex justify-between shadow-sm rounded-[2px]">
                            <div className="flex items-center gap-4">
                                <span className="bg-gray-100 text-primary text-xs font-bold px-2 py-1 rounded-[2px]">2</span>
                                <div>
                                    <h3 className="text-gray-500 font-medium text-sm uppercase">Delivery Address</h3>
                                    <p className="font-bold text-sm text-gray-900">Home <span className="font-normal mx-2">123, Tech Street, Silicon Valley, {location}, {pincode}</span></p>
                                </div>
                            </div>
                            <button className="border border-gray-200 text-primary uppercase font-bold text-sm px-6 py-2 rounded-[2px] hover:bg-gray-50">Change</button>
                        </div>

                        {/* Step 3: Order Summary */}
                        <div className="bg-white p-4 shadow-sm rounded-[2px]">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-gray-100 text-primary text-xs font-bold px-2 py-1 rounded-[2px]">3</span>
                                <h3 className="text-gray-500 font-medium text-sm uppercase">Order Summary</h3>
                            </div>

                            <div className="space-y-4 pl-10 pr-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0">
                                        <div className="w-20 h-20 relative flex-shrink-0">
                                            {item.images?.[0]?.url && <Image src={item.images[0].url} alt={item.name} fill className="object-contain" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900 leading-tight mb-1">{item.name}</p>
                                            <p className="text-xs text-gray-500 mb-2">Seller: RetailNet</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 line-through text-sm">₹{Math.round(item.base_price * 1.2).toLocaleString()}</span>
                                                <span className="font-bold text-lg">₹{item.base_price.toLocaleString()}</span>
                                                <span className="text-green-600 text-xs font-bold">20% Off</span>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">Delivery in 2 days</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 4: Payment Options */}
                        <div className="bg-primary/5 p-4 shadow-sm rounded-[2px] border border-gray-200">
                            <div className="flex items-center gap-4 mb-4 bg-primary text-white p-3 -mx-4 -mt-4 rounded-t-[2px]">
                                <span className="bg-white text-primary text-xs font-bold px-2 py-1 rounded-[2px]">4</span>
                                <h3 className="font-medium text-sm uppercase">Payment Options</h3>
                            </div>

                            <div className="pl-4 pr-4 space-y-4">
                                <div>
                                    <label className={`flex items-start gap-4 p-4 border rounded-[2px] cursor-pointer transition-colors ${paymentMethod === 'online' ? 'bg-blue-50 border-gray-200' : 'bg-white border-gray-100'}`} onClick={() => setPaymentMethod('online')}>
                                        <input type="radio" name="payment" className="mt-1" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900">UPI / Credit / Debit / ATM Card</p>
                                            <p className="text-xs text-gray-500 mt-1">Add and secure your cards as per RBI guidelines</p>
                                        </div>
                                    </label>
                                </div>

                                <div>
                                    <label className={`flex items-start gap-4 p-4 border rounded-[2px] cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-blue-50 border-gray-200' : 'bg-white border-gray-100'}`} onClick={() => setPaymentMethod('cod')}>
                                        <input type="radio" name="payment" className="mt-1" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500 mt-1">Pay when you receive the order</p>
                                        </div>
                                    </label>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-48 bg-[#fb641b] text-white font-medium py-3 rounded-[2px] shadow-sm hover:shadow-md transition uppercase text-sm mt-4 ml-8 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Confirm Order'}
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Right: Price Details */}
                    <div className="h-fit space-y-4 sticky top-24">
                        <div className="bg-white rounded-[2px] shadow-sm">
                            <h2 className="text-gray-500 font-bold uppercase text-sm p-4 border-b border-gray-100">Price Details</h2>
                            <div className="p-4 space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-900">Price ({items.length} items)</span>
                                    <span className="text-gray-900">₹{Math.round(priceDetails.subtotal * 1.2).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-900">Discount</span>
                                    <span className="text-green-600">- ₹{Math.round(priceDetails.subtotal * 0.2).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-900">Delivery Charges</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 pt-4 mt-4 mb-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total Amount</span>
                                        <span>₹{priceDetails.subtotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-green-600 font-bold text-sm pt-2">
                                    You will save ₹{Math.round(priceDetails.subtotal * 0.2).toLocaleString()} on this order
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-4 text-xs text-gray-500">
                            <ShieldCheck className="w-8 h-8 text-gray-400" />
                            Safe and Secure Payments. Easy returns. 100% Authentic products.
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}
