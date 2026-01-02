'use client';

import { useAuthStore } from '@/store/auth';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, Heart, Settings, LogOut, User, MapPin, Mail, Phone, Upload, ChevronRight, Power } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AddressList from '@/components/profile/AddressList';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { toast } from 'sonner';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

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
            case 'delivered': return 'text-green-600';
            case 'shipped': return 'text-blue-600';
            case 'cancelled': return 'text-red-500';
            default: return 'text-orange-500';
        }
    };

    if (!isAuthenticated) return null;

    const TABS = [
        { id: 'overview', label: 'My Profile', icon: User },
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
        { id: 'settings', label: 'Profile Information', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#f1f3f6] font-sans text-gray-900">
            <Navbar />
            <div className="max-w-[1248px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* User Card */}
                        <div className="bg-white p-3 rounded-[2px] shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 relative">
                                {profileData.avatar_url ? (
                                    <img src={profileData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-50 flex items-center justify-center text-primary font-bold">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Hello,</p>
                                <h3 className="font-medium text-gray-900">
                                    {profileData.first_name ? `${profileData.first_name} ${profileData.last_name}` : (user?.name || 'User')}
                                </h3>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-white rounded-[2px] shadow-sm overflow-hidden">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 text-left border-b border-gray-50 hover:bg-blue-50 hover:text-primary transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-primary font-medium' : 'text-gray-600'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5 text-current opacity-70" />
                                    <span className="text-[14px] uppercase font-medium">{tab.label}</span>
                                </button>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-6 py-4 text-left border-b border-gray-50 hover:bg-blue-50 hover:text-primary transition-colors text-gray-600"
                            >
                                <Power className="w-5 h-5 text-current opacity-70" />
                                <span className="text-[14px] uppercase font-medium">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white rounded-[2px] shadow-sm p-6 min-h-[500px]">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <>
                                {/* OVERVIEW TAB */}
                                {activeTab === 'overview' && (
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>

                                        <div className="space-y-6 max-w-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="w-full">
                                                    <label className="text-sm text-gray-500 mb-2 block">First Name</label>
                                                    <div className="bg-gray-50 p-3 rounded-sm border border-gray-200 text-gray-900 font-medium">
                                                        {profileData.first_name || '-'}
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    <label className="text-sm text-gray-500 mb-2 block">Last Name</label>
                                                    <div className="bg-gray-50 p-3 rounded-sm border border-gray-200 text-gray-900 font-medium">
                                                        {profileData.last_name || '-'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-500 mb-2 block">Email Address</label>
                                                <div className="bg-gray-50 p-3 rounded-sm border border-gray-200 text-gray-900 font-medium flex justify-between">
                                                    {profileData.email}
                                                    <span className="text-xs text-primary font-medium cursor-pointer uppercase">Edit</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-500 mb-2 block">Mobile Number</label>
                                                <div className="bg-gray-50 p-3 rounded-sm border border-gray-200 text-gray-900 font-medium flex justify-between">
                                                    {profileData.phone || '-'}
                                                    <span className="text-xs text-primary font-medium cursor-pointer uppercase">Edit</span>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <h3 className="text-sm font-medium text-gray-900 mb-4">FAQs</h3>
                                                <div className="space-y-3">
                                                    <p className="text-sm font-medium">What happens when I update my email address (or mobile number)?</p>
                                                    <p className="text-xs text-gray-500">Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ORDERS TAB */}
                                {activeTab === 'orders' && (
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 mb-6">My Orders ({orders.length})</h2>
                                        <div className="space-y-4">
                                            {orders.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myorders-empty_d6883b.png" alt="No Orders" className="mx-auto h-32 mb-4" />
                                                    <p className="text-lg font-medium text-gray-900">No orders found</p>
                                                    <p className="text-sm text-gray-500 mt-1">Check out our bestsellers</p>
                                                    <Link href="/" className="inline-block mt-4 bg-primary text-white font-medium px-8 py-2.5 rounded-[2px] shadow-sm uppercase text-sm">Start Shopping</Link>
                                                </div>
                                            ) : (
                                                orders.map((order) => (
                                                    <div key={order.id} className="border border-gray-200 rounded-[2px] p-4 hover:shadow-md transition-shadow cursor-pointer flex gap-4">
                                                        <div className="w-20 h-20 bg-gray-50 flex items-center justify-center p-2">
                                                            <Package className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between mb-2">
                                                                <h3 className="font-medium text-gray-900">Order #{order.order_number}</h3>
                                                                <span className={`text-sm font-medium capitalize flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                                    <div className={`w-2 h-2 rounded-full bg-current`}></div>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mb-3">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
                                                            <div className="flex items-center gap-4">
                                                                <span className="font-medium text-gray-900">₹{order.total.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ADDRESSES TAB */}
                                {activeTab === 'addresses' && (
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 mb-6">Manage Addresses</h2>
                                        <AddressList />
                                    </div>
                                )}

                                {/* SETTINGS TAB */}
                                {activeTab === 'settings' && (
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Settings</h2>
                                        <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-500 mb-2">First Name</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.first_name}
                                                        onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm focus:border-primary outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-500 mb-2">Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.last_name}
                                                        onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm focus:border-primary outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-500 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm focus:border-primary outline-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={updatingProfile}
                                                className="bg-primary text-white font-medium px-8 py-3 rounded-[2px] shadow-sm uppercase text-sm disabled:opacity-50"
                                            >
                                                {updatingProfile ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f1f3f6]"></div>}>
            <ProfileContent />
        </Suspense>
    );
}
