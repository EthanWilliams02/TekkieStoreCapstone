import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';
import { formatPrice } from '../../../utils/formatters';
import { BackendOrder, formatOrderStatus } from '../../../services/orderService';
import './RecentOrders.css';

interface RecentOrdersProps {
  orders: BackendOrder[];
  loading?: boolean;
  error?: boolean;
}

const getStatusBadgeClass = (status?: string): string => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'status-badge-pending';
    case 'PAID':
    case 'PACKED':
      return 'status-badge-processing';
    case 'SHIPPED':
      return 'status-badge-dispatched';
    case 'DELIVERED':
      return 'status-badge-delivered';
    case 'CANCELLED':
      return 'status-badge-cancelled';
    default:
      return 'status-badge-pending';
  }
};

const formatOrderDate = (raw: string | number): string => {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
};

const customerName = (o: BackendOrder): string => {
  const first = o.customer?.name?.firstName || '';
  const last = o.customer?.name?.lastName || '';
  const full = `${first} ${last}`.trim();
  return full || o.customer?.email || 'Unknown customer';
};

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, loading = false, error = false }) => {
  const recent = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard-card recent-orders-card">
      <div className="card-header-row">
        <h2 className="card-title">Recent Orders</h2>
        <Link to="/admin/orders" className="card-view-all-link">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {error ? (
        <div className="dashboard-empty-state dashboard-empty-state-error">Unable to load orders from the server.</div>
      ) : !loading && recent.length === 0 ? (
        <div className="dashboard-empty-state">No orders yet.</div>
      ) : (
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
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx}>
                      <td><Skeleton variant="text" width={60} animation="wave" /></td>
                      <td>
                        <div className="customer-cell">
                          <Skeleton variant="text" width={110} animation="wave" />
                          <Skeleton variant="text" width={140} height={14} animation="wave" />
                        </div>
                      </td>
                      <td><Skeleton variant="text" width={80} animation="wave" /></td>
                      <td><Skeleton variant="text" width={70} animation="wave" /></td>
                      <td><Skeleton variant="rounded" width={90} height={22} animation="wave" sx={{ borderRadius: '99px' }} /></td>
                    </tr>
                  ))
                : recent.map((ord) => (
                <tr key={ord.orderId}>
                  <td className="font-semibold text-obsidian">#{ord.orderId}</td>
                  <td>
                    <div className="customer-cell">
                      <span className="customer-name">{customerName(ord)}</span>
                      {ord.customer?.email && <span className="customer-sub">{ord.customer.email}</span>}
                    </div>
                  </td>
                  <td className="text-muted text-sm">{formatOrderDate(ord.orderDate)}</td>
                  <td className="font-semibold text-obsidian">{formatPrice(ord.totalAmount || 0)}</td>
                  <td>
                    <span className={`status-pill ${getStatusBadgeClass(ord.status)}`}>{formatOrderStatus(ord.status)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
