'use client';

import { useState, useEffect } from 'react';
import {
    Search, Filter, Eye, ChevronDown, RefreshCw, Package, Clock, Truck, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Order {
    id: string;
    order_number: string;
    customer_email: string;
    customer_name: string;
    total: number;
    status: string;
    payment_status: string;
    created_at: string;
    items_count: number;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error fetching orders:', error.message, error.details);
                throw error;
            }

            setOrders(data || []);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            // Only capture the error if it's not just an empty list scenario
            if (error.code !== 'PGRST116') { // PGRST116 is 'JSON object requested, multiple (or no) results returned' which usually implies no data
                // toast.error('Failed to load orders'); // Suppress for now to avoid annoyance
            }
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                // @ts-ignore
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            toast.success(`Order updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            processing: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            shipped: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
            delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
            cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
        };
        return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-4 h-4" />;
            case 'shipped': return <Truck className="w-4 h-4" />;
            case 'processing': return <Package className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Orders</h1>
                    <p className="text-gray-400">{orders.length} orders in database</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-[#12121a] border border-[#2a2a38] rounded-lg hover:border-orange-500/50 transition text-gray-300"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-xl p-4">
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4">
                    <p className="text-sm text-yellow-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4">
                    <p className="text-sm text-orange-500">Processing</p>
                    <p className="text-2xl font-bold text-orange-500">{stats.processing}</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4">
                    <p className="text-sm text-green-500">Delivered</p>
                    <p className="text-2xl font-bold text-green-500">{stats.delivered}</p>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                    <p className="text-sm text-blue-500">Revenue</p>
                    <p className="text-2xl font-bold text-blue-500">₹{(stats.revenue / 1000).toFixed(1)}K</p>
                </div>
            </div>

            {/* Empty State */}
            {orders.length === 0 ? (
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-12 text-center">
                    <Package className="w-16 h-16 mx-auto text-gray-600 mb-4 opacity-50" />
                    <h2 className="text-xl font-bold mb-2 text-white">No Orders Yet</h2>
                    <p className="text-gray-400">Orders will appear here when customers place them</p>
                </div>
            ) : (
                <>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by order number, email, or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#12121a] border border-[#2a2a38] rounded-xl focus:border-orange-500 outline-none text-white placeholder:text-gray-500 transition-all"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 bg-[#12121a] border border-[#2a2a38] rounded-xl focus:border-orange-500 outline-none text-white cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a38] bg-[#1a1a24]">
                                    <th className="p-4 text-left font-semibold text-gray-300">Order</th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Customer</th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Total</th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Status</th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Date</th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2a2a38]">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#1a1a24] transition-colors group">
                                        <td className="p-4">
                                            <p className="font-medium text-white group-hover:text-orange-500 transition-colors">#{order.order_number}</p>
                                            <p className="text-xs text-gray-500">ID: {order.id.slice(-8)}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-white">{order.customer_name || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">{order.customer_email || 'N/A'}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-white">₹{order.total?.toLocaleString() || 0}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="relative group/status">
                                                <button className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                    <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                                                </button>
                                                <div className="absolute left-0 top-full mt-1 w-40 bg-[#1a1a24] border border-[#2a2a38] rounded-xl shadow-xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-10 overflow-hidden transform origin-top-left">
                                                    {STATUS_OPTIONS.map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => updateOrderStatus(order.id, status)}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 capitalize ${order.status === status ? 'text-orange-500 bg-orange-500/5' : 'text-gray-300'}`}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-xs font-medium hover:bg-[#2a2a38] hover:text-white transition text-gray-400"
                                            >
                                                <Eye className="w-3 h-3" />
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
