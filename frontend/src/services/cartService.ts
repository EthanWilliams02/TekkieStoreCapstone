import api from './api';

export interface BackendCart {
  cartId: string;
  totalAmount: number;
}

export interface BackendCartItem {
  cartItemId: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export const cartService = {
  /**
   * Retrieves a cart by its ID.
   * Endpoint: GET /cart/read/{id}
   */
  getCart: async (cartId: string): Promise<BackendCart | null> => {
    try {
      const response = await api.get<BackendCart>(`/cart/read/${encodeURIComponent(cartId)}`);
      return response.data;
    } catch (error) {
      console.warn(`[cartService] Failed to read cart ${cartId}:`, error);
      return null;
    }
  },

  /**
   * Creates a new cart entity.
   * Endpoint: POST /cart/create
   */
  createCart: async (cart: BackendCart): Promise<BackendCart> => {
    const response = await api.post<BackendCart>('/cart/create', cart);
    return response.data;
  },

  /**
   * Updates an existing cart entity (or creates if not found).
   * Endpoint: POST /cart/update
   */
  updateCart: async (cart: BackendCart): Promise<BackendCart> => {
    try {
      const response = await api.post<BackendCart>('/cart/update', cart);
      return response.data;
    } catch {
      // If update fails because cart doesn't exist yet, try create
      const response = await api.post<BackendCart>('/cart/create', cart);
      return response.data;
    }
  },

  /**
   * Deletes a cart by its ID.
   * Endpoint: DELETE /cart/delete/{id}
   */
  deleteCart: async (cartId: string): Promise<boolean> => {
    try {
      const response = await api.delete<boolean>(`/cart/delete/${encodeURIComponent(cartId)}`);
      return response.data;
    } catch (error) {
      console.warn(`[cartService] Failed to delete cart ${cartId}:`, error);
      return false;
    }
  },

  /**
   * Retrieves all cart items.
   * Endpoint: GET /cartitem/getAll
   */
  getAllCartItems: async (): Promise<BackendCartItem[]> => {
    try {
      const response = await api.get<BackendCartItem[]>('/cartitem/getAll');
      return response.data || [];
    } catch (error) {
      console.warn('[cartService] Failed to fetch cart items:', error);
      return [];
    }
  },

  /**
   * Retrieves a single cart item by ID.
   * Endpoint: GET /cartitem/read/{id}
   */
  getCartItem: async (cartItemId: string): Promise<BackendCartItem | null> => {
    try {
      const response = await api.get<BackendCartItem>(`/cartitem/read/${encodeURIComponent(cartItemId)}`);
      return response.data;
    } catch (error) {
      console.warn(`[cartService] Failed to read cart item ${cartItemId}:`, error);
      return null;
    }
  },

  /**
   * Creates a cart item.
   * Endpoint: POST /cartitem/create
   */
  createCartItem: async (cartItem: BackendCartItem): Promise<BackendCartItem> => {
    const response = await api.post<BackendCartItem>('/cartitem/create', cartItem);
    return response.data;
  },

  /**
   * Updates an existing cart item.
   * Endpoint: POST /cartitem/update
   */
  updateCartItem: async (cartItem: BackendCartItem): Promise<BackendCartItem> => {
    try {
      const response = await api.post<BackendCartItem>('/cartitem/update', cartItem);
      return response.data;
    } catch {
      // If update fails because item doesn't exist yet, fallback to create
      const response = await api.post<BackendCartItem>('/cartitem/create', cartItem);
      return response.data;
    }
  },

  /**
   * Deletes a cart item by ID.
   * Endpoint: DELETE /cartitem/delete/{id}
   */
  deleteCartItem: async (cartItemId: string): Promise<boolean> => {
    try {
      const response = await api.delete<boolean>(`/cartitem/delete/${encodeURIComponent(cartItemId)}`);
      return response.data;
    } catch (error) {
      console.warn(`[cartService] Failed to delete cart item ${cartItemId}:`, error);
      return false;
    }
  },
};

export default cartService;
