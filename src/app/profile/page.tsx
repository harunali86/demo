'use client';

import { useAuthStore } from '@/store/auth';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, Heart, Settings, LogOut, User, MapPin, Mail, Phone, Upload } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AddressList from '@/components/profile/AddressList';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { toast } from 'sonner';
import Navbar from '@/components/ui/Navbar';

export const dynamic = 'force-dynamic';

interface Order {
    id: string;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
}

function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated, isGuest, logout, updateUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        avatar_url: '' as string | null
    });
    const [updatingProfile, setUpdatingProfile] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const tab = searchParams.get('tab');
        if (tab && ['overview', 'orders', 'addresses', 'settings'].includes(tab)) {
            setActiveTab(tab);
        }

        fetchData();
    }, [isAuthenticated, router, searchParams]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Orders
            const { data: ordersData } = await supabase
                .from('orders')
                .select('id, order_number, total, status, created_at')
                .order('created_at', { ascending: false })
                .limit(5);
            if (ordersData) setOrders(ordersData);

            // Fetch Profile Extended Data
            let profile = null;
            if (user?.id) {
                const { data } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, phone, avatar_url')
                    .eq('id', user.id)
                    .single();
                profile = data as any;
            }

            if (profile) {
                setProfileData({
                    first_name: profile.first_name || '',
                    last_name: profile.last_name || '',
                    phone: profile.phone || '',
                    email: user?.email || '',
                    avatar_url: profile.avatar_url || null
                });
            } else {
                setProfileData(prev => ({ ...prev, email: user?.email || '' }));
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        setUpdatingProfile(true);
        try {
            const updates = {
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                phone: profileData.phone,
                avatar_url: profileData.avatar_url
            };

            const { error } = await supabase
                .from('profiles')
                // @ts-ignore
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            // Sync with global auth state
            updateUser({ name: `${updates.first_name} ${updates.last_name}`.trim() });

            toast.success('Profile updated successfully!');
            // Optionally update auth store user name if needed
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile.');
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleLogout = () => {
        logout();
        supabase.auth.signOut();
        router.push('/');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-500/20 text-green-400';
            case 'shipped': return 'bg-blue-500/20 text-blue-400';
            case 'processing': return 'bg-yellow-500/20 text-yellow-400';
            case 'cancelled': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (!isAuthenticated) return null;

    const TABS = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0f1111] text-[#e3e6e6] pt-4 pb-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar / User Info */}
                        <div className="space-y-6">
                            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#3d4f5f] text-center">
                                <div className="mb-4">
                                    <AvatarUpload
                                        url={profileData.avatar_url || null}
                                        onUpload={(url) => {
                                            setProfileData(prev => ({ ...prev, avatar_url: url }));
                                            // Auto-save when avatar changes
                                            if (user?.id) {
                                                supabase.from('profiles')
                                                    // @ts-ignore
                                                    .update({ avatar_url: url })
                                                    .eq('id', user.id).then(({ error }) => {
                                                        if (error) toast.error('Failed to update avatar');
                                                        else toast.success('Avatar updated');
                                                    });
                                            }
                                        }}
                                    />
                                </div>
                                <h2 className="text-xl font-bold">
                                    {profileData.first_name ? `${profileData.first_name} ${profileData.last_name}` : (user?.name || 'User')}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
                                {isGuest && (
                                    <span className="inline-block mt-3 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                        Guest Account
                                    </span>
                                )}
                            </div>

                            {/* Navigation Tabs */}
                            <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-6 py-4 text-left transition hover:bg-zinc-800 ${activeTab === tab.id ? 'bg-zinc-800 border-l-4 border-primary text-white' : 'text-gray-400 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                                <Link
                                    href="/admin"
                                    className="w-full flex items-center gap-3 px-6 py-4 text-left text-orange-500 hover:bg-orange-500/10 transition border-l-4 border-transparent"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="font-medium">Admin Panel</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-6 py-4 text-left text-red-500 hover:bg-red-500/10 transition border-l-4 border-transparent"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* OVERVIEW TAB */}
                                    {activeTab === 'overview' && (
                                        <>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                                                    <p className="text-gray-400 mb-1">Total Orders</p>
                                                    <p className="text-2xl font-bold">{orders.length}</p>
                                                </div>
                                                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                                                    <p className="text-gray-400 mb-1">Member Since</p>
                                                    <p className="text-lg font-bold">2024</p>
                                                </div>
                                                <Link href="/wishlist" className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-pink-500/50 transition group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-gray-400">Wishlist</p>
                                                        <Heart className="w-5 h-5 text-gray-600 group-hover:text-pink-500 transition" />
                                                    </div>
                                                    <p className="text-sm text-primary">View Items</p>
                                                </Link>
                                            </div>

                                            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
                                                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                                                    <h2 className="text-xl font-bold">Recent Orders</h2>
                                                    <Link href="/orders/track" className="text-primary text-sm hover:underline">View All</Link>
                                                </div>
                                                <div className="divide-y divide-zinc-800">
                                                    {orders.length === 0 ? (
                                                        <div className="p-8 text-center text-gray-400">No orders yet.</div>
                                                    ) : (
                                                        orders.map((order) => (
                                                            <div key={order.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition">
                                                                <div>
                                                                    <p className="font-semibold">{order.order_number}</p>
                                                                    <p className="text-sm text-gray-400">
                                                                        {new Date(order.created_at).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-bold">₹{order.total.toLocaleString()}</p>
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* ORDERS TAB */}
                                    {activeTab === 'orders' && (
                                        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
                                            <div className="p-6 border-b border-zinc-800">
                                                <h2 className="text-xl font-bold">Order History</h2>
                                            </div>
                                            {/* Simplified list, reusing overview logic but could be paginated */}
                                            <div className="divide-y divide-zinc-800">
                                                {orders.map((order) => (
                                                    <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-800/50 transition">
                                                        <div>
                                                            <p className="font-bold text-lg">{order.order_number}</p>
                                                            <p className="text-sm text-gray-400">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="text-right">
                                                                <p className="font-bold">₹{order.total.toLocaleString()}</p>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                                                            </div>
                                                            <Link href={`/orders/track?order=${order.order_number}`} className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-sm">
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="p-6 text-center">
                                                    <Link href="/orders/track" className="text-primary hover:underline">
                                                        Go to Full Order Tracking Page
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ADDRESSES TAB */}
                                    {activeTab === 'addresses' && (
                                        <AddressList />
                                    )}

                                    {/* SETTINGS TAB */}
                                    {activeTab === 'settings' && (
                                        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                                            <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">First Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.first_name}
                                                            onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                                            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary outline-none text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.last_name}
                                                            onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                                                            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary outline-none text-white"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2 mr-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary outline-none text-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                        <input
                                                            type="email"
                                                            value={profileData.email}
                                                            disabled
                                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-gray-400 cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                                                </div>

                                                <div className="pt-4 border-t border-zinc-800">
                                                    <button
                                                        type="submit"
                                                        disabled={updatingProfile}
                                                        className="px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
                                                    >
                                                        {updatingProfile ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f1111] text-white flex items-center justify-center">Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
