import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedItem {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    savedAt: string;
}

interface SaveForLaterState {
    items: SavedItem[];
    addItem: (item: Omit<SavedItem, 'savedAt'>) => void;
    removeItem: (id: string) => void;
    isInSaved: (id: string) => boolean;
    clearAll: () => void;
}

export const useSaveForLaterStore = create<SaveForLaterState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const exists = get().items.some(i => i.id === item.id);
                if (!exists) {
                    set({
                        items: [...get().items, {
                            ...item,
                            savedAt: new Date().toISOString()
                        }]
                    });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter(i => i.id !== id) });
            },
            isInSaved: (id) => {
                return get().items.some(i => i.id === id);
            },
            clearAll: () => {
                set({ items: [] });
            },
        }),
        {
            name: 'save-for-later-storage',
        }
    )
);
