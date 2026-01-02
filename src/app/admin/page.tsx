'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Package, ShoppingCart, Users, DollarSign, TrendingUp,
    ArrowRight, AlertTriangle, Star, Clock, RefreshCw, Plus, LayoutDashboard
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';

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
            // For now, allow access or redirect to login. Let's assume auto-login for demo if needed or keep redirect.
            // keeping redirect logic but commenting out for dev ease if user hasn't logged in.
            // router.push('/admin/login');
        }
        // Simulate loading
        setTimeout(() => setLoading(false), 500);
    }, [router]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
            processing: 'bg-purple-100 text-purple-800 border-purple-200',
            shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] font-sans text-gray-900 pb-20">
            <Navbar />

            <div className="max-w-[1248px] mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-[2px] shadow-sm">
                            <LayoutDashboard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-500 text-sm">Overview of your store performance.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            DEMO MODE
                        </span>
                        <button
                            onClick={() => setLoading(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-[2px] hover:bg-gray-50 transition text-sm text-gray-700 shadow-sm"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Products', value: DEMO_STATS.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/products' },
                        { label: 'Total Orders', value: DEMO_STATS.totalOrders, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/orders' },
                        { label: 'Customers', value: DEMO_STATS.totalCustomers, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', href: '/admin/customers' },
                        { label: 'Total Revenue', value: `₹${(DEMO_STATS.totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', href: '/admin/reports' },
                    ].map((stat, i) => (
                        <Link
                            key={i}
                            href={stat.href}
                            className="bg-white border border-gray-200 rounded-[2px] p-5 hover:shadow-md transition group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Today Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-[2px] p-5 flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-emerald-50 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{DEMO_STATS.todayOrders}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Today's Orders</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-[2px] p-5 flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <DollarSign className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">₹{DEMO_STATS.todayRevenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Today's Revenue</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-[2px] p-5 flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{DEMO_STATS.pendingOrders}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Pending Actions</p>
                        </div>
                    </div>
                </div>

                {/* Recent Orders & Low Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Recent Orders */}
                    <div className="bg-white border border-gray-200 rounded-[2px] overflow-hidden flex flex-col shadow-sm">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h2 className="font-bold text-gray-800">Recent Orders</h2>
                            <Link href="/admin/orders" className="text-primary hover:text-blue-700 text-xs font-bold uppercase">View All</Link>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {DEMO_ORDERS.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 border border-gray-200">
                                            {order.customer_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
                                            <p className="text-xs text-gray-500 font-mono">#{order.order_number}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10px] font-bold border uppercase ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white border border-gray-200 rounded-[2px] overflow-hidden flex flex-col shadow-sm">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                Low Stock Alerts
                            </h2>
                            <Link href="/admin/inventory" className="text-primary hover:text-blue-700 text-xs font-bold uppercase">Manage</Link>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {DEMO_LOW_STOCK.map((product) => (
                                <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                                    <div className="w-12 h-12 rounded bg-gray-50 border border-gray-200 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-gray-900">{product.name}</p>
                                        <p className="text-xs text-amber-600 font-bold mt-0.5 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Only {product.stock} units remaining
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-[2px] transition-colors uppercase">
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
                            className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-200 rounded-[2px] hover:shadow-md hover:border-primary/50 transition group"
                        >
                            <div className="p-3 rounded-full bg-blue-50 text-primary group-hover:scale-110 transition-all">
                                <action.icon className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-sm text-gray-700 group-hover:text-primary">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
