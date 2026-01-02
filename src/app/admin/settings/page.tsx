'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Store,
    Mail,
    Phone,
    MapPin,
    Globe,
    Palette,
    Bell,
    Shield,
    Loader2,
    Check
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('store');

    const [settings, setSettings] = useState({
        // Store
        storeName: 'Harun Store',
        storeEmail: 'support@harunstore.com',
        storePhone: '+91 98765 43210',
        storeAddress: 'Mumbai, Maharashtra, India',
        storeCurrency: 'INR',

        // Appearance
        primaryColor: '#2874f0',
        darkMode: false,

        // Notifications
        orderNotifications: true,
        customerNotifications: true,
        lowStockAlerts: true,

        // Security
        twoFactorAuth: false,
        loginAlerts: true
    });

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        toast.success('Settings saved successfully!');
    };

    const tabs = [
        { id: 'store', label: 'Store Info', icon: Store },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your store preferences and configuration</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs */}
                <div className="lg:w-64 flex lg:flex-col gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-sm font-medium ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-8"
                    >
                        {/* Store Info */}
                        {activeTab === 'store' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Store Information</h2>

                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
                                        <div className="relative">
                                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={settings.storeName}
                                                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={settings.storeEmail}
                                                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={settings.storePhone}
                                                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <textarea
                                                value={settings.storeAddress}
                                                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select
                                                value={settings.storeCurrency}
                                                onChange={(e) => setSettings({ ...settings, storeCurrency: e.target.value })}
                                                className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="INR">INR (₹)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Appearance</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Brand Color</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                            <input
                                                type="color"
                                                value={settings.primaryColor}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={settings.primaryColor}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm uppercase font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">Dark Mode</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Enable dark theme for admin panel (Currently disabled for redesign)</p>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    >
                                        <span
                                            className={`${settings.darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                        />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Notifications</h2>

                                <div className="space-y-4">
                                    {[
                                        { key: 'orderNotifications', label: 'Order Notifications', desc: 'Get notified when new orders are placed' },
                                        { key: 'customerNotifications', label: 'Customer Notifications', desc: 'Get notified when new customers register' },
                                        { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Get alerts when products are running low' },
                                    ].map(item => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-200'}`}
                                            >
                                                <span
                                                    className={`${settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Security</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">Two-Factor Authentication</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Add extra security to your account</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">Login Alerts</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Get notified of new login attempts</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, loginAlerts: !settings.loginAlerts })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings.loginAlerts ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`${settings.loginAlerts ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-lg">
                                    <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-red-600 mb-4">Permanently delete your store and all associated data. This action cannot be undone.</p>
                                    <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors shadow-sm">
                                        Delete Store
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-[#2874f0] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-70 shadow-sm"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
