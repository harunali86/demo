'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, User, Heart, X, MapPin } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import { useLocationStore } from '@/store/location';

const LocationDisplay = () => {
    const { location, fullAddress, setModalOpen } = useLocationStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="flex flex-col min-w-[100px] animate-pulse">
            <div className="h-3 w-12 bg-white/10 rounded mb-1"></div>
            <div className="h-4 w-20 bg-white/10 rounded"></div>
        </div>
    );

    const displayText = fullAddress?.city
        ? `${fullAddress.city} ${fullAddress.pincode}`
        : location !== 'Select Location' ? location : 'Select Location';

    return (
        <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 hover:bg-[#1a1a24] p-2 rounded-xl transition-colors text-left group"
        >
            <MapPin className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
            <div className="leading-tight">
                <p className="text-[10px] text-[#a0a0b0] font-medium">Deliver to</p>
                <p className="text-sm font-bold text-[#f0f0f5] line-clamp-1 max-w-[140px]">
                    {displayText}
                </p>
            </div>
        </button>
    );
};

export default function Navbar() {
    const items = useCartStore((state) => state.items);
    const wishlistItems = useWishlistStore((state) => state.items);
    const { isAuthenticated, user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${searchQuery}`;
        }
    };

    return (
        <>
            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 bg-[#0d0d12]/95 backdrop-blur-md border-b border-[#2a2a38]">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">H</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-white font-bold">Harun</span>
                                <span className="text-orange-400 font-bold">Store</span>
                            </div>
                        </Link>

                        {/* Location / Deliver To */}
                        <div className="hidden md:block">
                            <LocationDisplay />
                        </div>

                        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2.5 pl-10 bg-[#1a1a24] border border-[#2a2a38] rounded-xl text-[#f0f0f5] placeholder-[#606070] focus:border-orange-500 focus:outline-none"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606070]" />
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Account */}
                            <Link href={isAuthenticated ? "/profile" : "/login"} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#1a1a24] transition">
                                <User className="w-5 h-5 text-[#a0a0b0]" />
                                <span className="text-sm text-[#f0f0f5]">
                                    {isAuthenticated ? user?.name?.split(' ')[0] : 'Login'}
                                </span>
                            </Link>

                            {/* Wishlist */}
                            <Link href="/wishlist" className="relative p-2 rounded-xl hover:bg-[#1a1a24] transition">
                                <Heart className="w-5 h-5 text-[#a0a0b0]" />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="relative p-2 rounded-xl hover:bg-[#1a1a24] transition">
                                <ShoppingCart className="w-5 h-5 text-[#a0a0b0]" />
                                {items.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {items.length}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu */}
                            <button onClick={() => setIsMenuOpen(true)} className="sm:hidden p-2">
                                <Menu className="w-5 h-5 text-[#f0f0f5]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Categories Bar */}
                <div className="border-t border-[#2a2a38] px-4 py-2 overflow-x-auto scrollbar-hide">
                    <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm">
                        <Link href="/deals" className="text-orange-500 font-medium whitespace-nowrap hover:text-orange-400">🔥 Deals</Link>
                        <Link href="/category/premium_tech" className="text-[#a0a0b0] whitespace-nowrap hover:text-orange-500">Electronics</Link>
                        <Link href="/category/fashion" className="text-[#a0a0b0] whitespace-nowrap hover:text-orange-500">Fashion</Link>
                        <Link href="/category/audio" className="text-[#a0a0b0] whitespace-nowrap hover:text-orange-500">Audio</Link>
                        <Link href="/category/gaming" className="text-[#a0a0b0] whitespace-nowrap hover:text-orange-500">Gaming</Link>
                        <Link href="/help" className="text-[#a0a0b0] whitespace-nowrap hover:text-orange-500">Help</Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] sm:hidden">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#12121a] border-l border-[#2a2a38]">
                        <div className="p-4 border-b border-[#2a2a38] flex items-center justify-between">
                            <span className="text-[#f0f0f5] font-bold">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)}>
                                <X className="w-5 h-5 text-[#a0a0b0]" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <Link href={isAuthenticated ? "/profile" : "/login"} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a24]" onClick={() => setIsMenuOpen(false)}>
                                <User className="w-5 h-5 text-orange-500" />
                                <span className="text-[#f0f0f5]">{isAuthenticated ? 'My Account' : 'Login'}</span>
                            </Link>
                            <Link href="/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a24]" onClick={() => setIsMenuOpen(false)}>
                                <span className="text-[#f0f0f5]">My Orders</span>
                            </Link>
                            <Link href="/wishlist" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a24]" onClick={() => setIsMenuOpen(false)}>
                                <Heart className="w-5 h-5 text-orange-500" />
                                <span className="text-[#f0f0f5]">Wishlist</span>
                            </Link>
                            {isAuthenticated && (
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left p-3 text-[#ef4444] rounded-xl hover:bg-[#1a1a24]">
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
