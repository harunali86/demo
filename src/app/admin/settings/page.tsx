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
    Loader2
} from 'lucide-react';

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
        primaryColor: '#FF5722',
        darkMode: true,

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
        alert('Settings saved successfully!');
    };

    const tabs = [
        { id: 'store', label: 'Store Info', icon: Store },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">Manage your store settings</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs */}
                <div className="lg:w-48 flex lg:flex-col gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                ? 'bg-primary text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        {/* Store Info */}
                        {activeTab === 'store' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold mb-4">Store Information</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Store Name</label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={settings.storeName}
                                            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-orange-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={settings.storeEmail}
                                            onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-orange-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={settings.storePhone}
                                            onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-orange-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            value={settings.storeAddress}
                                            onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-primary resize-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Currency</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            value={settings.storeCurrency}
                                            onChange={(e) => setSettings({ ...settings, storeCurrency: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-orange-500"
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold mb-4">Appearance</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Primary Color</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={settings.primaryColor}
                                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                            className="w-12 h-12 rounded-xl border-0 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={settings.primaryColor}
                                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div>
                                        <p className="font-medium">Dark Mode</p>
                                        <p className="text-sm text-gray-400">Enable dark theme for admin panel</p>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                                        className={`w-14 h-8 rounded-full transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-gray-600'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold mb-4">Notifications</h2>

                                {[
                                    { key: 'orderNotifications', label: 'Order Notifications', desc: 'Get notified when new orders are placed' },
                                    { key: 'customerNotifications', label: 'Customer Notifications', desc: 'Get notified when new customers register' },
                                    { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Get alerts when products are running low' },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                                            className={`w-14 h-8 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? 'bg-primary' : 'bg-gray-600'}`}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Security */}
                        {activeTab === 'security' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold mb-4">Security</h2>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div>
                                        <p className="font-medium">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-400">Add extra security to your account</p>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                                        className={`w-14 h-8 rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-primary' : 'bg-gray-600'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.twoFactorAuth ? 'translate-x-7' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div>
                                        <p className="font-medium">Login Alerts</p>
                                        <p className="text-sm text-gray-400">Get notified of new login attempts</p>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, loginAlerts: !settings.loginAlerts })}
                                        className={`w-14 h-8 rounded-full transition-colors ${settings.loginAlerts ? 'bg-primary' : 'bg-gray-600'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.loginAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                    <p className="font-medium text-red-400 mb-2">Danger Zone</p>
                                    <p className="text-sm text-gray-400 mb-4">Permanently delete your store and all data.</p>
                                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">
                                        Delete Store
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
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
