import React from 'react';
import { BackendOrderItem } from '../../../services/orderService';
import { formatPrice } from '../../../utils/formatters';
import { Package } from 'lucide-react';
import { ProductImage } from '../../shared/ProductImage';

interface OrderItemsListProps {
  items: BackendOrderItem[];
}

const OrderItemThumbnail: React.FC<{ src?: string; alt: string }> = ({ src, alt }) => (
  <ProductImage src={src || ''} alt={alt} className="order-item-thumb-img" loading="lazy" />
);

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="order-items-empty">
        <Package size={24} className="text-muted" />
        <span>No items recorded for this order</span>
      </div>
    );
  }

  return (
    <div className="order-items-list-container">
      {items.map((item, index) => {
        const itemSubtotal =
          typeof item.subTotal === 'number'
            ? item.subTotal
            : (item.unitPrice || 0) * (item.quantity || 1);

        return (
          <div key={item.orderItemId || `item-${index}`} className="order-item-row">
            <div className="order-item-thumb-wrapper">
              <OrderItemThumbnail
                src={item.imageUrl}
                alt={item.shoeName || 'Sneaker'}
              />
            </div>

            <div className="order-item-info">
              <div className="order-item-brand">{item.brand || 'TekkieStore'}</div>
              <div className="order-item-name">{item.shoeName || 'Sneaker Item'}</div>
              <div className="order-item-meta">
                <span className="meta-pill">Size: {item.size || 'N/A'}</span>
                <span className="meta-pill">Qty: {item.quantity}</span>
                <span className="meta-unit-price">
                  @{formatPrice(item.unitPrice || 0)} each
                </span>
              </div>
            </div>

            <div className="order-item-pricing">
              <span className="item-subtotal-value">
                {formatPrice(itemSubtotal)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
