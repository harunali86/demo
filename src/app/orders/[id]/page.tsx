'use client';

import { use, useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Package, Truck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [status, setStatus] = useState(0);

    // Simulate status updates
    useEffect(() => {
        const timer = setTimeout(() => setStatus(1), 1000); // Move to "Placed" immediately
        return () => clearTimeout(timer);
    }, []);

    const STEPS = [
        { title: 'Order Placed', icon: ShoppingBag, date: 'Today, 10:30 AM' },
        { title: 'Processing', icon: Package, date: 'Today, 11:45 AM' },
        { title: 'Shipped', icon: Truck, date: 'Expected Tomorrow' },
        { title: 'Out for Delivery', icon: MapPin, date: 'Expected Wed, 24th' },
        { title: 'Delivered', icon: CheckCircle2, date: 'Expected Wed, 24th' },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
            <Navbar />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-gray-400">Order ID: <span className="text-white font-mono font-bold">{id}</span></p>
                </div>

                {/* Timeline */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <Clock className="text-primary" />
                        Order Status
                    </h2>

                    <div className="relative">
                        {/* Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-1 bg-white/10 -z-10" />

                        {STEPS.map((step, index) => {
                            const isActive = index <= status;
                            const isCompleted = index < status;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className={`flex gap-6 mb-8 last:mb-0 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-primary text-white' : 'bg-white/10 text-gray-500'}`}>
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{step.title}</h3>
                                        <p className="text-sm text-gray-400">{step.date}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/" className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </main>
        </div>
    );
}
