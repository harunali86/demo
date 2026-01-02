'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Package, Tag, Truck, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    type: 'order' | 'promo' | 'shipping' | 'success' | 'info';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
    { id: '1', type: 'order', title: 'Order Confirmed', message: 'Your order #ORD-12345 has been confirmed', time: '2 min ago', read: false },
    { id: '2', type: 'shipping', title: 'Order Shipped', message: 'Your order is on its way', time: '1 hour ago', read: false },
    { id: '3', type: 'promo', title: '50% Off Sale!', message: 'New Year sale is live now', time: '3 hours ago', read: true },
];

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <Package className="w-5 h-5" />;
            case 'promo': return <Tag className="w-5 h-5" />;
            case 'shipping': return <Truck className="w-5 h-5" />;
            case 'success': return <CheckCircle className="w-5 h-5" />;
            default: return <Info className="w-5 h-5" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'order': return 'bg-blue-500/20 text-blue-400';
            case 'promo': return 'bg-pink-500/20 text-pink-400';
            case 'shipping': return 'bg-yellow-500/20 text-yellow-400';
            case 'success': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition text-gray-900 dark:text-white"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="fixed top-16 left-4 right-4 sm:absolute sm:top-12 sm:right-0 sm:left-auto sm:w-96 z-50 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                        <p>No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id)}
                                            className={`p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition ${!notif.read ? 'bg-primary/5' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconBg(notif.type)}`}>
                                                    {getIcon(notif.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <p className="font-medium text-sm text-gray-900 dark:text-white">{notif.title}</p>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                                                </div>
                                                {!notif.read && (
                                                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-gray-200 dark:border-white/10 text-center">
                                <a href="/notifications" className="text-sm text-primary hover:underline">
                                    View All Notifications
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
