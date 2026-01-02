'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { Calendar, TrendingUp, Users, ShoppingBag, DollarSign, Download, Filter } from 'lucide-react';
import { mockOrders } from '@/data/fallback-data';
import { toast } from 'sonner';

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('30_days');
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);

    useEffect(() => {
        fetchReports();
    }, [dateRange]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const endDate = new Date();
            const startDate = new Date();
            if (dateRange === '7_days') startDate.setDate(endDate.getDate() - 7);
            if (dateRange === '30_days') startDate.setDate(endDate.getDate() - 30);
            if (dateRange === '90_days') startDate.setDate(endDate.getDate() - 90);
            if (dateRange === 'year') startDate.setFullYear(endDate.getFullYear() - 1);

            let orders = [];

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('created_at, total, status')
                    .gte('created_at', startDate.toISOString())
                    .lte('created_at', endDate.toISOString())
                    .neq('status', 'cancelled');

                if (error) throw error;
                orders = data || [];

            } catch (dbError) {
                console.warn('Database error (likely missing table), utilizing mock orders:', dbError);
                // Filter mock orders by date range
                // @ts-ignore
                orders = mockOrders.filter((order: any) => {
                    const orderDate = new Date(order.created_at);
                    return orderDate >= startDate && orderDate <= endDate && order.status !== 'cancelled';
                });
                toast('Demo Mode: Using sample data', { icon: '📊' });
            }


            // Process data for charts
            // @ts-ignore
            const ordersByDate = orders.reduce((acc: any, order: any) => {
                const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (!acc[date]) acc[date] = { date, revenue: 0, orders: 0 };
                acc[date].revenue += order.total;
                acc[date].orders += 1;
                return acc;
            }, {});

            const chartData = Object.values(ordersByDate).sort((a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            // Calculate totals
            // @ts-ignore
            const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
            const totalOrders = orders.length;
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            setReportData({
                chartData,
                summary: {
                    totalRevenue,
                    totalOrders,
                    avgOrderValue
                }
            });

        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1a24] border border-[#2a2a38] p-3 rounded-lg shadow-xl">
                    <p className="text-gray-300 mb-1">{label}</p>
                    <p className="text-orange-500 font-bold">
                        ₹{payload[0].value.toLocaleString()}
                    </p>
                    {payload[1] && (
                        <p className="text-blue-500 font-medium">
                            {payload[1].value} Orders
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Analytics Reports</h1>
                    <p className="text-gray-400 mt-1">Visualize store performance and trends</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 bg-[#12121a] border border-[#2a2a38] rounded-lg text-white outline-none focus:border-orange-500 cursor-pointer"
                    >
                        <option value="7_days">Last 7 Days</option>
                        <option value="30_days">Last 30 Days</option>
                        <option value="90_days">Last 3 Months</option>
                        <option value="year">Last Year</option>
                    </select>
                    <button className="p-2 bg-[#12121a] border border-[#2a2a38] text-gray-400 hover:text-white rounded-lg hover:border-orange-500/50 transition">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#12121a] border border-[#2a2a38] p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign className="w-24 h-24 text-green-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                            <DollarSign className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-gray-400 font-medium">Total Revenue</p>
                    </div>
                    <p className="text-3xl font-bold text-white">₹{reportData?.summary.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-[#12121a] border border-[#2a2a38] p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShoppingBag className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <ShoppingBag className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-gray-400 font-medium">Total Orders</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{reportData?.summary.totalOrders}</p>
                </div>

                <div className="bg-[#12121a] border border-[#2a2a38] p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-purple-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                        </div>
                        <p className="text-gray-400 font-medium">Avg. Order Value</p>
                    </div>
                    <p className="text-3xl font-bold text-white">₹{Math.round(reportData?.summary.avgOrderValue || 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-[#12121a] border border-[#2a2a38] p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Revenue Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={reportData?.chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#6b7280"
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2a2a38', strokeWidth: 2 }} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#f97316"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-[#12121a] border border-[#2a2a38] p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Orders Overview</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData?.chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#6b7280"
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2a2a38' }} />
                                <Bar
                                    dataKey="orders"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
