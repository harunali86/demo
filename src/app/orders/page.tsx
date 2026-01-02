'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { Package, Search, Filter, ChevronRight, Calendar, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Order {
    id: string;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
    items: any[];
    shipping_address: any;
}

export default function OrdersPage() {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />;
            case 'processing': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || order.status === filter;
        const matchesSearch = order.order_number?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const FILTERS = ['all', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Orders</h1>
                        <p className="text-gray-400 mt-1">Track and manage your orders</p>
                    </div>
                    <Link href="/track" className="px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition">
                        Track Order
                    </Link>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap capitalize transition ${filter === f
                                        ? 'bg-primary text-black font-bold'
                                        : 'bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
                        <p className="text-gray-400 mb-6">
                            {filter !== 'all' ? `No ${filter} orders` : "You haven't placed any orders yet"}
                        </p>
                        <Link href="/" className="inline-block px-6 py-3 bg-primary text-black font-bold rounded-xl">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition"
                            >
                                <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${getStatusColor(order.status)} flex items-center justify-center border`}>
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div>
                                            <p className="font-bold">{order.order_number}</p>
                                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-bold text-lg">₹{order.total?.toLocaleString()}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="p-3 bg-white/5 rounded-xl hover:bg-primary/10 hover:text-primary transition"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                {order.items && order.items.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <p className="text-sm text-gray-400">
                                            {order.items.length} item{order.items.length > 1 ? 's' : ''}: {' '}
                                            {order.items.slice(0, 2).map((item: any, i: number) => (
                                                <span key={i}>{item.name}{i < Math.min(order.items.length, 2) - 1 ? ', ' : ''}</span>
                                            ))}
                                            {order.items.length > 2 && ` +${order.items.length - 2} more`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats */}
                {orders.length > 0 && (
                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold">{orders.length}</p>
                            <p className="text-sm text-gray-400">Total Orders</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-green-400">
                                {orders.filter(o => o.status === 'delivered').length}
                            </p>
                            <p className="text-sm text-gray-400">Delivered</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-blue-400">
                                {orders.filter(o => o.status === 'shipped').length}
                            </p>
                            <p className="text-sm text-gray-400">In Transit</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold">
                                ₹{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">Total Spent</p>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
