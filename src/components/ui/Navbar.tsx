'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, User, ChevronDown, Store, MoreVertical } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import SearchWithSuggestions from './SearchWithSuggestions';

export default function Navbar() {
    const items = useCartStore((state) => state.items);
    const { isAuthenticated, user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-16 bg-white shadow-sm" />;

    return (
        <>
            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-[1248px] mx-auto px-4 h-16 sm:h-[72px]">
                    <div className="flex items-center justify-between h-full gap-4 sm:gap-8">

                        {/* Mobile Menu Trigger & Logo */}
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsMenuOpen(true)} className="sm:hidden p-1 text-gray-600">
                                <Menu className="w-6 h-6" />
                            </button>

                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="relative">
                                    <div className="text-3xl font-black tracking-tighter text-blue-600" style={{ fontFamily: 'cursive' }}>
                                        Harun.
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white"></div>
                                </div>
                            </Link>
                        </div>

                        {/* Search Bar (Desktop) - Centered & Wide */}
                        <div className="hidden sm:block flex-1 max-w-2xl mx-auto">
                            <SearchWithSuggestions className="w-full" />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 sm:gap-8 text-sm font-medium">

                            {/* Login / Account Dropdown */}
                            {isAuthenticated ? (
                                <div className="relative group hidden sm:block">
                                    <button className="flex items-center gap-1 py-2 hover:text-primary transition-colors">
                                        <span className="text-gray-800">{user?.name?.split(' ')[0]}</span>
                                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform" />
                                    </button>

                                    {/* Dropdown Content */}
                                    <div className="absolute right-0 top-full mt-1 w-60 bg-white shadow-xl rounded-lg border border-gray-100 hidden group-hover:block p-1">
                                        <div className="p-3 border-b border-gray-100">
                                            <p className="text-xs text-gray-500">Hello,</p>
                                            <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                                        </div>
                                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700">
                                            <User className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                        <Link href="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700">
                                            <span className="text-primary">📦</span>
                                            Orders
                                        </Link>
                                        <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700">
                                            <span className="text-primary">❤️</span>
                                            Wishlist
                                        </Link>
                                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 border-t border-gray-50">
                                            <span className="text-primary">🛡️</span>
                                            Admin Panel
                                        </Link>
                                        <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-left">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden sm:block px-8 py-2 bg-white text-primary border border-gray-200 hover:bg-primary hover:text-white hover:border-primary font-semibold rounded-[4px] shadow-sm transition-all"
                                >
                                    Login
                                </Link>
                            )}

                            {/* Become a Seller */}
                            <Link href="/seller" className="hidden lg:flex items-center gap-2 text-gray-800 hover:text-primary transition-colors">
                                <Store className="w-4 h-4" />
                                <span>Become a Seller</span>
                            </Link>

                            {/* More Dropdown (Optional placeholder for now) */}
                            <button className="hidden lg:flex items-center gap-1 text-gray-800 hover:text-primary transition-colors">
                                <span>More</span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>

                            {/* Cart */}
                            <Link href="/cart" className="flex items-center gap-2 text-gray-800 hover:text-primary transition-colors group">
                                <div className="relative">
                                    <ShoppingCart className="w-5 h-5" />
                                    {items.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 border-2 border-white">
                                            {items.length}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden sm:block font-semibold">Cart</span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Search - Visible only on mobile */}
                    <div className="sm:hidden pb-3">
                        <SearchWithSuggestions />
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar (Drawer) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] sm:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white overflow-y-auto animate-fadeIn">

                        {/* Header */}
                        <div className="bg-primary p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <User className="w-8 h-8 p-1.5 bg-white/20 rounded-full" />
                                <div>
                                    <p className="text-sm font-medium text-white/80">Welcome</p>
                                    <p className="font-semibold">{isAuthenticated ? user?.name : 'Guest'}</p>
                                </div>
                            </div>
                            {isAuthenticated ? (
                                <button onClick={() => { logout(); setIsMenuOpen(false) }} className="text-xs bg-white/20 px-3 py-1 rounded">Logout</button>
                            ) : (
                                <Link href="/login" className="text-xs bg-white text-primary px-3 py-1 rounded font-bold">Login</Link>
                            )}
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <Link href="/" className="flex items-center gap-4 px-5 py-3.5 text-gray-700 hover:bg-gray-50">
                                <Store className="w-5 h-5 text-gray-400" />
                                <span>Home</span>
                            </Link>
                            <Link href="/category/all" className="flex items-center gap-4 px-5 py-3.5 text-gray-700 hover:bg-gray-50">
                                <span className="w-5 text-center text-lg">💡</span>
                                <span>All Categories</span>
                            </Link>
                            <Link href="/orders" className="flex items-center gap-4 px-5 py-3.5 text-gray-700 hover:bg-gray-50">
                                <span className="w-5 text-center text-lg">📦</span>
                                <span>My Orders</span>
                            </Link>
                            <Link href="/cart" className="flex items-center gap-4 px-5 py-3.5 text-gray-700 hover:bg-gray-50">
                                <span className="w-5 text-center text-lg">🛒</span>
                                <span>My Cart</span>
                            </Link>
                            <Link href="/wishlist" className="flex items-center gap-4 px-5 py-3.5 text-gray-700 hover:bg-gray-50">
                                <span className="w-5 text-center text-lg">❤️</span>
                                <span>My Wishlist</span>
                            </Link>
                            <div className="border-t border-gray-100 my-2"></div>
                            <Link href="/help" className="flex items-center gap-4 px-5 py-3.5 text-gray-700 hover:bg-gray-50">
                                <span className="w-5 text-center text-lg">❓</span>
                                <span>Help Center</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
