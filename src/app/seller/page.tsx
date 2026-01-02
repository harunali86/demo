'use client';

import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';
import { ArrowRight, CheckCircle, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import Footer from '@/components/ui/Footer';

export default function SellerPage() {
    return (
        <div className="min-h-screen bg-[#f1f3f6] font-sans">
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Sell Online with <span className="text-[#2874f0]">Harun Store</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-lg">
                                Join thousands of sellers who trust us to grow their business. Zero hidden fees, lower commission, and 24/7 seller support.
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <Link
                                    href="/admin"
                                    className="px-8 py-3 bg-[#2874f0] text-white font-medium text-lg rounded-sm shadow-md hover:bg-blue-600 transition flex items-center gap-2"
                                >
                                    Start Selling <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium text-lg rounded-sm hover:bg-gray-50 transition">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
                                <div className="relative w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl rotate-3 shadow-2xl flex items-center justify-center p-8">
                                    <div className="bg-white w-full h-full rounded-xl shadow-inner flex flex-col items-center justify-center text-center p-6 -rotate-3">
                                        <TrendingUp className="w-16 h-16 text-[#2874f0] mb-4" />
                                        <h3 className="text-2xl font-bold text-gray-900">40% Growth</h3>
                                        <p className="text-gray-500">Average growth in 3 months</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Sell on Harun Store?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-[#2874f0]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Reach Millions</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Get access to crores of customers across India. Deliver to 100% of serviceable pincodes.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <TrendingUp className="w-6 h-6 text-[#2874f0]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Lowest Cost of Doing Business</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Enjoy the lowest shipping rates and competitive commission fees in the industry.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <ShieldCheck className="w-6 h-6 text-[#2874f0]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Receive payments directly to your bank account within 7 days of dispatch securely.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How to Start Selling</h2>

                        <div className="flex flex-col md:flex-row gap-8 justify-center">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex-1 max-w-sm mx-auto md:mx-0 text-center">
                                    <div className="w-10 h-10 bg-[#2874f0] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                                        {step}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {step === 1 ? 'Register Account' : step === 2 ? 'List Products' : 'Start Earning'}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {step === 1
                                            ? 'Enter your GSTIN & Bank Details to verify your business.'
                                            : step === 2
                                                ? 'Upload your product catalog and managing your inventory effectively.'
                                                : 'Receive orders and get payments directly in your account.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="py-20 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to start your journey?</h2>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-[#2874f0] text-white font-bold text-lg rounded-sm shadow-lg hover:bg-blue-600 transition"
                    >
                        Become a Seller Today
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
