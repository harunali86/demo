'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SLIDES = [
    {
        id: 1,
        tag: 'New Launch',
        title: 'iPhone 15 Pro',
        subtitle: 'Titanium. So strong. So Pro.',
        discount: 'From ₹1,34,900',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&q=90',
        link: '/product/iphone-15-titanium',
        bg: 'bg-black'
    },
    {
        id: 2,
        tag: 'Big Billion Days',
        title: 'Fashion Sale',
        subtitle: '50-80% Off on Top Brands',
        discount: 'Min 50% Off',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=90',
        link: '/category/fashion',
        bg: 'bg-[#f0f0f0]'
    },
    {
        id: 3,
        tag: 'Best Seller',
        title: 'Sony WH-1000XM5',
        subtitle: 'Industry Leading Noise Cancellation',
        discount: 'Special Price ₹26,990',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=90',
        link: '/category/audio',
        bg: 'bg-[#e5e5e5]'
    },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[current];

    return (
        <div className="relative h-[280px] sm:h-[360px] md:h-[420px] bg-white w-full overflow-hidden mx-auto mt-2 px-2 max-w-[1248px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`relative h-full w-full rounded-lg overflow-hidden ${slide.bg}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />

                    <div className="relative z-20 h-full flex items-center px-8 md:px-16">
                        <div className="max-w-xl text-white">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block px-3 py-1 bg-white text-black text-xs font-bold rounded-sm mb-4 uppercase tracking-wider"
                            >
                                {slide.tag}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 shadow-sm"
                            >
                                {slide.title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-100 text-lg md:text-xl mb-4 font-medium"
                            >
                                {slide.subtitle}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-4"
                            >
                                <span className="text-2xl md:text-3xl font-bold text-yellow-400">
                                    {slide.discount}
                                </span>
                                <Link
                                    href={slide.link}
                                    className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded shadow-lg transition-transform hover:scale-105"
                                >
                                    Shop Now
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/90 hover:bg-white shadow-md rounded-r-lg flex items-center justify-center text-gray-800 z-30 transition hidden md:flex"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % SLIDES.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/90 hover:bg-white shadow-md rounded-l-lg flex items-center justify-center text-gray-800 z-30 transition hidden md:flex"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2 rounded-full transition-all duration-300 shadow-sm ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
