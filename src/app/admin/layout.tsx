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
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f172a] border-r border-[#1e293b]
                transform transition-transform lg:transform-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-[#1e293b]">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">H</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-base text-gray-100">Harun Store</h1>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Admin Workspace</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <div className="text-xs font-semibold text-gray-500 mb-2 px-4 uppercase tracking-wider">Main Menu</div>
                        {ADMIN_NAV.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium
                                        ${isActive
                                            ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20'
                                            : 'text-gray-400 hover:bg-[#1e293b] hover:text-gray-200'
                                        }
                                    `}
                                >
                                    <item.icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-gray-500'}`} />
                                    <span>{item.name}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-[#1e293b] space-y-2">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center justify-between gap-3 px-4 py-2.5 text-gray-400 hover:bg-[#1e293b] hover:text-white rounded-lg transition-all group text-sm"
                        >
                            <div className="flex items-center gap-3">
                                <Store className="w-4 h-4" />
                                <span className="font-medium">View Website</span>
                            </div>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/admin/login');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-red-950/30 hover:text-red-400 transition text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#020617]">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-[#020617]/80 backdrop-blur-md border-b border-[#1e293b]">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-[#1e293b] rounded-lg text-gray-400 transition"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            {/* BreadCrumb Placeholder or Page Title could go here */}
                        </div>

                        <div className="ml-auto flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-200">Admin User</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center font-bold text-gray-300 text-sm">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
