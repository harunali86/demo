'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';

export default function DealOfTheDay() {
    const dealProduct = PRODUCTS.find(p => p.sale && p.sale > p.price) || PRODUCTS[0];
    const discount = dealProduct.sale ? Math.round(((dealProduct.sale - dealProduct.price) / dealProduct.sale) * 100) : 0;

    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(23, 59, 59, 999);
            const diff = midnight.getTime() - now.getTime();

            if (diff > 0) {
                setTimeLeft({
                    hours: Math.floor(diff / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="bg-white py-4 md:py-6 shadow-sm border border-gray-200 rounded-sm">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-6">
                        <h2 className="text-[20px] font-medium text-gray-900">
                            Deals of the Day
                        </h2>
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-[14px] font-medium">
                                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/deals"
                        className="flex items-center justify-center bg-primary hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2 rounded-[2px] shadow-sm transition-colors"
                    >
                        VIEW ALL
                    </Link>
                </div>

                {/* Deal Content */}
                <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 p-6 rounded-lg border border-gray-100/50">
                    {/* Product Image */}
                    <div className="relative w-full md:w-1/3 aspect-[4/3] bg-white rounded-lg p-6 shadow-sm">
                        <Image
                            src={dealProduct.img}
                            alt={dealProduct.name}
                            fill
                            className="object-contain"
                        />
                        <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-[2px] shadow-sm">
                            {discount}% OFF
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-4">
                        <Link
                            href={`/product/${dealProduct.name.toLowerCase().replace(/ /g, '-')}`}
                            className="block"
                        >
                            <h3 className="text-xl md:text-2xl font-medium text-gray-800 hover:text-primary transition-colors">
                                {dealProduct.name}
                            </h3>
                        </Link>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-[3px]">
                                4.5 <Star className="w-2.5 h-2.5 fill-current" />
                            </div>
                            <span className="text-gray-500 text-sm font-medium">(12,345 Reviews)</span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-medium text-gray-900">₹{dealProduct.price.toLocaleString()}</span>
                                {dealProduct.sale && (
                                    <>
                                        <span className="text-lg text-gray-500 line-through">₹{dealProduct.sale.toLocaleString()}</span>
                                        <span className="text-lg font-medium text-green-600">{discount}% off</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-2">
                            <Link
                                href={`/product/${dealProduct.name.toLowerCase().replace(/ /g, '-')}`}
                                className="px-8 py-3 bg-[#ff9f00] hover:bg-[#f39700] text-white font-medium rounded-[2px] shadow-sm transition-colors"
                            >
                                ADD TO CART
                            </Link>
                            <Link
                                href={`/product/${dealProduct.name.toLowerCase().replace(/ /g, '-')}`}
                                className="px-8 py-3 bg-[#fb641b] hover:bg-[#f45f18] text-white font-medium rounded-[2px] shadow-sm transition-colors"
                            >
                                BUY NOW
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
