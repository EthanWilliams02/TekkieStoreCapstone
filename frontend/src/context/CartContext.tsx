import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoeProduct } from '../types/catalogue';

export interface CartItem {
  cartId: string;
  product: ShoeProduct;
  size: string;
  quantity: number;
  addedAt: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ShoeProduct, size?: string, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const STORAGE_KEY = 'tekkie_store_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to persist cart to localStorage', error);
    }
  }, [cart]);

  const addToCart = (product: ShoeProduct, size?: string, quantity = 1) => {
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'UK 8');
    const cartId = `${product.id}-${selectedSize}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartId === cartId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartId,
          product,
          size: selectedSize,
          quantity,
          addedAt: Date.now(),
        },
      ];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getEffectivePrice = (product: ShoeProduct) =>
    product.isOnSale && product.salePrice ? product.salePrice : product.price;

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + getEffectivePrice(item.product) * item.quantity, 0);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
