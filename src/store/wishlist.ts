import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    description?: string;
}

interface WishlistState {
    items: WishlistItem[];
    isLoading: boolean;
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
    fetchWishlist: () => void;
    syncWishlist: () => void;
}

// LOCAL STORAGE ONLY - No database calls (Demo Mode)
export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            addItem: (item) => {
                const { items } = get();
                const exists = items.find((i) => i.id === item.id);
                if (exists) return;
                set({ items: [...items, item] });
            },

            removeItem: (id) => {
                const { items } = get();
                set({ items: items.filter((item) => item.id !== id) });
            },

            isInWishlist: (id) => {
                return get().items.some((item) => item.id === id);
            },

            clearWishlist: () => set({ items: [] }),

            // No-op for demo - data is already in local storage
            fetchWishlist: () => { },
            syncWishlist: () => { },
        }),
        {
            name: 'wishlist-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
