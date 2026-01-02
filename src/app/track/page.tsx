import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Package, Search, Truck, CheckCircle } from 'lucide-react';

export default function TrackOrderPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
                    <p className="text-gray-400">Enter your order number to track your shipment</p>
                </div>

                {/* Track Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Order Number</label>
                            <input
                                type="text"
                                placeholder="Enter your order number (e.g., ORD-123456)"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="Email used for order"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                            />
                        </div>
                        <button className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2">
                            <Search className="w-5 h-5" />
                            Track Order
                        </button>
                    </div>
                </div>

                {/* How it works */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold mb-6 text-center">Order Tracking Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { icon: Package, title: 'Order Placed', desc: 'We received your order' },
                            { icon: CheckCircle, title: 'Processing', desc: 'Preparing your items' },
                            { icon: Truck, title: 'Shipped', desc: 'On the way to you' },
                            { icon: CheckCircle, title: 'Delivered', desc: 'Enjoy your purchase!' },
                        ].map((step, i) => (
                            <div key={i} className="text-center p-4">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                                    <step.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-bold">{step.title}</h3>
                                <p className="text-sm text-gray-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
