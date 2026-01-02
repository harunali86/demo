'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tags,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Store,
    Boxes,
    Tag,
    BarChart3,
    ExternalLink
} from 'lucide-react';
import Image from 'next/image';

const ADMIN_NAV = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setIsAuthenticated(false);
                router.push('/admin/login');
            } else if (session) {
                setIsAuthenticated(true);
                setIsLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkAuth = async () => {
        try {
            // DEMO: Check for local admin session first
            const localSession = typeof window !== 'undefined' ? localStorage.getItem('admin_session') : null;
            if (localSession) {
                setIsAuthenticated(true);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // We must allow access to /admin/login without auth.
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                } else {
                    setIsAuthenticated(true);
                }
            } else {
                setIsAuthenticated(true);
                if (pathname === '/admin/login') {
                    router.push('/admin');
                }
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't show layout for login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
                transform transition-transform lg:transform-none shadow-sm lg:shadow-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#2874f0] flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-lg">H</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-base text-gray-900 leading-tight">Harun Store</h1>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Admin Panel</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <div className="text-xs font-bold text-gray-400 mb-2 px-4 uppercase tracking-wider">Main Menu</div>
                        {ADMIN_NAV.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-2.5 rounded-[2px] transition-all text-sm font-medium
                                        ${isActive
                                            ? 'bg-blue-50 text-blue-700 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                    <span>{item.name}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 space-y-2">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center justify-between gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-[2px] transition-all group text-sm font-medium"
                        >
                            <div className="flex items-center gap-3">
                                <Store className="w-4 h-4" />
                                <span className="font-medium">View Website</span>
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-primary transition-colors" />
                        </Link>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/admin/login');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[2px] text-gray-600 hover:bg-red-50 hover:text-red-600 transition text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#f1f3f6]">
                {/* Top Bar for Mobile Menu */}
                <header className="bg-white border-b border-gray-200 lg:hidden sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-gray-50 rounded-md text-gray-600 transition"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <span className="font-bold text-gray-900">Admin Panel</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-primary text-xs">
                            AD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
