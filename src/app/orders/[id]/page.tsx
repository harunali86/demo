'use client';

import { use, useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { CheckCircle2, Package, Truck, ShoppingBag, Star, ChevronRight, Phone, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [status, setStatus] = useState(0);

    // Simulate status updates
    useEffect(() => {
        const timer = setTimeout(() => setStatus(1), 1000);
        return () => clearTimeout(timer);
    }, []);

    const STEPS = [
        { title: 'Order Confirmed', sub: 'Sun, 5th Oct', completed: true },
        { title: 'Shipped', sub: 'Sun, 5th Oct', completed: true },
        { title: 'Out for Delivery', sub: 'Expected by Mon, 16th Oct', completed: false },
        { title: 'Delivery', sub: 'Expected by Mon, 16th Oct', completed: false },
    ];

    return (
        <div className="min-h-screen bg-[#f1f3f6] font-sans">
            <Navbar />

            <div className="max-w-[1248px] mx-auto px-2 lg:px-0 pt-4 pb-12 flex gap-4">
                {/* Main Content */}
                <div className="flex-1 space-y-4">
                    {/* Address & Product Card */}
                    <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-[2px] flex flex-col md:flex-row gap-8">
                        {/* Address */}
                        <div className="flex-1 border-r border-gray-100 pr-6">
                            <h3 className="font-medium text-lg text-gray-900 mb-4">Delivery Address</h3>
                            <p className="font-medium text-gray-900 mb-1">Harun Ahmed</p>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                Outer Ring Road, Devarabeesanahalli Village, <br />
                                Bengaluru, 560103, <br />
                                Karnataka, India
                            </p>
                            <p className="text-sm text-gray-900"><span className="font-medium">Phone number</span> 9876543210</p>
                        </div>

                        {/* Customer Support */}
                        <div className="flex-1 pl-2">
                            <h3 className="font-medium text-lg text-gray-900 mb-4">Your Rewards</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Star className="w-5 h-5 text-yellow-600 fill-current" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">12 SuperCoins</p>
                                    <p className="text-xs text-gray-500">will be credited after return period</p>
                                </div>
                            </div>

                            <h3 className="font-medium text-lg text-gray-900 mb-2 mt-6">More Actions</h3>
                            <div className="flex gap-4 text-sm text-gray-700 font-medium">
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 cursor-pointer hover:text-primary hover:bg-gray-50 px-2 py-1 -ml-2 rounded-[2px] transition-colors"
                                >
                                    <Download className="w-4 h-4" /> Download Invoice
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Item & Tracker */}
                    <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-[2px]">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Product Info */}
                            <div className="flex gap-4 flex-1">
                                <div className="w-24 h-24 relative flex-shrink-0 border border-gray-100 rounded-sm overflow-hidden">
                                    <Image
                                        src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=200&auto=format&fit=crop"
                                        alt="Apple iPhone 15"
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                                <div>
                                    <Link href="/product/iphone-15" className="text-gray-900 hover:text-primary font-medium text-base mb-1 block">
                                        Apple iPhone 15 (Black, 128 GB)
                                    </Link>
                                    <p className="text-xs text-gray-500 mb-2">Color: Black</p>
                                    <p className="text-sm text-gray-600 mb-2">Seller: OmniTech Retail</p>
                                    <p className="font-bold text-lg text-gray-900">₹79,900</p>
                                </div>
                            </div>

                            {/* Tracker */}
                            <div className="flex-1 lg:max-w-md">
                                <div className="relative pl-6 pb-2">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[9px] top-2 bottom-4 w-[2px] bg-gray-200"></div>

                                    {STEPS.map((step, index) => (
                                        <div key={index} className="relative mb-6 last:mb-0">
                                            {/* Dot */}
                                            <div className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full z-10 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`}></div>

                                            <h4 className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{step.sub}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
