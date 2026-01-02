import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { Tag, Zap, Clock, ArrowRight } from 'lucide-react';

export default function DealsPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Deals & Offers</h1>
                    <p className="text-gray-400">Grab the best deals before they're gone!</p>
                </div>

                {/* Banner */}
                <div className="bg-gradient-to-r from-primary to-pink-500 rounded-3xl p-8 text-center mb-12">
                    <Zap className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2">New Year Sale!</h2>
                    <p className="text-lg mb-4">Up to 50% off on selected items</p>
                    <Link href="/products" className="inline-block px-8 py-3 bg-black text-white font-bold rounded-xl">
                        Shop Now
                    </Link>
                </div>

                {/* Deal Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition">
                        <div className="flex items-center gap-3 mb-4">
                            <Tag className="w-8 h-8 text-primary" />
                            <h3 className="text-xl font-bold">Flash Deals</h3>
                        </div>
                        <p className="text-gray-400 mb-4">Limited time offers that won't last long</p>
                        <Link href="/products?filter=flash" className="text-primary flex items-center gap-1">
                            View Deals <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-8 h-8 text-yellow-500" />
                            <h3 className="text-xl font-bold">Clearance</h3>
                        </div>
                        <p className="text-gray-400 mb-4">Up to 70% off on clearance items</p>
                        <Link href="/products?filter=clearance" className="text-primary flex items-center gap-1">
                            View Deals <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="w-8 h-8 text-green-500" />
                            <h3 className="text-xl font-bold">Daily Deals</h3>
                        </div>
                        <p className="text-gray-400 mb-4">New deals every day at midnight</p>
                        <Link href="/products?filter=daily" className="text-primary flex items-center gap-1">
                            View Deals <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
