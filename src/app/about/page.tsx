import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ShoppingBag, Users, Award, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6">About Harun Store</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Your trusted destination for premium products at unbeatable prices
                    </p>
                </div>

                {/* Story */}
                <div className="mb-16">
                    <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 rounded-3xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-4">
                            Harun Store was founded with a simple mission: to provide customers with high-quality
                            products at affordable prices, backed by exceptional customer service.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Based in Pune, India, we've grown from a small online shop to a trusted e-commerce
                            destination serving customers across the country. We believe in quality, transparency,
                            and putting our customers first.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {[
                        { icon: ShoppingBag, stat: '10K+', label: 'Products' },
                        { icon: Users, stat: '50K+', label: 'Happy Customers' },
                        { icon: Award, stat: '100+', label: 'Brands' },
                        { icon: Heart, stat: '4.8', label: 'Rating' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                            <item.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                            <p className="text-3xl font-bold mb-1">{item.stat}</p>
                            <p className="text-gray-400">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Values */}
                <div>
                    <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-3 text-primary">Quality First</h3>
                            <p className="text-gray-400">We carefully curate every product to ensure it meets our high standards.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-3 text-primary">Customer Focus</h3>
                            <p className="text-gray-400">Your satisfaction is our priority. We're here to help 24/7.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-3 text-primary">Fair Pricing</h3>
                            <p className="text-gray-400">Premium products don't have to break the bank. We keep prices honest.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
