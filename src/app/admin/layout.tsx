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
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // We must allow access to /admin/login without auth.
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                } else {
                    // We are on login page, allow rendering content (which is the login form)
                    // Technically not authenticated but allowed to view the login form.
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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    // Don't show layout for login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-white flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-[#2a2a38]
                transform transition-transform lg:transform-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-[#2a2a38]">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <span className="text-white font-bold text-xl">H</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-white">Harun Store</h1>
                                <p className="text-xs text-gray-400">Admin Panel</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {ADMIN_NAV.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                                        ${isActive
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                            : 'text-gray-400 hover:bg-[#1a1a24] hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-[#2a2a38] space-y-2">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center justify-between gap-3 px-4 py-3 bg-[#1a1a24] border border-[#2a2a38] text-orange-500 hover:bg-[#2a2a38] rounded-xl transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <Store className="w-5 h-5" />
                                <span className="font-medium">Back to Website</span>
                            </div>
                            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                        </Link>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/admin/login');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-[#2a2a38]">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-[#1a1a24] rounded-lg text-gray-400 hover:text-white transition"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="ml-auto flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">Admin User</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#1a1a24] border border-[#2a2a38] flex items-center justify-center font-bold text-orange-500">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
