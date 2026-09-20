import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';
import { ShoeVariant, ShoeSize } from '../../../types/shoeVariant';
import './InventoryStatus.css';

interface InventoryStatusProps {
  variants: ShoeVariant[];
  loading?: boolean;
  error?: boolean;
}

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

const LOW_STOCK_THRESHOLD = 5;

const getStockStatus = (qty: number): StockStatus => {
  if (qty <= 0) return 'Out of Stock';
  if (qty <= LOW_STOCK_THRESHOLD) return 'Low Stock';
  return 'In Stock';
};

const getStockBadgeClass = (status: StockStatus): string => {
  switch (status) {
    case 'In Stock':
      return 'stock-badge-in';
    case 'Low Stock':
      return 'stock-badge-low';
    case 'Out of Stock':
      return 'stock-badge-out';
  }
};

const renderSize = (size: ShoeSize): string => `${size.sizeRegion} ${size.sizeValue}`;

export const InventoryStatus: React.FC<InventoryStatusProps> = ({ variants, loading = false, error = false }) => {
  // Lowest stock first, so what actually needs attention surfaces at the top.
  const sorted = useMemo(
    () => [...variants].sort((a, b) => a.stockQuantity - b.stockQuantity).slice(0, 5),
    [variants]
  );

  return (
    <div className="dashboard-card inventory-status-card">
      <div className="card-header-row">
        <h2 className="card-title">Inventory Status</h2>
        <Link to="/admin/inventory" className="card-view-all-link">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {error ? (
        <div className="dashboard-empty-state dashboard-empty-state-error">Unable to load shoe variants from the server.</div>
      ) : !loading && sorted.length === 0 ? (
        <div className="dashboard-empty-state">No shoe variants recorded yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Shoe</th>
                <th>Colour</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="shoe-cell">
                          <Skeleton variant="text" width={120} animation="wave" />
                          <Skeleton variant="text" width={60} height={14} animation="wave" />
                        </div>
                      </td>
                      <td><Skeleton variant="text" width={80} animation="wave" /></td>
                      <td><Skeleton variant="text" width={50} animation="wave" /></td>
                      <td><Skeleton variant="text" width={60} animation="wave" /></td>
                      <td><Skeleton variant="rounded" width={90} height={22} animation="wave" sx={{ borderRadius: '99px' }} /></td>
                    </tr>
                  ))
                : sorted.map((v) => {
                const status = getStockStatus(v.stockQuantity);
                return (
                  <tr key={v.variantId}>
                    <td>
                      <div className="shoe-cell">
                        <span className="shoe-name">{v.shoe?.shoeName || 'Unknown shoe'}</span>
                        <span className="shoe-brand-tag">{v.shoe?.brand || '—'}</span>
                      </div>
                    </td>
                    <td className="text-muted text-sm">{v.colour}</td>
                    <td className="font-semibold text-obsidian text-sm">{renderSize(v.size)}</td>
                    <td className="font-semibold text-sm">{v.stockQuantity} units</td>
                    <td>
                      <span className={`status-pill ${getStockBadgeClass(status)}`}>{status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryStatus;
