import React from 'react';
import { formatPrice } from '../../../utils/formatters';
import './RecentOrders.css';

export interface DashboardOrder {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  date: string;
  amount: number;
  status: 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
}

interface RecentOrdersProps {
  orders?: DashboardOrder[];
}

const DEFAULT_ORDERS: DashboardOrder[] = [
  {
    orderNumber: '#ORD-9412',
    customerName: 'Ethan Williams',
    customerEmail: 'ethan.w@example.com',
    date: '15 Sep 2026',
    amount: 2899,
    status: 'Processing',
  },
  {
    orderNumber: '#ORD-9411',
    customerName: 'Solly Hendricks',
    customerEmail: 'solly.h@example.com',
    date: '15 Sep 2026',
    amount: 3499,
    status: 'Dispatched',
  },
  {
    orderNumber: '#ORD-9410',
    customerName: 'Redah Gamieldien',
    customerEmail: 'redah.g@example.com',
    date: '14 Sep 2026',
    amount: 1999,
    status: 'Delivered',
  },
  {
    orderNumber: '#ORD-9409',
    customerName: 'Angelo Jacobs',
    customerEmail: 'angelo.j@example.com',
    date: '13 Sep 2026',
    amount: 2599,
    status: 'Delivered',
  },
  {
    orderNumber: '#ORD-9408',
    customerName: 'Rameez Karriem',
    customerEmail: 'rameez.k@example.com',
    date: '12 Sep 2026',
    amount: 4199,
    status: 'Cancelled',
  },
];

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders = DEFAULT_ORDERS }) => {
  const displayOrders = orders.length > 0 ? orders.slice(0, 5) : DEFAULT_ORDERS;

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'status-badge-processing';
      case 'dispatched':
      case 'in transit':
        return 'status-badge-dispatched';
      case 'delivered':
        return 'status-badge-delivered';
      case 'cancelled':
        return 'status-badge-cancelled';
      default:
        return 'status-badge-default';
    }
  };

  return (
    <div className="dashboard-card recent-orders-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">Recent Orders</h2>
          <p className="card-subtitle">Latest incoming store transactions</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((ord) => (
              <tr key={ord.orderNumber}>
                <td className="font-semibold text-obsidian">{ord.orderNumber}</td>
                <td>
                  <div className="customer-cell">
                    <span className="customer-name">{ord.customerName}</span>
                    {ord.customerEmail && (
                      <span className="customer-sub">{ord.customerEmail}</span>
                    )}
                  </div>
                </td>
                <td className="text-muted text-sm">{ord.date}</td>
                <td className="font-semibold text-obsidian">{formatPrice(ord.amount)}</td>
                <td>
                  <span className={`status-pill ${getStatusBadgeClass(ord.status)}`}>
                    {ord.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
