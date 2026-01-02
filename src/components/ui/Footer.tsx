'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Truck, Shield, HeadphonesIcon, CreditCard, MessageCircle } from 'lucide-react';

const LINKS = {
    getToKnow: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
    ],
    shop: [
        { name: 'All Products', href: '/products' },
        { name: 'Today\'s Deals', href: '/deals' },
        { name: 'New Arrivals', href: '/products?filter=new' },
    ],
    help: [
        { name: 'Your Account', href: '/profile' },
        { name: 'Your Orders', href: '/orders' },
        { name: 'Returns', href: '/returns' },
        { name: 'Help', href: '/help' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[#232f3e] text-white mt-6">
            {/* Back to Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-3 bg-[#37475a] hover:bg-[#485769] text-[13px] transition-colors"
            >
                Back to top
            </button>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="Harun Store" className="w-8 h-8 brightness-0 invert" />
                            <span className="text-lg font-bold">Harun Store</span>
                        </Link>
                        <div className="text-[12px] text-[#ddd] space-y-2">
                            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Pune, Maharashtra, India</p>
                            <a
                                href="https://wa.me/919876543210"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-white hover:underline transition-all"
                            >
                                <MessageCircle className="w-4 h-4 text-green-500" />
                                <span>Chat on WhatsApp</span>
                            </a>
                            <a
                                href="mailto:harunshaikh270599@gmail.com"
                                className="flex items-center gap-2 hover:text-white hover:underline transition-all"
                            >
                                <Mail className="w-4 h-4 text-orange-500" />
                                <span>harunshaikh270599@gmail.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Get to Know Us */}
                    <div>
                        <h4 className="font-bold text-[14px] mb-3">Get to Know Us</h4>
                        <ul className="space-y-2">
                            {LINKS.getToKnow.map((l) => (
                                <li key={l.name}>
                                    <Link href={l.href} className="text-[13px] text-[#ddd] hover:underline">
                                        {l.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-bold text-[14px] mb-3">Shop With Us</h4>
                        <ul className="space-y-2">
                            {LINKS.shop.map((l) => (
                                <li key={l.name}>
                                    <Link href={l.href} className="text-[13px] text-[#ddd] hover:underline">
                                        {l.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 className="font-bold text-[14px] mb-3">Let Us Help You</h4>
                        <ul className="space-y-2">
                            {LINKS.help.map((l) => (
                                <li key={l.name}>
                                    <Link href={l.href} className="text-[13px] text-[#ddd] hover:underline">
                                        {l.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Features Bar */}
            <div className="border-t border-[#3d4f5f] py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px] text-[#ddd]">
                        <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-[#ff9900]" />
                            <span>FREE Delivery over ₹499</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#ff9900]" />
                            <span>Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HeadphonesIcon className="w-5 h-5 text-[#ff9900]" />
                            <span>24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#ff9900]" />
                            <span>Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-[#131921] py-4">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#999]">
                    <p>© {new Date().getFullYear()} Harun Store. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="hover:underline">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
