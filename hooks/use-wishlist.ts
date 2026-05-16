import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem: WishlistItem) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item.id === newItem.id);

        if (!exists) {
          set({ items: [...currentItems, newItem] });
        }
      },
      removeItem: (id: string) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      isInWishlist: (id: string) => {
        return get().items.some((item) => item.id === id);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'bloomina-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
