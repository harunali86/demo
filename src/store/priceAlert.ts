import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PriceAlert {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    currentPrice: number;
    targetPrice: number;
    createdAt: string;
    notified: boolean;
}

interface PriceAlertState {
    alerts: PriceAlert[];
    addAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'notified'>) => void;
    removeAlert: (id: string) => void;
    hasAlert: (productId: string) => boolean;
    getAlert: (productId: string) => PriceAlert | undefined;
    markNotified: (id: string) => void;
    clearAll: () => void;
}

export const usePriceAlertStore = create<PriceAlertState>()(
    persist(
        (set, get) => ({
            alerts: [],
            addAlert: (alert) => {
                const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                set({
                    alerts: [...get().alerts, {
                        ...alert,
                        id,
                        createdAt: new Date().toISOString(),
                        notified: false,
                    }]
                });
            },
            removeAlert: (id) => {
                set({ alerts: get().alerts.filter(a => a.id !== id) });
            },
            hasAlert: (productId) => {
                return get().alerts.some(a => a.productId === productId);
            },
            getAlert: (productId) => {
                return get().alerts.find(a => a.productId === productId);
            },
            markNotified: (id) => {
                set({
                    alerts: get().alerts.map(a =>
                        a.id === id ? { ...a, notified: true } : a
                    )
                });
            },
            clearAll: () => {
                set({ alerts: [] });
            },
        }),
        {
            name: 'price-alerts-storage',
        }
    )
);
