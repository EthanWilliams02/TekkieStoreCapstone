import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ShoeProduct } from '../types/catalogue';
import { useAuth } from './AuthContext';
import { router } from '../routes';
import cartService, { BackendCartItem } from '../services/cartService';
import { fetchAllShoes, mapBackendShoeToProduct, fetchShoeById } from '../services/shoeService';
import { ShoeVariant, ShoeSize } from '../types/shoeVariant';

export interface CartItem {
  cartId: string; // Composite key: `${product.id}-${variantId || size}` (frontend line identity)
  cartItemId: string; // Persistent unique backend CartItem UUID
  product: ShoeProduct;
  size: string;
  quantity: number;
  addedAt: number;
  variantId?: string;
  sizeRegion?: string;
  colour?: string;
  variant?: ShoeVariant;
  shoeSize?: ShoeSize;
}

const parseShoeSize = (sizeStr?: string, defaultRegion = 'UK'): { sizeValue: number; sizeRegion: string } => {
  const fallbackRegion = defaultRegion || 'UK';
  if (!sizeStr) return { sizeValue: 0, sizeRegion: fallbackRegion };
  const match = sizeStr.match(/^(?:([A-Za-z]+)\s*)?([0-9]+(?:\.[0-9]+)?)/);
  if (match) {
    const region = match[1] || fallbackRegion;
    const val = parseFloat(match[2]);
    return { sizeValue: isNaN(val) ? 0 : val, sizeRegion: region || fallbackRegion };
  }
  return { sizeValue: 0, sizeRegion: fallbackRegion };
};

const buildCartLineId = (productId: string, variantId?: string, sizeStr?: string): string => {
  return variantId ? `${productId}-${variantId}` : `${productId}-${sizeStr || ''}`;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: ShoeProduct,
    size?: string,
    quantity?: number,
    variant?: ShoeVariant | { variantId?: string; sizeRegion?: string; colour?: string; size?: string }
  ) => Promise<boolean>;
  removeFromCart: (cartId: string) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  error: string | null;
}

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

  // Backend database is single source of truth; no localStorage reading or caching
  const [cart, setCart] = useState<CartItem[]>([]);

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
   * Refreshes the cart directly from the backend database.
   * Fetches user's cart items using getCartItemsByCartId(userCartId) and builds full product state.
   */
  const refreshCart = useCallback(async () => {
    if (!userCartId) {
      setCart([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Retrieve cart summary from backend
      await cartService.getCart(userCartId);

      // 2. Retrieve user's cart items from backend
      const backendItems = await cartService.getCartItemsByCartId(userCartId);

      // 3. Retrieve shoe catalogue to enrich cart lines with full product metadata
      const shoes = await fetchAllShoes();
      const shoeMap = new Map<string, ShoeProduct>(shoes.map((s) => [s.id, s]));

      const loadedCart: CartItem[] = [];

      for (const bItem of backendItems) {
        const shoeId = bItem.shoe?.shoeId;
        if (!shoeId) continue;

        let product = shoeMap.get(shoeId);
        if (!product && bItem.shoe) {
          product = mapBackendShoeToProduct(bItem.shoe as any);
        }
        if (!product) {
          const fetched = await fetchShoeById(shoeId);
          if (fetched) {
            product = fetched;
            shoeMap.set(shoeId, fetched);
          }
        }
        if (!product) {
          console.warn(`[CartContext] Could not resolve shoe metadata for shoeId: ${shoeId}`);
          continue;
        }

        const variantId = bItem.shoeVariant?.variantId;
        const fallbackRegion = bItem.shoeSize?.sizeRegion || 'UK';
        const shoeSizeObj: ShoeSize = bItem.shoeSize
          ? { sizeValue: bItem.shoeSize.sizeValue, sizeRegion: bItem.shoeSize.sizeRegion || fallbackRegion }
          : (bItem.shoeVariant?.size
            ? { sizeValue: bItem.shoeVariant.size.sizeValue, sizeRegion: bItem.shoeVariant.size.sizeRegion || fallbackRegion }
            : parseShoeSize(product.sizes?.[0] || 'UK 8', fallbackRegion));

        const sizeRegion = shoeSizeObj.sizeRegion || fallbackRegion;
        const sizeStr = `${sizeRegion} ${shoeSizeObj.sizeValue}`;
        const selectedColour = bItem.shoeVariant?.colour || product.colour;
        const cartId = buildCartLineId(product.id, variantId, sizeStr);

        loadedCart.push({
          cartId,
          cartItemId: bItem.cartItemId,
          product: selectedColour && selectedColour !== product.colour ? { ...product, colour: selectedColour } : product,
          size: sizeStr,
          sizeRegion,
          colour: selectedColour,
          variantId,
          variant: bItem.shoeVariant
            ? {
                variantId: bItem.shoeVariant.variantId,
                size: shoeSizeObj,
                colour: selectedColour,
                stockQuantity: bItem.shoeVariant.stockQuantity ?? 10,
              }
            : undefined,
          shoeSize: shoeSizeObj,
          quantity: bItem.quantity,
          addedAt: Date.now(),
        });
      }

      setCart(loadedCart);

      // Keep backend cart total synchronized
      const calculatedTotal = loadedCart.reduce(
        (acc, item) => acc + getEffectivePrice(item.product) * item.quantity,
        0
      );
      await cartService.updateCart({
        cartId: userCartId,
        totalAmount: calculatedTotal,
      });
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
        router.navigate('/login');
      } else {
        console.warn('[CartContext] Failed to load cart from backend:', err);
        setError('Unable to load cart from the server.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userCartId, logout]);

  // Synchronize cart on initial auth or user change
  useEffect(() => {
    if (isAuthenticated && userCartId) {
      refreshCart();
    } else if (!isAuthenticated) {
      setCart([]);
    }
  }, [isAuthenticated, userCartId, refreshCart]);

  /**
   * Adds an item to the cart.
   * Authenticated users persist directly to backend before updating React cart state.
   */
  const addToCart = async (
    product: ShoeProduct,
    size?: string,
    quantity = 1,
    variant?: ShoeVariant | { variantId?: string; sizeRegion?: string; colour?: string; size?: string }
  ): Promise<boolean> => {
    // 1. Strict Authentication Check
    if (!isAuthenticated || !userCartId) {
      router.navigate('/login');
      return false;
    }

    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'UK 8');
    const variantId = variant && 'variantId' in variant ? variant.variantId : undefined;
    const cartId = variantId ? `${product.id}-${variantId}` : `${product.id}-${selectedSize}`;
    const unitPrice = getEffectivePrice(product);

    const selectedColour = (variant && 'colour' in variant && variant.colour) ? variant.colour : product.colour;
    const sizeRegion =
      (variant && 'size' in variant && variant.size && typeof variant.size === 'object' && variant.size.sizeRegion)
      || (variant && 'sizeRegion' in variant && variant.sizeRegion)
      || 'UK';

    const shoeSizeObj: ShoeSize =
      variant && 'size' in variant && variant.size
        ? typeof variant.size === 'object'
          ? { sizeValue: variant.size.sizeValue, sizeRegion: variant.size.sizeRegion || sizeRegion }
          : parseShoeSize(variant.size, sizeRegion)
        : parseShoeSize(selectedSize, sizeRegion);

    // PRIMARY MATCH: Look up the line in current cart state by composite frontend key:
    let existingItem = cart.find((item) => item.cartId === cartId);

    // FALLBACK MATCH: Scan for matching (productId, variantId, sizeValue, sizeRegion)
    if (!existingItem) {
      existingItem = cart.find((item) => {
        const sameProduct = item.product.id === product.id;
        const sameVariant = (item.variantId || undefined) === (variantId || undefined);
        const itemSizeObj = item.shoeSize || parseShoeSize(item.size, item.sizeRegion || 'UK');
        const sameSizeValue = itemSizeObj.sizeValue === shoeSizeObj.sizeValue;
        const sameSizeRegion = (itemSizeObj.sizeRegion || 'UK').toUpperCase() === (shoeSizeObj.sizeRegion || 'UK').toUpperCase();
        return sameProduct && sameVariant && sameSizeValue && sameSizeRegion;
      });
    }

    const isExisting = Boolean(existingItem);
    const targetCartItemId = existingItem ? existingItem.cartItemId : crypto.randomUUID();
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
    const subTotal = unitPrice * newQuantity;

    const backendPayload: BackendCartItem = {
      cartItemId: targetCartItemId,
      cart: { cartId: userCartId },
      shoe: { shoeId: product.id },
      shoeVariant: variantId ? { variantId } : null,
      shoeSize: shoeSizeObj,
      quantity: newQuantity,
      unitPrice,
      subTotal,
    };

    try {
      if (isExisting) {
        // EXISTING ITEM: Reuse backend cartItemId and POST /cartitem/update
        await cartService.updateCartItem(backendPayload);
      } else {
        // NEW ITEM: Persist newly generated UUID and POST /cartitem/create
        await cartService.createCartItem(backendPayload);
      }

      // Update backend cart total amount
      const newTotal = cart.reduce((acc, curr) => {
        const price = getEffectivePrice(curr.product);
        const q = curr.cartItemId === targetCartItemId ? newQuantity : curr.quantity;
        return acc + price * q;
      }, isExisting ? 0 : unitPrice * quantity);

      await cartService.updateCart({
        cartId: userCartId,
        totalAmount: newTotal,
      });

      // ONLY update React state after the backend operation succeeds!
      setCart((prev) => {
        const existingIdx = prev.findIndex((item) => item.cartItemId === targetCartItemId);
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQuantity,
            variantId: variantId || updated[existingIdx].variantId,
            sizeRegion: sizeRegion || updated[existingIdx].sizeRegion,
            colour: selectedColour || updated[existingIdx].colour,
            shoeSize: shoeSizeObj || updated[existingIdx].shoeSize,
          };
          return updated;
        }

        return [
          ...prev,
          {
            cartId,
            cartItemId: targetCartItemId,
            product: selectedColour && selectedColour !== product.colour ? { ...product, colour: selectedColour } : product,
            size: selectedSize,
            sizeRegion,
            colour: selectedColour,
            variantId,
            variant: variant && 'stockQuantity' in variant ? (variant as ShoeVariant) : undefined,
            shoeSize: shoeSizeObj,
            quantity: newQuantity,
            addedAt: Date.now(),
          },
        ];
      });

      return true;
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
        router.navigate('/login');
        return false;
      }
      console.warn('[CartContext] Failed to persist add-to-cart to backend:', err);
      return false;
    }
  };

  /**
   * Updates quantity for an existing cart item.
   * Only updates frontend state after backend operation succeeds.
   */
  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    const itemToUpdate = cart.find((item) => item.cartId === cartId || item.cartItemId === cartId);
    if (!itemToUpdate || !userCartId || !itemToUpdate.cartItemId) return;

    const unitPrice = getEffectivePrice(itemToUpdate.product);
    const subTotal = unitPrice * quantity;

    try {
      const fallbackRegion = itemToUpdate.sizeRegion || 'UK';
      const shoeSizeObj = (itemToUpdate.shoeSize && itemToUpdate.shoeSize.sizeRegion)
        ? { sizeValue: itemToUpdate.shoeSize.sizeValue, sizeRegion: itemToUpdate.shoeSize.sizeRegion || fallbackRegion }
        : (itemToUpdate.variant?.size
          ? { sizeValue: itemToUpdate.variant.size.sizeValue, sizeRegion: itemToUpdate.variant.size.sizeRegion || fallbackRegion }
          : parseShoeSize(itemToUpdate.size, fallbackRegion));

      await cartService.updateCartItem({
        cartItemId: itemToUpdate.cartItemId,
        cart: { cartId: userCartId },
        shoe: { shoeId: itemToUpdate.product.id },
        shoeVariant: itemToUpdate.variantId ? { variantId: itemToUpdate.variantId } : null,
        shoeSize: shoeSizeObj,
        quantity,
        unitPrice,
        subTotal,
      });

      // Recalculate and update cart total on backend
      const newTotal = cart.reduce((acc, curr) => {
        const price = getEffectivePrice(curr.product);
        const q = curr.cartItemId === itemToUpdate.cartItemId ? quantity : curr.quantity;
        return acc + price * q;
      }, 0);

      await cartService.updateCart({
        cartId: userCartId,
        totalAmount: newTotal,
      });

      // ONLY update React state after backend succeeds
      setCart((prev) =>
        prev.map((item) =>
          item.cartItemId === itemToUpdate.cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
        router.navigate('/login');
      } else {
        console.warn('[CartContext] Failed to update quantity on backend:', err);
      }
    }
  };

  /**
   * Removes an item from the cart.
   * Only updates frontend state after backend operation succeeds.
   */
  const removeFromCart = async (cartId: string) => {
    const itemToRemove = cart.find((item) => item.cartId === cartId || item.cartItemId === cartId);
    if (!itemToRemove || !userCartId || !itemToRemove.cartItemId) return;

    try {
      // 1. Delete on backend first using actual cartItemId
      await cartService.deleteCartItem(itemToRemove.cartItemId);

      // 2. Recalculate and update cart total on backend
      const newTotal = cart
        .filter((item) => item.cartItemId !== itemToRemove.cartItemId)
        .reduce((acc, curr) => acc + getEffectivePrice(curr.product) * curr.quantity, 0);

      await cartService.updateCart({
        cartId: userCartId,
        totalAmount: newTotal,
      });

      // 3. ONLY update React state after backend succeeds
      setCart((prev) => prev.filter((item) => item.cartItemId !== itemToRemove.cartItemId));
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
        router.navigate('/login');
      } else {
        console.warn('[CartContext] Failed to delete cart item on backend:', err);
      }
    }
  };

  /**
   * Clears all items from the cart.
   */
  const clearCart = async () => {
    if (userCartId) {
      try {
        for (const item of cart) {
          if (item.cartItemId) {
            await cartService.deleteCartItem(item.cartItemId);
          }
        }
        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: 0,
        });
        setCart([]);
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logout();
          router.navigate('/login');
        } else {
          console.warn('[CartContext] Failed to clear cart on backend:', err);
        }
      }
    } else {
      setCart([]);
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
