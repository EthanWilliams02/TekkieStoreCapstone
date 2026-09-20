import React, { useMemo, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Search, AlertCircle } from 'lucide-react';
import { useCustomers } from '../../../hooks/useCustomers';
import { useAdminOrders } from '../../../hooks/useAdminOrders';
import './Customers.css';

export const Customers: React.FC = () => {
  const { customers, loading: customersLoading, error: customersError } = useCustomers();
  const { orders, loading: ordersLoading } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState('');

  const loading = customersLoading || ordersLoading;

  // Real order counts per customer, derived from actual orders — not a
  // fabricated placeholder.
  const orderCountByCustomer = useMemo(() => {
    const counts = new Map<string, number>();
    orders.forEach((o) => {
      const id = o.customer?.customerId;
      if (!id) return;
      counts.set(id, (counts.get(id) || 0) + 1);
    });
    return counts;
  }, [orders]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.customerId.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Registered Customers</h1>
          <p className="admin-page-subtitle">View TekkieStore's registered customer accounts.</p>
        </div>
      </div>

      <div className="customers-toolbar-card">
        <div className="customers-search-box">
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by customer name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="customers-table-card">
        <div className="cust-table-responsive">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      <Skeleton variant="text" width={80} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={130} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={170} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={110} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={60} animation="wave" />
                    </td>
                  </tr>
                ))
              ) : customersError ? (
                <tr>
                  <td colSpan={5} className="cust-empty-row cust-empty-row-error">
                    <AlertCircle size={16} />
                    <span>Unable to load customers from the server.</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="cust-empty-row">
                    {customers.length === 0 ? 'No customers registered yet.' : 'No customers match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.customerId}>
                    <td className="cust-font-semibold cust-obsidian">{c.customerId}</td>
                    <td className="cust-name">{c.fullName}</td>
                    <td className="cust-text-muted cust-text-sm">{c.email}</td>
                    <td className="cust-text-sm">{c.phone}</td>
                    <td className="cust-font-semibold cust-text-sm">
                      {orderCountByCustomer.get(c.customerId) || 0} orders
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Customers;
