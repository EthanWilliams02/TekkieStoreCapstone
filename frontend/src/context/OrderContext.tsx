import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from './CartContext';

export interface OrderItem {
  id: string;
  productId: string | number;
  name: string;
  brand: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export interface OrderShippingAddress {
  recipientName: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  fullAddress: string;
}

export interface Order {
  id: string; // e.g. "TK-88291"
  orderNumber: string; // e.g. "#TK-88291"
  createdAt: string; // ISO date string
  dateFormatted: string; // e.g. "Oct 24, 2026"
  estimatedArrival: string; // e.g. "Oct 28 - 30"
  status: 'Order Confirmed' | 'Processing' | 'Dispatched' | 'Delivered';
  items: OrderItem[];
  itemsCount: number;
  subtotal: number;
  shippingFee: number;
  shippingMethod: string;
  vat: number; // 15% VAT included portion
  total: number;
  shippingAddress: OrderShippingAddress;
  paymentMethod: 'card' | 'eft';
  paymentReference: string; // e.g. "VISA-4921" or "EFT-88291"
  trackingNumber: string; // e.g. "DSV-ZA-99482710"
}

export interface CreateOrderInput {
  items: CartItem[];
  shippingData: {
    streetNumber: string;
    streetName: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
  };
  recipientName?: string;
  paymentMethod: 'card' | 'eft';
  cardLastFour?: string;
  cardBrand?: string;
  subtotal: number;
  vat?: number;
  shippingFee: number;
  total: number;
}

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  createOrder: (input: CreateOrderInput) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  setActiveOrderById: (orderId: string) => void;
}

const ORDERS_STORAGE_KEY = 'tekkie_store_orders';
const ACTIVE_ORDER_ID_KEY = 'tekkie_store_active_order_id';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Helper to calculate 3 to 5 business days range
const calculateEstimatedArrival = (baseDate: Date): string => {
  const addBusinessDays = (start: Date, days: number): Date => {
    const result = new Date(start);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        added++;
      }
    }
    return result;
  };

  const startEst = addBusinessDays(baseDate, 3);
  const endEst = addBusinessDays(baseDate, 5);

  const startMonth = startEst.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = endEst.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startEst.getDate();
  const endDay = endEst.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
      return [];
    }
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_ORDER_ID_KEY) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (activeOrderId) {
        localStorage.setItem(ACTIVE_ORDER_ID_KEY, activeOrderId);
      } else {
        localStorage.removeItem(ACTIVE_ORDER_ID_KEY);
      }
    } catch (e) {
      console.error('Failed to persist activeOrderId to localStorage', e);
    }
  }, [activeOrderId]);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || (orders.length > 0 ? orders[0] : null);

  const createOrder = (input: CreateOrderInput): Order => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
    const orderId = `TK-${randomDigits}`;
    const orderNumber = `#TK-${randomDigits}`;
    const now = new Date();

    const dateFormatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const estimatedArrival = calculateEstimatedArrival(now);

    // Map cart items into OrderItem structure
    const orderItems: OrderItem[] = input.items.map((item) => ({
      id: item.cartId,
      productId: item.product.id,
      name: item.product.name,
      brand: item.product.brand,
      price: item.product.price,
      size: item.size,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const totalQuantity = orderItems.reduce((acc, item) => acc + item.quantity, 0);

    // 15% South African VAT: Subtotal * 0.15
    const vatAmount = input.vat !== undefined ? input.vat : Math.round(input.subtotal * 0.15);

    // Safe payment reference - never full card details
    let paymentReference = '';
    if (input.paymentMethod === 'card') {
      const brand = input.cardBrand === 'mastercard' ? 'MC' : 'VISA';
      const lastFour = input.cardLastFour || '4921';
      paymentReference = `${brand}-${lastFour}`;
    } else {
      paymentReference = `EFT-${randomDigits}`;
    }

    const recipient = input.recipientName || 'Marcus Redelinghuys';
    const address = input.shippingData;
    const fullAddress = `${address.streetNumber} ${address.streetName}, ${address.suburb}, ${address.city}, ${address.province}, ${address.postalCode}`;

    const randomTrackingNum = Math.floor(10000000 + Math.random() * 90000000).toString();
    const trackingNumber = `DSV-ZA-${randomTrackingNum}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: now.toISOString(),
      dateFormatted,
      estimatedArrival,
      status: 'Order Confirmed',
      items: orderItems,
      itemsCount: totalQuantity,
      subtotal: input.subtotal,
      shippingFee: input.shippingFee,
      shippingMethod: 'DSV EXPRESS AIR',
      vat: vatAmount,
      total: input.total,
      shippingAddress: {
        recipientName: recipient,
        streetNumber: address.streetNumber,
        streetName: address.streetName,
        suburb: address.suburb,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        fullAddress,
      },
      paymentMethod: input.paymentMethod,
      paymentReference,
      trackingNumber,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);

    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    const cleanId = orderId.replace('#', '').trim().toUpperCase();
    return orders.find((o) => o.id.toUpperCase() === cleanId || o.orderNumber.toUpperCase() === `#${cleanId}`);
  };

  const setActiveOrderById = (orderId: string) => {
    const found = getOrderById(orderId);
    if (found) {
      setActiveOrderId(found.id);
    }
  };

  const value: OrderContextType = {
    orders,
    activeOrder,
    createOrder,
    getOrderById,
    setActiveOrderById,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
