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
        discount: 'Up to 20% Off',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
        link: '/product/iphone-15-titanium',
    },
    {
        id: 2,
        tag: 'Trending',
        title: 'Fashion Week',
        subtitle: 'New arrivals for the season',
        discount: 'Min 50% Off',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&q=80',
        link: '/category/fashion',
    },
    {
        id: 3,
        tag: 'Best Seller',
        title: 'Premium Audio',
        subtitle: 'Experience true sound',
        discount: 'Starting ₹999',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        link: '/category/audio',
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
        <div className="relative h-[380px] md:h-[450px] overflow-hidden bg-gray-900">


            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative h-full max-w-7xl mx-auto px-4 md:px-8"
                >
                    <div className="h-full flex items-center">
                        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-center md:text-left"
                            >
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-block px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full mb-4"
                                >
                                    {slide.tag}
                                </motion.span>

                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3"
                                >
                                    {slide.title}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-gray-300 text-lg mb-2"
                                >
                                    {slide.subtitle}
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.55 }}
                                    className="text-green-400 text-xl font-bold mb-6"
                                >
                                    {slide.discount}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Link
                                        href={slide.link}
                                        className="inline-block px-8 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-lg"
                                    >
                                        Shop Now
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Product Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="hidden md:flex justify-center items-center"
                            >
                                <div className="relative w-72 h-72 lg:w-80 lg:h-80">
                                    <motion.div
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            width={320}
                                            height={320}
                                            className="object-contain drop-shadow-2xl"
                                            priority
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <button
                onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>
    );
}
