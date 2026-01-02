'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, ShoppingBag, Calendar, User, RefreshCw } from 'lucide-react';
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

            if (error) {
                console.error('Supabase error fetching profiles:', error.message);
                throw error;
            }

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
            setCustomers([]);
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Customers</h1>
                    <p className="text-gray-400 mt-1">{customers.length} registered customers</p>
                </div>
                <button
                    onClick={fetchCustomers}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-[#12121a] border border-[#2a2a38] rounded-lg hover:border-orange-500/50 transition text-gray-400 hover:text-white"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-xl p-4">
                    <p className="text-sm text-gray-500">Total Customers</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-xl p-4 group">
                    <p className="text-sm text-gray-500 group-hover:text-green-500 transition-colors">New This Month</p>
                    <p className="text-2xl font-bold text-green-500">{stats.newThisMonth}</p>
                </div>
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-xl p-4 group">
                    <p className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors">With Orders</p>
                    <p className="text-2xl font-bold text-blue-500">{stats.withOrders}</p>
                </div>
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-xl p-4 group">
                    <p className="text-sm text-gray-500 group-hover:text-orange-500 transition-colors">Total Revenue</p>
                    <p className="text-2xl font-bold text-orange-500">₹{(stats.totalRevenue / 1000).toFixed(1)}K</p>
                </div>
            </div>

            {/* Empty State */}
            {customers.length === 0 ? (
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-12 text-center">
                    <User className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-white">No Customers Yet</h2>
                    <p className="text-gray-400">Customers will appear here when they register or place orders</p>
                </div>
            ) : (
                <>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[#12121a] border border-[#2a2a38] rounded-xl outline-none text-white placeholder:text-gray-500 focus:border-orange-500 transition-colors"
                        />
                    </div>

                    {/* Customers Table */}
                    <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#2a2a38] bg-[#1a1a24]">
                                        <th className="text-left p-4 font-semibold text-gray-300">Customer</th>
                                        <th className="text-left p-4 font-semibold text-gray-300">Contact</th>
                                        <th className="text-left p-4 font-semibold text-gray-300">Orders</th>
                                        <th className="text-left p-4 font-semibold text-gray-300">Spent</th>
                                        <th className="text-left p-4 font-semibold text-gray-300">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2a2a38]">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-[#1a1a24] transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center font-bold text-white overflow-hidden shadow-lg shadow-orange-500/20">
                                                        {customer.avatar_url ? (
                                                            <img src={customer.avatar_url} alt={customer.full_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            customer.full_name?.[0]?.toUpperCase() || 'U'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white group-hover:text-orange-500 transition-colors">{customer.full_name}</p>
                                                        <p className="text-xs text-gray-500">ID: {customer.id.slice(-8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm flex items-center gap-2 text-gray-300">
                                                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                                                        {customer.email || 'N/A'}
                                                    </p>
                                                    {customer.phone && (
                                                        <p className="text-sm flex items-center gap-2 text-gray-400">
                                                            <Phone className="w-3.5 h-3.5" />
                                                            {customer.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-white">
                                                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                                                    <span className="font-medium">{customer.total_orders}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-green-500">
                                                ₹{customer.total_spent.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-600" />
                                                    {new Date(customer.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
