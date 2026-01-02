'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const CATEGORIES = [
    { id: 'deals', name: 'Top Offers', img: 'https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100' },
    { id: 'premium_tech', name: 'Mobiles', img: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100' },
    { id: 'fashion', name: 'Fashion', img: 'https://rukminim1.flixcart.com/flap/128/128/image/c12afc017e6f24cb.png?q=100', hasDropdown: true },
    { id: 'electronics', name: 'Electronics', img: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100', hasDropdown: true },
    { id: 'home', name: 'Home & Furniture', img: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100', hasDropdown: true },
    { id: 'appliances', name: 'Appliances', img: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100' },
    { id: 'travel', name: 'Travel', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80' },
    { id: 'beauty', name: 'Beauty, Toys & More', img: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100', hasDropdown: true },
    { id: 'vehicles', name: 'Two Wheelers', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&q=80' },
];

export default function CategoryRail() {
    return (
        <div className="bg-white border-b border-gray-200 shadow-sm mb-4">
            <div className="max-w-[1248px] mx-auto px-4">
                <div className="flex items-center justify-between overflow-x-auto scrollbar-hide py-3">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.id}`}
                            className="flex flex-col items-center group min-w-[80px] cursor-pointer"
                        >
                            <div className="relative w-16 h-16 mb-1 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src={cat.img}
                                    alt={cat.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-sm font-semibold text-gray-800 group-hover:text-primary flex items-center gap-1">
                                {cat.name}
                                {cat.hasDropdown && (
                                    <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-primary transition-transform group-hover:rotate-180" />
                                )}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
