export interface UserProfile {
  customerId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type OrderStatus = 'Delivered' | 'In Transit' | 'Processing' | 'Cancelled';

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}
