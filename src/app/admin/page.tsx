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
            pending: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
            confirmed: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
            processing: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
            shipped: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
            delivered: 'bg-green-500/20 text-green-600 dark:text-green-400',
            cancelled: 'bg-red-500/20 text-red-600 dark:text-red-400',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
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
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back! Here's your store overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-medium rounded-full border border-orange-500/20">DEMO MODE</span>
                    <button
                        onClick={() => setLoading(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a24] border border-[#2a2a38] rounded-lg hover:bg-[#2a2a38] transition text-gray-300"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/30 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                            <Package className="w-6 h-6 text-blue-500" />
                        </div>
                        <Link href="/admin/products" className="text-gray-500 hover:text-white transition">
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <p className="text-3xl font-bold text-white">{DEMO_STATS.totalProducts}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Products</p>
                </div>

                <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/30 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                            <ShoppingCart className="w-6 h-6 text-green-500" />
                        </div>
                        <Link href="/admin/orders" className="text-gray-500 hover:text-white transition">
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <p className="text-3xl font-bold text-white">{DEMO_STATS.totalOrders}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Orders</p>
                </div>

                <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/30 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                            <Users className="w-6 h-6 text-purple-500" />
                        </div>
                        <Link href="/admin/customers" className="text-gray-500 hover:text-white transition">
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <p className="text-3xl font-bold text-white">{DEMO_STATS.totalCustomers}</p>
                    <p className="text-sm text-gray-500 mt-1">Customers</p>
                </div>

                <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/30 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors">
                            <DollarSign className="w-6 h-6 text-orange-500" />
                        </div>
                        <Link href="/admin/reports" className="text-gray-500 hover:text-white transition">
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <p className="text-3xl font-bold text-white">₹{(DEMO_STATS.totalRevenue / 1000).toFixed(1)}K</p>
                    <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
                </div>
            </div>

            {/* Today Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-xl p-5 flex items-center gap-5">
                    <div className="p-3 bg-[#1a1a24] rounded-xl border border-[#2a2a38]">
                        <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{DEMO_STATS.todayOrders}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Today's Orders</p>
                    </div>
                </div>

                <div className="bg-[#12121a] border border-[#2a2a38] rounded-xl p-5 flex items-center gap-5">
                    <div className="p-3 bg-[#1a1a24] rounded-xl border border-[#2a2a38]">
                        <DollarSign className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">₹{DEMO_STATS.todayRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Today's Revenue</p>
                    </div>
                </div>

                <div className="bg-[#12121a] border border-[#2a2a38] rounded-xl p-5 flex items-center gap-5">
                    <div className="p-3 bg-[#1a1a24] rounded-xl border border-[#2a2a38]">
                        <Clock className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{DEMO_STATS.pendingOrders}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Pending Orders</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-orange-500 hover:text-orange-400 text-sm font-medium">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {DEMO_ORDERS.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-4 bg-[#1a1a24] rounded-xl border border-[#2a2a38] hover:border-gray-700 transition cursor-pointer"
                            >
                                <div>
                                    <p className="font-medium text-white">#{order.order_number}</p>
                                    <p className="text-sm text-gray-500">{order.customer_name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">₹{order.total.toLocaleString()}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Low Stock Alerts
                        </h2>
                        <Link href="/admin/inventory" className="text-orange-500 hover:text-orange-400 text-sm font-medium">Manage</Link>
                    </div>

                    <div className="space-y-4">
                        {DEMO_LOW_STOCK.map((product) => (
                            <div key={product.id} className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                <div className="w-12 h-12 rounded-lg bg-[#1a1a24] border border-[#2a2a38] flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-white">{product.name}</p>
                                    <p className="text-xs text-yellow-500 font-medium mt-0.5">Only {product.stock} left</p>
                                </div>
                                <button className="px-4 py-2 bg-yellow-500 text-black text-xs rounded-lg font-bold hover:bg-yellow-400 transition-colors uppercase">
                                    Restock
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 text-white">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/admin/products/new"
                        className="flex flex-col items-center gap-3 p-6 bg-[#1a1a24] border border-[#2a2a38] rounded-xl hover:border-orange-500/50 hover:bg-[#20202a] transition group"
                    >
                        <div className="p-3 rounded-full bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-gray-300 group-hover:text-white">Add Product</span>
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex flex-col items-center gap-3 p-6 bg-[#1a1a24] border border-[#2a2a38] rounded-xl hover:border-green-500/50 hover:bg-[#20202a] transition group"
                    >
                        <div className="p-3 rounded-full bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-gray-300 group-hover:text-white">View Orders</span>
                    </Link>
                    <Link
                        href="/admin/coupons"
                        className="flex flex-col items-center gap-3 p-6 bg-[#1a1a24] border border-[#2a2a38] rounded-xl hover:border-purple-500/50 hover:bg-[#20202a] transition group"
                    >
                        <div className="p-3 rounded-full bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                            <Star className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-gray-300 group-hover:text-white">Add Coupon</span>
                    </Link>
                    <Link
                        href="/admin/reports"
                        className="flex flex-col items-center gap-3 p-6 bg-[#1a1a24] border border-[#2a2a38] rounded-xl hover:border-blue-500/50 hover:bg-[#20202a] transition group"
                    >
                        <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-gray-300 group-hover:text-white">View Reports</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
