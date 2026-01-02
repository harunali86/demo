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
            <div className="max-w-[1248px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Brand & Newsletter */}
                    <div className="col-span-1 md:col-span-4 lg:col-span-4 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#2874f0] flex items-center justify-center font-bold text-xl italic text-white shadow-lg shadow-blue-500/30">H</div>
                            <h2 className="text-2xl font-bold tracking-tight text-white">Harun Store</h2>
                        </div>
                        <p className="text-white text-opacity-90 text-sm leading-relaxed max-w-sm">
                            Your premium destination for quality products. Experience the best in class shopping with our curated collections.
                        </p>

                        <div className="pt-2">
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

                    {/* Links Grid */}
                    <div className="col-span-1 md:col-span-8 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2">
                        <div>
                            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider border-b border-white/20 pb-2 w-fit">About</h4>
                            <ul className="space-y-3 text-sm text-white text-opacity-80">
                                {FOOTER_LINKS.about.map((l) => (
                                    <li key={l.name}><Link href={l.href} className="text-white hover:text-[#2874f0] hover:translate-x-1 transition-all inline-block hover:font-medium">{l.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider border-b border-white/20 pb-2 w-fit">Help</h4>
                            <ul className="space-y-3 text-sm text-white text-opacity-80">
                                {FOOTER_LINKS.help.map((l) => (
                                    <li key={l.name}><Link href={l.href} className="text-white hover:text-[#2874f0] hover:translate-x-1 transition-all inline-block hover:font-medium">{l.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider border-b border-white/20 pb-2 w-fit">Policy</h4>
                            <ul className="space-y-3 text-sm text-white text-opacity-80">
                                {FOOTER_LINKS.policy.map((l) => (
                                    <li key={l.name}><Link href={l.href} className="text-white hover:text-[#2874f0] hover:translate-x-1 transition-all inline-block hover:font-medium">{l.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-3">
                        <div className="bg-[#1e293b] rounded-xl p-6 border border-white/10 shadow-lg">
                            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-[#2874f0]" /> Contact Us
                            </h4>
                            <div className="space-y-4 text-sm text-white">
                                <div className="flex items-start gap-3 group">
                                    <div className="p-2 bg-[#2874f0]/10 rounded-lg group-hover:bg-[#2874f0]/20 transition-colors">
                                        <MapPin className="w-4 h-4 text-[#2874f0]" />
                                    </div>
                                    <p className="leading-relaxed text-xs text-gray-200">
                                        Harun Tech Hub, IT Park,<br />
                                        Viman Nagar, Pune,<br />
                                        Maharashtra, 411014, India
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <div className="p-2 bg-[#2874f0]/10 rounded-lg group-hover:bg-[#2874f0]/20 transition-colors">
                                        <Phone className="w-4 h-4 text-[#2874f0]" />
                                    </div>
                                    <a href="tel:+918329320708" className="font-medium text-white hover:text-[#2874f0] transition-colors">
                                        +91 83293 20708
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <div className="p-2 bg-[#2874f0]/10 rounded-lg group-hover:bg-[#2874f0]/20 transition-colors">
                                        <Mail className="w-4 h-4 text-[#2874f0]" />
                                    </div>
                                    <a href="mailto:harunshaikh270599@gmail.com" className="font-medium text-white hover:text-[#2874f0] transition-colors break-all">
                                        harunshaikh270599@gmail.com
                                    </a>
                                </div>

                                {/* Social Icons */}
                                <div className="flex gap-3 pt-4 border-t border-white/10 mt-4">
                                    <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all text-white border border-white/10 hover:border-transparent group">
                                        <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all text-white border border-white/10 hover:border-transparent group">
                                        <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all text-white border border-white/10 hover:border-transparent group">
                                        <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-all text-white border border-white/10 hover:border-transparent group">
                                        <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-black/30">
                <div className="max-w-[1248px] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-300">
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/seller" className="hover:text-white flex items-center gap-1.5 transition-colors font-medium text-white">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" />
                            Become a Seller
                        </Link>
                        <Link href="/advertise" className="hover:text-white transition-colors font-medium">Advertise</Link>
                        <Link href="/gift-cards" className="hover:text-white transition-colors font-medium">Gift Cards</Link>
                        <Link href="/help" className="hover:text-white transition-colors font-medium">Help Center</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="text-gray-400">© 2024 HarunStore.com</p>
                        <img
                            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg"
                            alt="Payments"
                            className="h-4 opacity-90 hover:opacity-100 transition-all cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}
