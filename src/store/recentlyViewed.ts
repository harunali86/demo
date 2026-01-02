import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewedProduct {
    id: string;
    name: string;
    price: number;
    img: string;
    cat: string;
    viewedAt: number;
}

interface RecentlyViewedState {
    items: ViewedProduct[];
    addItem: (product: Omit<ViewedProduct, 'viewedAt'>) => void;
    clearAll: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const { items } = get();
                // Remove if already exists
                const filtered = items.filter(item => item.id !== product.id);
                // Add to front with timestamp
                const newItems = [
                    { ...product, viewedAt: Date.now() },
                    ...filtered
                ].slice(0, 10); // Keep max 10 items
                set({ items: newItems });
            },
            clearAll: () => set({ items: [] }),
        }),
        {
            name: 'recently-viewed-storage',
        }
    )
);
