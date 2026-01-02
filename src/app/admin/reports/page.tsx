'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Download, Loader2 } from 'lucide-react';
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
                console.warn('Database error, using mock data:', dbError);
                // @ts-ignore
                orders = mockOrders.filter((order: any) => {
                    const orderDate = new Date(order.created_at);
                    return orderDate >= startDate && orderDate <= endDate && order.status !== 'cancelled';
                });
            }

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
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
                    <p className="text-gray-600 text-xs mb-1 font-medium">{label}</p>
                    <p className="text-blue-600 font-bold">
                        ₹{payload[0].value.toLocaleString()}
                    </p>
                    {payload[1] && (
                        <p className="text-gray-900 font-medium text-sm mt-1">
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
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Visualize store performance and trends</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm text-sm font-medium"
                    >
                        <option value="7_days">Last 7 Days</option>
                        <option value="30_days">Last 30 Days</option>
                        <option value="90_days">Last 3 Months</option>
                        <option value="year">Last Year</option>
                    </select>
                    <button className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition shadow-sm">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2.5 bg-green-50 rounded-lg text-green-600">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <p className="text-gray-600 font-medium text-sm">Total Revenue</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">₹{reportData?.summary.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <p className="text-gray-600 font-medium text-sm">Total Orders</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{reportData?.summary.totalOrders}</p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2.5 bg-purple-50 rounded-lg text-purple-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <p className="text-gray-600 font-medium text-sm">Avg. Order Value</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">₹{Math.round(reportData?.summary.avgOrderValue || 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={reportData?.chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Orders Overview</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData?.chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                                <Bar
                                    dataKey="orders"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
