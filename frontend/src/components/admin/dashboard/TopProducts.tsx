import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import { formatPrice } from '../../../utils/formatters';
import { BackendOrder } from '../../../services/orderService';
import { ProductImage } from '../../shared/ProductImage';
import './TopProducts.css';

interface TopProductsProps {
  orders: BackendOrder[];
  loading?: boolean;
  error?: boolean;
}

interface ProductAggregate {
  shoeId: string;
  shoeName: string;
  brand: string;
  imageUrl: string;
  unitsSold: number;
  revenue: number;
}

// Ranks products by real units sold, aggregated from every order's line items.
const aggregateTopProducts = (orders: BackendOrder[]): ProductAggregate[] => {
  const byShoe = new Map<string, ProductAggregate>();

  orders
    .filter((o) => o.status !== 'CANCELLED')
    .forEach((o) => {
      (o.orderItems || []).forEach((item) => {
        const existing = byShoe.get(item.shoeId);
        if (existing) {
          existing.unitsSold += item.quantity;
          existing.revenue += item.subTotal;
        } else {
          byShoe.set(item.shoeId, {
            shoeId: item.shoeId,
            shoeName: item.shoeName,
            brand: item.brand,
            imageUrl: item.imageUrl,
            unitsSold: item.quantity,
            revenue: item.subTotal,
          });
        }
      });
    });

  return Array.from(byShoe.values()).sort((a, b) => b.unitsSold - a.unitsSold);
};

export const TopProducts: React.FC<TopProductsProps> = ({ orders, loading = false, error = false }) => {
  const navigate = useNavigate();
  const topList = useMemo(() => aggregateTopProducts(orders).slice(0, 6), [orders]);

  return (
    <div className="dashboard-card top-products-card">
      <div className="card-header-row">
        <h2 className="card-title">Top Products</h2>
      </div>

      {error ? (
        <div className="dashboard-empty-state dashboard-empty-state-error">Unable to load orders from the server.</div>
      ) : !loading && topList.length === 0 ? (
        <div className="dashboard-empty-state">No sales yet — top sellers appear once orders come in.</div>
      ) : (
        <ul className="top-products-list">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <li className="top-product-row" key={idx}>
                  <span className="top-product-rank">
                    <Skeleton variant="text" width={14} animation="wave" />
                  </span>
                  <Skeleton variant="rounded" width={44} height={44} animation="wave" sx={{ borderRadius: '8px' }} />
                  <div className="top-product-info">
                    <Skeleton variant="text" width={130} animation="wave" />
                    <Skeleton variant="text" width={60} height={14} animation="wave" />
                  </div>
                  <div className="top-product-stats">
                    <Skeleton variant="text" width={50} height={14} animation="wave" sx={{ ml: 'auto' }} />
                    <Skeleton variant="text" width={70} animation="wave" sx={{ ml: 'auto' }} />
                  </div>
                </li>
              ))
            : topList.map((prod, idx) => (
            <li
              key={prod.shoeId}
              className="top-product-row"
              onClick={() => navigate(`/product/${prod.shoeId}`)}
            >
              <span className="top-product-rank">{idx + 1}</span>
              <div className="top-product-thumb">
                {prod.imageUrl ? <ProductImage src={prod.imageUrl} alt={prod.shoeName} /> : null}
              </div>
              <div className="top-product-info">
                <span className="top-product-name">{prod.shoeName}</span>
                <span className="top-product-brand">{prod.brand}</span>
              </div>
              <div className="top-product-stats">
                <span className="top-product-units">{prod.unitsSold} sold</span>
                <span className="top-product-revenue">{formatPrice(prod.revenue)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopProducts;
