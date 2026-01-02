'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { Package, Search, ChevronRight, Calendar, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
import Link from 'next/link';

// Mock Data for Demo
const MOCK_ORDERS = [
    {
        id: 'ord_123456789',
        order_number: 'OD1234567890001',
        total: 149000,
        status: 'delivered',
        created_at: '2024-01-15T10:30:00Z',
        items: [
            { name: 'iPhone 15 Titanium', price: 149000, quantity: 1, image: '/products/tech_2.png' }
        ],
        shipping_address: {
            name: 'Harun',
            street: '123 Tech Park',
            city: 'Bangalore',
            state: 'KA',
            zip: '560001'
        }
    },
    {
        id: 'ord_987654321',
        order_number: 'OD9876543210002',
        total: 1999,
        status: 'shipped',
        created_at: '2024-02-01T14:20:00Z',
        items: [
            { name: 'Leather Wallet', price: 1999, quantity: 1, image: '/products/watch_1.jpg' }
        ],
        shipping_address: {
            name: 'Harun',
            street: '123 Tech Park',
            city: 'Bangalore',
            state: 'KA',
            zip: '560001'
        }
    },
    {
        id: 'ord_456789123',
        order_number: 'OD4567891230003',
        total: 49990,
        status: 'processing',
        created_at: '2024-02-10T09:15:00Z',
        items: [
            { name: 'PS5 Console', price: 49990, quantity: 1, image: '/products/gaming_1.png' }
        ],
        shipping_address: {
            name: 'Harun',
            street: '123 Tech Park',
            city: 'Bangalore',
            state: 'KA',
            zip: '560001'
        }
    }
];

export default function OrdersPage() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState<typeof MOCK_ORDERS>(MOCK_ORDERS);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setOrders(MOCK_ORDERS);
            setLoading(false);
        }, 800);
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-5 h-5 text-white" />;
            case 'shipped': return <Truck className="w-5 h-5 text-white" />;
            case 'processing': return <Clock className="w-5 h-5 text-white" />;
            case 'cancelled': return <XCircle className="w-5 h-5 text-white" />;
            default: return <Package className="w-5 h-5 text-white" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-500';
            case 'shipped': return 'bg-blue-500';
            case 'processing': return 'bg-orange-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || order.status === filter;
        const matchesSearch = order.order_number?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const FILTERS = ['all', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <main className="min-h-screen bg-[#f1f3f6]">
            <Navbar />
            <div className="max-w-[1248px] mx-auto px-4 py-6">
                <div className="flex gap-4">
                    {/* Filters Sidebar (Desktop) */}
                    <div className="hidden md:block w-64 bg-white shadow-sm rounded-sm self-start min-h-[500px]">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="text-lg font-medium text-gray-800">Filters</h2>
                        </div>
                        <div className="p-2">
                            <div className="space-y-1">
                                <h3 className="px-3 py-2 text-sm font-medium text-gray-500 uppercase">Order Status</h3>
                                {FILTERS.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`w-full text-left px-4 py-2 text-sm rounded-sm transition-colors flex items-center justify-between ${filter === f
                                                ? 'bg-blue-50 text-primary font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="capitalize">{f}</span>
                                        {filter === f && <CheckCircle className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search */}
                        <div className="bg-white p-3 shadow-sm rounded-sm mb-4 flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search your orders here..."
                                className="flex-1 py-1 px-4 text-sm outline-none text-gray-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="bg-primary text-white px-6 py-2 text-sm font-medium rounded-sm shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Search Orders
                            </button>
                        </div>

                        {/* Orders List */}
                        {loading ? (
                            <div className="bg-white p-20 text-center shadow-sm rounded-sm">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow rounded-sm overflow-hidden group">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex flex-col md:flex-row p-4 gap-4 md:items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                                                {/* Image */}
                                                <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 relative border border-gray-200 p-2 bg-white">
                                                    <img
                                                        src={item.image || '/placeholder.png'}
                                                        alt={item.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors text-sm md:text-base truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">Color: Default</p>
                                                </div>

                                                {/* Price */}
                                                <div className="w-24 text-right hidden md:block">
                                                    <span className="font-medium text-gray-900">₹{item.price.toLocaleString()}</span>
                                                </div>

                                                {/* Status (Per Item visualization, typically one status per order but simulated here) */}
                                                <div className="md:w-64">
                                                    <div className="flex items-start gap-2">
                                                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${order.status === 'delivered' ? 'bg-green-500' :
                                                                order.status === 'cancelled' ? 'bg-red-500' :
                                                                    order.status === 'shipped' ? 'bg-blue-500' : 'bg-orange-400'
                                                            }`} />
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm capitalize">
                                                                {order.status} on {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">Your item has been {order.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Order Footer */}
                                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs md:text-sm">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <div className={`p-1 rounded-full ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                </div>
                                                <span>Ordered on {new Date(order.created_at).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="font-medium text-gray-900">
                                                Order Total: ₹{order.total.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 text-center shadow-sm rounded-sm">
                                <div className="w-48 h-32 relative mx-auto mb-6 opacity-80">
                                    <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="No Orders" className="object-contain h-full w-full" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                                <p className="text-sm text-gray-500 mt-2 mb-6">Check your spelling or try searching for something else</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
