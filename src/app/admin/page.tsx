'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Package, ShoppingCart, Users, DollarSign, TrendingUp,
    ArrowRight, AlertTriangle, Star, Clock, RefreshCw, Plus
} from 'lucide-react';

// DEMO MODE - Static mock data
const DEMO_STATS = {
    totalProducts: 24,
    totalOrders: 156,
    totalCustomers: 89,
    totalRevenue: 245600,
    todayOrders: 5,
    todayRevenue: 12450,
    pendingOrders: 3,
    lowStockCount: 2
};

const DEMO_ORDERS = [
    { id: '1', order_number: 'ORD-001', customer_name: 'Rahul Sharma', total: 4599, status: 'delivered', created_at: '2026-01-02' },
    { id: '2', order_number: 'ORD-002', customer_name: 'Priya Patel', total: 2899, status: 'processing', created_at: '2026-01-02' },
    { id: '3', order_number: 'ORD-003', customer_name: 'Amit Kumar', total: 6999, status: 'shipped', created_at: '2026-01-01' },
    { id: '4', order_number: 'ORD-004', customer_name: 'Neha Singh', total: 1499, status: 'pending', created_at: '2026-01-01' },
    { id: '5', order_number: 'ORD-005', customer_name: 'Vikram Joshi', total: 8999, status: 'delivered', created_at: '2026-01-01' },
];

const DEMO_LOW_STOCK = [
    { id: '1', name: 'Wireless Earbuds Pro', stock: 3, image: '/assets/products/earbuds.png' },
    { id: '2', name: 'Smart Watch Ultra', stock: 2, image: '/assets/products/watch.png' },
];

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if admin is logged in (demo mode)
        const session = localStorage.getItem('admin_session');
        if (!session) {
            router.push('/admin/login');
            return;
        }
        // Simulate loading
        setTimeout(() => setLoading(false), 500);
    }, [router]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            shipped: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-sm">Overview of your store performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        DEMO MODE
                    </span>
                    <button
                        onClick={() => setLoading(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition text-sm text-gray-300"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: DEMO_STATS.totalProducts, icon: Package, color: 'text-blue-500', href: '/admin/products' },
                    { label: 'Total Orders', value: DEMO_STATS.totalOrders, icon: ShoppingCart, color: 'text-emerald-500', href: '/admin/orders' },
                    { label: 'Customers', value: DEMO_STATS.totalCustomers, icon: Users, color: 'text-violet-500', href: '/admin/customers' },
                    { label: 'Total Revenue', value: `₹${(DEMO_STATS.totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-amber-500', href: '/admin/reports' },
                ].map((stat, i) => (
                    <Link
                        key={i}
                        href={stat.href}
                        className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 hover:border-[#334155] transition group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg bg-[#1e293b] ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                            <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Today Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 flex items-center gap-4">
                    <div className="p-2.5 bg-[#1e293b] rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-100">{DEMO_STATS.todayOrders}</p>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Today's Orders</p>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 flex items-center gap-4">
                    <div className="p-2.5 bg-[#1e293b] rounded-lg">
                        <DollarSign className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-100">₹{DEMO_STATS.todayRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Today's Revenue</p>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 flex items-center gap-4">
                    <div className="p-2.5 bg-[#1e293b] rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-100">{DEMO_STATS.pendingOrders}</p>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Pending Actions</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#1e293b] flex items-center justify-between bg-[#1e293b]/30">
                        <h2 className="font-semibold text-gray-200">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-orange-500 hover:text-orange-400 text-xs font-medium">View All</Link>
                    </div>

                    <div className="divide-y divide-[#1e293b]">
                        {DEMO_ORDERS.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-4 hover:bg-[#1e293b]/50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center text-xs font-bold text-gray-400 border border-[#334155]">
                                        {order.customer_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">{order.customer_name}</p>
                                        <p className="text-xs text-gray-500 font-mono">#{order.order_number}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-200">₹{order.total.toLocaleString()}</p>
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(order.status)}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#1e293b] flex items-center justify-between bg-[#1e293b]/30">
                        <h2 className="font-semibold text-gray-200 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Low Stock Alerts
                        </h2>
                        <Link href="/admin/inventory" className="text-orange-500 hover:text-orange-400 text-xs font-medium">Manage</Link>
                    </div>

                    <div className="divide-y divide-[#1e293b]">
                        {DEMO_LOW_STOCK.map((product) => (
                            <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-[#1e293b]/50 transition">
                                <div className="w-10 h-10 rounded bg-[#1e293b] border border-[#334155] flex items-center justify-center">
                                    <Package className="w-5 h-5 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-gray-200">{product.name}</p>
                                    <p className="text-xs text-amber-500 font-medium mt-0.5 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Only {product.stock} units remaining
                                    </p>
                                </div>
                                <button className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-gray-300 text-xs rounded-md font-medium transition-colors">
                                    Restock
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Add Product', icon: Plus, href: '/admin/products/new' },
                    { label: 'View Orders', icon: ShoppingCart, href: '/admin/orders' },
                    { label: 'New Coupon', icon: Star, href: '/admin/coupons' },
                    { label: 'View Reports', icon: TrendingUp, href: '/admin/reports' },
                ].map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className="flex flex-col items-center gap-3 p-6 bg-[#0f172a] border border-[#1e293b] rounded-xl hover:border-orange-500/50 hover:bg-[#1e293b] transition group"
                    >
                        <div className="p-2.5 rounded-full bg-[#1e293b] text-gray-400 group-hover:text-orange-500 group-hover:scale-110 transition-all">
                            <action.icon className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm text-gray-400 group-hover:text-gray-200">{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
