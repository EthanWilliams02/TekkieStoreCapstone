import api from './api';

export interface DeliveryAddressData {
  streetNumber: string;
  streetName: string;
  suburb: string;
  city: string;
  province?: string;
  postalCode: string;
}

export interface DeliveryDetailsData {
  deliveryId: string;
  order: {
    orderId: string;
  };
  address: DeliveryAddressData;
  courier: string;
  trackingNumber: string;
  estimatedDeliveryDate: string; // YYYY-MM-DD
}

// Backward-compatibility aliases for components importing old type names
export type BackendAddress = DeliveryAddressData;
export type BackendDeliveryDetailsPayload = DeliveryDetailsData;
export type BackendDeliveryDetailsResponse = DeliveryDetailsData;

export const deliveryService = {
  /**
   * Saves delivery details linked to an Order in Spring Boot.
   * Endpoint: POST /deliverydetails/create
   */
  saveDeliveryDetails: async (
    data: DeliveryDetailsData
  ): Promise<DeliveryDetailsData> => {
    const response = await api.post<DeliveryDetailsData>('/deliverydetails/create', data);
    return response.data;
  },

  /**
   * Retrieves DeliveryDetails by associated Order ID.
   * Endpoint: GET /deliverydetails/order/{orderId}
   */
  getDeliveryDetailsByOrderId: async (
    orderId: string
  ): Promise<DeliveryDetailsData | null> => {
    try {
      const response = await api.get<DeliveryDetailsData>(
        `/deliverydetails/order/${encodeURIComponent(orderId)}`
      );
      return response.data && response.data.deliveryId ? response.data : null;
    } catch (error) {
      console.warn(`[deliveryService] Failed to load delivery details for order ${orderId}:`, error);
      return null;
    }
  },
};
