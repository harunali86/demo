import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Package, Search, Truck, CheckCircle } from 'lucide-react';

export default function TrackOrderPage() {
    return (
        <main className="min-h-screen bg-[#f1f3f6] font-sans">
            <Navbar />
            <div className="max-w-[1248px] mx-auto px-4 py-8">

                <div className="bg-white rounded-[2px] shadow-sm p-8 max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-xl font-medium text-gray-900 mb-2">Track Your Order</h1>
                        <p className="text-sm text-gray-500">Enter your order number to track your shipment</p>
                    </div>

                    {/* Track Form */}
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-sm text-gray-500 mb-1">Order Number</label>
                            <input
                                type="text"
                                placeholder="Enter your order number (e.g., ORD-123456)"
                                className="w-full border-b border-gray-300 py-2 focus:border-[#2874f0] outline-none text-gray-700 transition"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="Email used for order"
                                className="w-full border-b border-gray-300 py-2 focus:border-[#2874f0] outline-none text-gray-700 transition"
                            />
                        </div>
                        <button className="w-full py-3 bg-[#fb641b] text-white font-medium rounded-[2px] shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 uppercase text-sm mt-6">
                            <Search className="w-4 h-4" />
                            Track Order
                        </button>
                    </div>
                </div>

                {/* How it works */}
                <div className="mt-12 bg-white rounded-[2px] shadow-sm p-8 max-w-4xl mx-auto">
                    <h2 className="text-lg font-medium mb-8 text-center border-b border-gray-100 pb-4">Order Tracking Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: Package, title: 'Order Placed', desc: 'We received your order' },
                            { icon: CheckCircle, title: 'Processing', desc: 'Preparing your items' },
                            { icon: Truck, title: 'Shipped', desc: 'On the way to you' },
                            { icon: CheckCircle, title: 'Delivered', desc: 'Enjoy your purchase!' },
                        ].map((step, i) => (
                            <div key={i} className="text-center relative">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center relative z-10">
                                    <step.icon className="w-8 h-8 text-[#2874f0]" />
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
                                <p className="text-xs text-gray-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
