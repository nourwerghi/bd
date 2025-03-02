import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }

      const newItems = [...state.items, { product, quantity: 1 }];
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item.product.id !== productId);
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity === 0) {
        return get().removeItem(productId);
      }

      const updatedItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },
}));

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
};