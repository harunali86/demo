'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Star } from 'lucide-react';
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
        <section className="bg-white dark:bg-[#1a1a1a] py-5 mx-4 rounded shadow-card">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[21px] font-bold text-[#0f1111] dark:text-[#e3e6e6]">
                            Deal of the Day
                        </h2>
                        <div className="flex items-center gap-1 text-[13px] text-[#565959] dark:text-[#999]">
                            <span>Ends in</span>
                            <span className="font-mono bg-[#0f1111] text-white px-2 py-1 rounded text-[12px]">
                                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/deals"
                        className="flex items-center gap-1 text-[13px] text-[#007185] dark:text-[#56c5d3] hover:text-[#c45500] hover:underline"
                    >
                        See all deals
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Deal Content */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-full md:w-64">
                        <div className="relative aspect-square bg-white dark:bg-[#1a1a1a]">
                            <Image
                                src={dealProduct.img}
                                alt={dealProduct.name}
                                fill
                                className="object-contain p-4"
                            />
                            {/* Deal badge */}
                            <div className="absolute top-2 left-2 bg-[#cc0c39] text-white text-[11px] font-bold px-2 py-1">
                                {discount}% off
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                        <span className="inline-block bg-[#cc0c39] text-white text-[11px] font-bold px-2 py-1 mb-2">
                            Deal of the Day
                        </span>

                        <Link
                            href={`/product/${dealProduct.name.toLowerCase().replace(/ /g, '-')}`}
                            className="block"
                        >
                            <h3 className="text-[16px] text-[#0f1111] dark:text-[#e3e6e6] hover:text-[#c45500] dark:hover:text-[#ff9900] mb-2">
                                {dealProduct.name}
                            </h3>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                            <div className="flex text-[#de7921]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <span className="text-[12px] text-[#007185] dark:text-[#56c5d3]">12,345</span>
                        </div>

                        {/* Price */}
                        <div className="mb-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-[12px] text-[#cc0c39] font-medium">-{discount}%</span>
                                <span className="text-[28px] text-[#0f1111] dark:text-[#e3e6e6]">
                                    <span className="text-[12px] align-top">₹</span>
                                    {dealProduct.price.toLocaleString()}
                                </span>
                            </div>
                            {dealProduct.sale && (
                                <p className="text-[12px] text-[#565959] dark:text-[#999]">
                                    M.R.P.: <span className="line-through">₹{dealProduct.sale.toLocaleString()}</span>
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <Link
                                href={`/product/${dealProduct.name.toLowerCase().replace(/ /g, '-')}`}
                                className="px-6 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-[13px] font-medium rounded-full border border-[#fcd200]"
                            >
                                Add to Cart
                            </Link>
                            <Link
                                href={`/product/${dealProduct.name.toLowerCase().replace(/ /g, '-')}`}
                                className="px-6 py-2 bg-[#ffa41c] hover:bg-[#ff9900] text-[#0f1111] text-[13px] font-medium rounded-full border border-[#ff8f00]"
                            >
                                Buy Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
