'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, Phone, ShoppingBag, Calendar, User, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Customer {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    avatar_url: string;
    created_at: string;
    total_orders: number;
    total_spent: number;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setRefreshing(true);
        try {
            // Fetch from profiles table
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (profiles && profiles.length > 0) {
                // Get orders for each customer
                const { data: orders, error: ordersError } = await supabase.from('orders').select('*');

                if (ordersError) console.warn('Error fetching orders for stats:', ordersError.message);

                const customersWithStats: Customer[] = profiles.map((p: any) => {
                    const customerOrders = orders?.filter((o: any) => o.user_id === p.id) || [];
                    const totalSpent = customerOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

                    return {
                        id: p.id,
                        email: p.email || '',
                        full_name: p.full_name || p.name || 'Unknown',
                        phone: p.phone || '',
                        avatar_url: p.avatar_url || '',
                        created_at: p.created_at,
                        total_orders: customerOrders.length,
                        total_spent: totalSpent
                    };
                });

                setCustomers(customersWithStats);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            // setCustomers([]); // Keep previous state or show empty
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery)
    );

    const stats = {
        total: customers.length,
        newThisMonth: customers.filter(c => {
            const created = new Date(c.created_at);
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length,
        withOrders: customers.filter(c => c.total_orders > 0).length,
        totalRevenue: customers.reduce((sum, c) => sum + c.total_spent, 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-sm text-gray-500 mt-1">{customers.length} registered customers</p>
                </div>
                <button
                    onClick={fetchCustomers}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <p className="text-xs font-medium text-gray-500 uppercase">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <p className="text-xs font-medium text-green-600 uppercase">New This Month</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.newThisMonth}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <p className="text-xs font-medium text-blue-600 uppercase">With Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.withOrders}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <p className="text-xs font-medium text-gray-500 uppercase">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.totalRevenue / 1000).toFixed(1)}K</p>
                </div>
            </div>

            {/* Customers Table Container */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {customers.length === 0 ? (
                    <div className="p-12 text-center">
                        <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <h2 className="text-lg font-medium text-gray-900 mb-1">No Customers Yet</h2>
                        <p className="text-sm text-gray-500">Customers will appear here when they register</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                                <tr>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Orders</th>
                                    <th className="p-4">Total Spent</th>
                                    <th className="p-4">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden text-xs">
                                                    {customer.avatar_url ? (
                                                        <img src={customer.avatar_url} alt={customer.full_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        customer.full_name?.[0]?.toUpperCase() || 'U'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{customer.full_name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">ID: {customer.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <p className="text-gray-600 flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    {customer.email || 'N/A'}
                                                </p>
                                                {customer.phone && (
                                                    <p className="text-gray-500 flex items-center gap-2">
                                                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                        {customer.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                <ShoppingBag className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">{customer.total_orders}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            ₹{customer.total_spent.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(customer.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
