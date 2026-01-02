'use client';

import Link from 'next/link';
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const FOOTER_LINKS = {
    about: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Stories', href: '/blog' },
        { name: 'Press', href: '/press' },
    ],
    help: [
        { name: 'Payments', href: '/payments' },
        { name: 'Shipping', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'FAQ', href: '/faq' },
    ],
    policy: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Security', href: '/security' },
        { name: 'Sitemap', href: '/sitemap' },
    ]
};

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-white border-t-4 border-[#2874f0] font-sans pb-10" style={{ color: 'white' }}>
            {/* Newsletter & Main Links Section */}
            <div className="max-w-[1248px] mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

                    {/* Brand & Newsletter (Compact on Mobile) */}
                    <div className="col-span-1 md:col-span-4 lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#2874f0] flex items-center justify-center font-bold text-lg md:text-xl italic text-white shadow-lg shadow-blue-500/30">H</div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Harun Store</h2>
                        </div>
                        <p className="text-white text-opacity-70 text-xs md:text-sm leading-relaxed max-w-sm hidden md:block">
                            Your premium destination for quality products. Experience the best in class shopping with our curated collections.
                        </p>

                        <div className="pt-2 hidden md:block">
                            <h5 className="text-white text-sm font-bold mb-2 uppercase tracking-wide">Subscribe to our newsletter</h5>
                            <form className="flex gap-2 max-w-sm">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm w-full text-white placeholder:text-gray-300 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-all"
                                />
                                <button className="bg-[#2874f0] hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/50">
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Links Grid (Tighter on Mobile) */}
                    <div className="col-span-1 md:col-span-8 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 pt-2">
                        <div>
                            <h4 className="font-bold text-gray-400 mb-3 text-xs uppercase tracking-wider">About</h4>
                            <ul className="space-y-2 text-sm text-white font-medium">
                                {FOOTER_LINKS.about.map((l) => (
                                    <li key={l.name}><Link href={l.href} className="hover:text-[#2874f0] hover:underline transition-all block py-0.5">{l.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-400 mb-3 text-xs uppercase tracking-wider">Help</h4>
                            <ul className="space-y-2 text-sm text-white font-medium">
                                {FOOTER_LINKS.help.map((l) => (
                                    <li key={l.name}><Link href={l.href} className="hover:text-[#2874f0] hover:underline transition-all block py-0.5">{l.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-400 mb-3 text-xs uppercase tracking-wider">Policy</h4>
                            <ul className="space-y-2 text-sm text-white font-medium">
                                {FOOTER_LINKS.policy.map((l) => (
                                    <li key={l.name}><Link href={l.href} className="hover:text-[#2874f0] hover:underline transition-all block py-0.5">{l.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact (Simplified on Mobile) */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-3 mt-4 md:mt-0">
                        <div className="md:bg-[#1e293b] md:rounded-xl md:p-6 md:border md:border-white/10 md:shadow-lg space-y-4">
                            <h4 className="font-bold text-gray-400 md:text-white mb-2 md:mb-4 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
                                <span className="hidden md:inline"><MessageCircle className="w-4 h-4 text-[#2874f0]" /></span> Contact Us
                            </h4>

                            <div className="space-y-3 text-sm text-white">
                                <div className="flex items-start gap-3 group">
                                    <MapPin className="w-4 h-4 text-[#2874f0] flex-shrink-0 mt-0.5" />
                                    <p className="leading-relaxed text-xs text-gray-300">
                                        Harun Tech Hub, IT Park, Viman Nagar, Pune, 411014
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-[#2874f0] flex-shrink-0" />
                                    <a href="tel:+918329320708" className="font-medium hover:text-[#2874f0] transition-colors text-sm">
                                        +91 83293 20708
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-[#2874f0] flex-shrink-0" />
                                    <a href="mailto:harunshaikh270599@gmail.com" className="font-medium hover:text-[#2874f0] transition-colors text-sm break-all">
                                        harunshaikh270599@gmail.com
                                    </a>
                                </div>

                                {/* Social Icons */}
                                <div className="flex gap-4 pt-2 md:pt-4 md:border-t md:border-white/10 mt-2">
                                    <a href="#" className="text-gray-400 hover:text-[#1877F2] transition-colors"><Facebook className="w-5 h-5" /></a>
                                    <a href="#" className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter className="w-5 h-5" /></a>
                                    <a href="#" className="text-gray-400 hover:text-[#FF0000] transition-colors"><Youtube className="w-5 h-5" /></a>
                                    <a href="#" className="text-gray-400 hover:text-[#E4405F] transition-colors"><Instagram className="w-5 h-5" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-black/30">
                <div className="max-w-[1248px] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <Link href="/seller" className="hover:text-white flex items-center gap-1.5 transition-colors font-medium text-white">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" />
                            Become a Seller
                        </Link>
                        <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>© 2024 HarunStore</span>
                        <img
                            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg"
                            alt="Payments"
                            className="h-3 md:h-4 opacity-70 hover:opacity-100 transition-all"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}
