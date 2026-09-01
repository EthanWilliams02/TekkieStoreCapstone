import React from 'react';
import { Package, Tag, Shield } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import airMax90 from '../../assets/Nike/Nike Air Max 90.jpg';
import mr530 from '../../assets/New Balance/MR530 White_Grey.jpg';
import './ShipmentItems.css';

interface ShipmentItem {
  id: string;
  brand: string;
  name: string;
  colour: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  tag?: string;
}

export const ShipmentItems: React.FC = () => {
  const items: ShipmentItem[] = [
    {
      id: 'ship-item-1',
      brand: 'Nike',
      name: 'Air Max 90',
      colour: 'Wolf Grey / White / Black',
      size: 'UK 9',
      quantity: 1,
      price: 2499,
      image: airMax90,
      tag: 'JUST DROPPED',
    },
    {
      id: 'ship-item-2',
      brand: 'New Balance',
      name: 'MR530 White & Grey',
      colour: 'White / Silver / Grey',
      size: 'UK 9',
      quantity: 1,
      price: 1999,
      image: mr530,
      tag: 'SELLING FAST',
    },
  ];

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 0; // Free express delivery
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="shipment-items-card">
      <div className="shipment-card-header">
        <div className="shipment-header-left">
          <div className="shipment-icon-wrap">
            <Package size={20} />
          </div>
          <div>
            <h3 className="shipment-card-title">Items in This Shipment</h3>
            <p className="shipment-card-subtitle">
              Verified footwear units packed and sealed in tamper-evident packaging.
            </p>
          </div>
        </div>

        <span className="shipment-count-pill">
          {items.length} {items.length === 1 ? 'Item' : 'Items'} Enclosed
        </span>
      </div>

      <div className="shipment-items-list">
        {items.map((item) => (
          <div key={item.id} className="shipment-item-row">
            <div className="shipment-thumb-wrapper">
              {item.tag && (
                <span className="shipment-item-tag">{item.tag}</span>
              )}
              <img
                src={item.image}
                alt={`${item.brand} ${item.name}`}
                className="shipment-thumb-img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/trending_shoe_1_1788049696433.jpg';
                }}
              />
            </div>

            <div className="shipment-item-info">
              <span className="shipment-item-brand">{item.brand}</span>
              <h4 className="shipment-item-name">{item.name}</h4>
              <p className="shipment-item-colour">{item.colour}</p>
              
              <div className="shipment-specs-row">
                <span className="spec-pill">Size: {item.size}</span>
                <span className="spec-pill">Qty: {item.quantity}</span>
                <span className="spec-pill verified">
                  <Shield size={12} />
                  <span>Authenticity Verified</span>
                </span>
              </div>
            </div>

            <div className="shipment-item-price-col">
              <span className="price-label">Unit Price</span>
              <span className="item-unit-price">{formatPrice(item.price)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="shipment-summary-box">
        <div className="summary-row">
          <span className="summary-label">Items Subtotal:</span>
          <span className="summary-val">{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">
            <Tag size={13} className="summary-icon" />
            <span>Express Courier Shipping:</span>
          </span>
          <span className="summary-val free-badge">FREE (Promotional)</span>
        </div>
        <div className="summary-row total-row">
          <span className="total-label">Total Paid:</span>
          <span className="total-val">{formatPrice(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};
