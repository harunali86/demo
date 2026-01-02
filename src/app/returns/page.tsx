import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { RotateCcw, Package, CheckCircle, Clock } from 'lucide-react';

export default function ReturnsPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
                    <p className="text-gray-400">Easy returns within 7 days of delivery</p>
                </div>

                {/* Return Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-bold mb-2">1. Request Return</h3>
                        <p className="text-sm text-gray-400">Go to My Orders and click "Return" on the item</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <RotateCcw className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-bold mb-2">2. Pack & Ship</h3>
                        <p className="text-sm text-gray-400">We'll arrange pickup or you can drop off</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-bold mb-2">3. Get Refund</h3>
                        <p className="text-sm text-gray-400">Refund processed within 5-7 business days</p>
                    </div>
                </div>

                {/* Policy */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Return Policy</h2>
                    <div className="space-y-4 text-gray-300">
                        <p><strong className="text-white">Eligibility:</strong> Products can be returned within 7 days of delivery if unused and in original packaging.</p>
                        <p><strong className="text-white">Non-Returnable:</strong> Underwear, swimwear, perishable items, personalized products, and opened software.</p>
                        <p><strong className="text-white">Refund Method:</strong> Refunds will be credited to your original payment method.</p>
                        <p><strong className="text-white">Processing Time:</strong> Refunds are processed within 5-7 business days after we receive the item.</p>
                        <p><strong className="text-white">Damaged Items:</strong> If you receive a damaged item, contact us within 48 hours with photos.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
