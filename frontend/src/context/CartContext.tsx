import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ShoeProduct } from '../types/catalogue';
import { useAuth } from './AuthContext';
import { router } from '../routes';
import cartService, { BackendCartItem } from '../services/cartService';

export interface CartItem {
  cartId: string; // Composite key: `${product.id}-${size}`
  product: ShoeProduct;
  size: string;
  quantity: number;
  addedAt: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ShoeProduct, size?: string, quantity?: number) => Promise<boolean>;
  removeFromCart: (cartId: string) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'tekkie_store_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive stable cart identifier for authenticated user
  const userCartId = useMemo(() => {
    if (!isAuthenticated || !user) return null;
    return user.customerId || `cart_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }, [isAuthenticated, user]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to load cart from localStorage', err);
      return [];
    }
  });

  // Keep localStorage in sync for instant UX and offline resilience
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to persist cart to localStorage', err);
    }
  }, [cart]);

  const getEffectivePrice = (product: ShoeProduct): number => {
    return product.isOnSale && product.salePrice ? product.salePrice : product.price;
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + getEffectivePrice(item.product) * item.quantity, 0);
  }, [cart]);

  /**
   * Helper to format the backend cartItemId using user cart ID + product ID + size
   */
  const buildBackendCartItemId = useCallback((cartIdStr: string, cId: string) => {
    return `${cartIdStr}___${cId}`;
  }, []);

  /**
   * Refreshes the cart from the backend using Axios.
   * Reads the user's cart and cart items from Spring Boot.
   */
  const refreshCart = useCallback(async () => {
    if (!userCartId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Retrieve cart summary from backend
      const backendCart = await cartService.getCart(userCartId);

      // 2. Retrieve all cart items and filter for this user
      const allItems = await cartService.getAllCartItems();
      const userItems = allItems.filter((item) =>
        item.cartItemId.startsWith(`${userCartId}___`)
      );

      // If backend has user items, synchronize them with frontend state
      if (userItems.length > 0) {
        setCart((prev) => {
          // Merge backend quantities into existing products or keep local product details
          const updated: CartItem[] = [];

          userItems.forEach((bItem: BackendCartItem) => {
            const rawId = bItem.cartItemId.replace(`${userCartId}___`, '');
            const existing = prev.find((p) => p.cartId === rawId);

            if (existing) {
              updated.push({
                ...existing,
                quantity: bItem.quantity,
              });
            }
          });

          // If some items in prev were not in backend, preserve them and push to backend
          prev.forEach((p) => {
            if (!updated.some((u) => u.cartId === p.cartId)) {
              updated.push(p);
            }
          });

          return updated;
        });
      } else if (backendCart && backendCart.totalAmount === 0 && cart.length > 0) {
        // Backend cart exists but has 0 total and no items, sync current local cart to backend
        for (const item of cart) {
          const bItemId = buildBackendCartItemId(userCartId, item.cartId);
          const price = getEffectivePrice(item.product);
          await cartService.createCartItem({
            cartItemId: bItemId,
            quantity: item.quantity,
            unitPrice: price,
            subTotal: price * item.quantity,
          });
        }
        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: cartTotal,
        });
      }
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
        router.navigate('/login');
      } else {
        setError('Unable to synchronize cart with the server. Local cart remains active.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userCartId, cart, cartTotal, buildBackendCartItemId, logout]);

  // Synchronize cart on initial auth or user change
  useEffect(() => {
    if (isAuthenticated && userCartId) {
      refreshCart();
    }
  }, [isAuthenticated, userCartId, refreshCart]);

  /**
   * Adds an item to the cart.
   * REQUIREMENT: Unauthenticated users are immediately redirected to /login.
   */
  const addToCart = async (
    product: ShoeProduct,
    size?: string,
    quantity = 1
  ): Promise<boolean> => {
    // 1. Strict Authentication Check
    if (!isAuthenticated) {
      // Do NOT add to cart
      // Do NOT update cart count
      // Do NOT send Axios request
      // Immediately redirect to /login
      router.navigate('/login');
      return false;
    }

    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'UK 8');
    const cartId = `${product.id}-${selectedSize}`;
    const unitPrice = getEffectivePrice(product);

    let newQuantity = quantity;
    const existingIndex = cart.findIndex((item) => item.cartId === cartId);
    if (existingIndex > -1) {
      newQuantity = cart[existingIndex].quantity + quantity;
    }

    // 2. Update local state
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.cartId === cartId);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: newQuantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartId,
          product,
          size: selectedSize,
          quantity: newQuantity,
          addedAt: Date.now(),
        },
      ];
    });

    // 3. Persist to Spring Boot backend via Axios
    if (userCartId) {
      try {
        const backendItemId = buildBackendCartItemId(userCartId, cartId);
        const subTotal = unitPrice * newQuantity;

        await cartService.updateCartItem({
          cartItemId: backendItemId,
          quantity: newQuantity,
          unitPrice,
          subTotal,
        });

        const newTotal = cartTotal + unitPrice * quantity;
        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: newTotal,
        });
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logout();
          router.navigate('/login');
          return false;
        }
        console.warn('[CartContext] Failed to persist add-to-cart to backend:', err);
      }
    }

    return true;
  };

  /**
   * Updates quantity for an existing cart item.
   */
  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    const itemToUpdate = cart.find((item) => item.cartId === cartId);
    if (!itemToUpdate) return;

    const unitPrice = getEffectivePrice(itemToUpdate.product);

    // Update state
    setCart((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );

    // Update backend via Axios
    if (userCartId) {
      try {
        const backendItemId = buildBackendCartItemId(userCartId, cartId);
        const subTotal = unitPrice * quantity;

        await cartService.updateCartItem({
          cartItemId: backendItemId,
          quantity,
          unitPrice,
          subTotal,
        });

        // Recalculate totals
        const newTotal = cart.reduce((acc, curr) => {
          const price = getEffectivePrice(curr.product);
          const q = curr.cartId === cartId ? quantity : curr.quantity;
          return acc + price * q;
        }, 0);

        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: newTotal,
        });
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logout();
          router.navigate('/login');
        } else {
          console.warn('[CartContext] Failed to update quantity on backend:', err);
        }
      }
    }
  };

  /**
   * Removes an item from the cart.
   */
  const removeFromCart = async (cartId: string) => {
    const itemToRemove = cart.find((item) => item.cartId === cartId);

    // Update state
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));

    // Delete on backend via Axios
    if (userCartId && itemToRemove) {
      try {
        const backendItemId = buildBackendCartItemId(userCartId, cartId);
        await cartService.deleteCartItem(backendItemId);

        const newTotal = cart
          .filter((item) => item.cartId !== cartId)
          .reduce((acc, curr) => acc + getEffectivePrice(curr.product) * curr.quantity, 0);

        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: newTotal,
        });
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logout();
          router.navigate('/login');
        } else {
          console.warn('[CartContext] Failed to delete cart item on backend:', err);
        }
      }
    }
  };

  /**
   * Clears all items from the cart.
   */
  const clearCart = async () => {
    const prevCart = [...cart];
    setCart([]);

    if (userCartId) {
      try {
        for (const item of prevCart) {
          const backendItemId = buildBackendCartItemId(userCartId, item.cartId);
          await cartService.deleteCartItem(backendItemId);
        }
        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: 0,
        });
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logout();
          router.navigate('/login');
        } else {
          console.warn('[CartContext] Failed to clear cart on backend:', err);
        }
      }
    }
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    cartCount,
    cartTotal,
    isLoading,
    error,
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
