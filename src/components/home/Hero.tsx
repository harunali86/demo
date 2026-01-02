'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero_premium_bg.png"
                    alt="Premium Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/50" />
            </div>

            <div className="container mx-auto px-4 z-10 pt-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-primary mb-8"
                        >
                            <Sparkles className="w-4 h-4 fill-primary" />
                            <span>New Collection 2026</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-[0.9]">
                            Define Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Excellence</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-lg">
                            Experience the pinnacle of luxury and performance. Harun Store brings you a curated selection of premium essentials.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/shop" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold flex items-center gap-3 overflow-hidden transition-transform hover:scale-105">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="relative z-10">Start Shopping</span>
                            </Link>

                            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-bold text-white flex items-center gap-3 hover:scale-105 transition-all backdrop-blur-sm">
                                <Play className="w-5 h-5 fill-current" />
                                <span>Watch Film</span>
                            </button>
                        </div>

                        <div className="mt-12 flex gap-8">
                            <div>
                                <p className="text-3xl font-bold text-white">2.5k+</p>
                                <p className="text-sm text-gray-400">Premium Products</p>
                            </div>
                            <div className="w-px bg-white/10 h-10" />
                            <div>
                                <p className="text-3xl font-bold text-white">24h</p>
                                <p className="text-sm text-gray-400">Fast Delivery</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Visual (Floating Cards/Products) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="hidden lg:block relative h-[600px] w-full"
                    >
                        {/* Abstract Floating UI Elements for "Tech" Feel */}
                        <div className="absolute top-10 right-10 w-72 h-40 glass-card rounded-2xl p-4 animate-[slideUp_3s_infinite_alternate]">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Order Placed</p>
                                    <p className="text-xs text-gray-400">Just now</p>
                                </div>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                                <div className="h-full w-2/3 bg-primary rounded-full animate-[width_2s_ease-out]" />
                            </div>
                        </div>

                        <div className="absolute bottom-20 left-10 w-64 h-80 glass-card rounded-2xl p-6 border-primary/20">
                            <div className="w-full h-40 bg-gradient-to-tr from-gray-800 to-black rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-xs text-gray-500">Premium Item</span>
                            </div>
                            <p className="text-lg font-bold text-white">Sony XM5</p>
                            <p className="text-primary text-sm font-bold mt-1">₹29,990</p>
                            <button className="mt-4 w-full py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200">View</button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
