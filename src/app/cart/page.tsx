'use client';

import { useCartStore } from '@/store/cart';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCartStore();
    const router = useRouter();

    const discount = Math.round(items.reduce((acc, item) => acc + ((item.compare_price || item.base_price) - item.base_price) * item.quantity, 0));
    const price = items.reduce((acc, item) => acc + (item.compare_price || item.base_price) * item.quantity, 0);
    const totalAmount = total();

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-[#f1f3f6] pb-20">
                <Navbar />
                <div className="max-w-[1248px] mx-auto px-4 pt-8">
                    <div className="bg-white rounded-[2px] shadow-sm p-12 text-center">
                        <div className="w-48 h-48 mx-auto relative mb-6 opacity-80">
                            <Image
                                src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=200"
                                alt="Empty Cart"
                                fill
                                className="object-contain opacity-50 grayscale"
                            />
                        </div>
                        <h2 className="text-xl font-medium text-gray-900 mb-2">Your Cart is Empty</h2>
                        <p className="text-sm text-gray-500 mb-8">Add items to it now.</p>
                        <Link href="/" className="px-16 py-3 bg-[#2874f0] text-white font-medium rounded-[2px] hover:bg-blue-600 transition-colors shadow-sm inline-block">
                            Shop Now
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f1f3f6]">
            <Navbar />

            <div className="max-w-[1248px] mx-auto px-4 py-8 grid lg:grid-cols-12 gap-4">
                {/* Left Column: Cart Items */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 rounded-[2px] shadow-sm border border-gray-100 flex items-center justify-between">
                        <h1 className="text-lg font-medium text-gray-900">My Cart ({items.length})</h1>
                    </div>

                    {/* Items */}
                    {items.map((item) => (
                        <div key={item.id} className="bg-white px-6 py-6 rounded-[2px] shadow-sm border border-gray-100 relative group">
                            <div className="flex gap-6">
                                {/* Image */}
                                <div className="w-24 h-24 relative flex-shrink-0">
                                    <Image
                                        src={item.images?.[0]?.url || '/placeholder.png'}
                                        alt={item.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 hover:text-primary transition-colors cursor-pointer text-base mb-1 truncate max-w-md">
                                        <Link href={`/product/${item.slug}`}>{item.name}</Link>
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-3 capitalize">Seller: OmniTech Retail</p>

                                    <div className="flex items-baseline gap-3 mb-4">
                                        <span className="text-lg font-bold text-gray-900">₹{item.base_price.toLocaleString()}</span>
                                        {item.compare_price && (
                                            <>
                                                <span className="text-sm text-gray-500 line-through">₹{item.compare_price.toLocaleString()}</span>
                                                <span className="text-sm font-medium text-green-600">
                                                    {Math.round(((item.compare_price - item.base_price) / item.compare_price) * 100)}% Off
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <Minus className="w-3 h-3 text-gray-600" />
                                            </button>
                                            <input
                                                type="text"
                                                value={item.quantity}
                                                readOnly
                                                className="w-10 text-center border border-gray-300 py-0.5 text-sm font-medium text-gray-900"
                                            />
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <Plus className="w-3 h-3 text-gray-600" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="font-medium text-gray-900 hover:text-primary text-sm uppercase tracking-wide"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Place Order (Sticky Bottom on Mobile, Inline on Desktop) */}
                    <div className="bg-white p-4 items-center justify-end shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-gray-100 sticky bottom-0 z-10 hidden lg:flex rounded-[2px]">
                        <button
                            onClick={() => router.push('/checkout')}
                            className="bg-[#fb641b] text-white font-medium px-16 py-4 uppercase text-base shadow-md rounded-[2px] transition hover:shadow-lg"
                        >
                            Place Order
                        </button>
                    </div>
                </div>

                {/* Right Column: Price Details */}
                <div className="lg:col-span-4 h-fit sticky top-24">
                    <div className="bg-white rounded-[2px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="font-medium text-gray-500 uppercase text-sm tracking-wide">Price Details</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between text-gray-900">
                                <span>Price ({items.length} items)</span>
                                <span>₹{price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-900">
                                <span>Discount</span>
                                <span className="text-green-600">- ₹{discount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-900">
                                <span>Delivery Charges</span>
                                <span className="text-green-600">Free</span>
                            </div>

                            <div className="border-t border-dashed border-gray-200 my-4 pt-4 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total Amount</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>

                            <p className="font-medium text-green-600 text-sm pt-2">
                                You will save ₹{discount.toLocaleString()} on this order
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs px-4">
                        <ShieldCheck className="w-8 h-8 text-gray-400" />
                        <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
