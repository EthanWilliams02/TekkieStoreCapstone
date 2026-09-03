import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

interface CheckoutOrderSummaryProps {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  vatAmount?: number;
  finalTotal: number;
  isSubmitting: boolean;
  onPlaceOrder: () => void;
}

export const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  cart,
  cartCount,
  subtotal,
  shippingFee,
  vatAmount,
  finalTotal,
  isSubmitting,
  onPlaceOrder,
}) => {
  // SA VAT is 15%: Subtotal * 0.15
  const calculatedVat = vatAmount !== undefined ? vatAmount : Math.round(subtotal * 0.15);

  return (
    <aside className="checkout-summary-card" aria-label="Order Summary">
      {/* Header */}
      <div className="checkout-summary-header">
        <h2 className="checkout-summary-title">ORDER SUMMARY</h2>
        <span className="summary-count-badge">
          {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'}
        </span>
      </div>

      {/* Cart Items List */}
      <div className="checkout-items-list" role="list" aria-label="Items in order">
        {cart.length === 0 ? (
          <div className="checkout-empty-cart">
            <ShoppingBag size={32} className="empty-cart-icon" />
            <p className="empty-cart-text">Your cart is currently empty.</p>
            <Link to="/catalogue" className="btn-back-catalogue">
              <span>Browse Catalogue</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.cartId} className="checkout-item-row" role="listitem">
              <div className="checkout-item-thumb-wrapper">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="checkout-item-thumb"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = '/hero.png';
                  }}
                />
                <span className="checkout-item-qty-badge">{item.quantity}</span>
              </div>

              <div className="checkout-item-info">
                <h3 className="checkout-item-name">{item.product.name}</h3>
                <div className="checkout-item-meta">
                  <span className="meta-brand">{item.product.brand}</span>
                  <span className="meta-dot">•</span>
                  <span className="meta-size">Size: {item.size}</span>
                </div>
              </div>

              <div className="checkout-item-pricing">
                <span className="checkout-item-price">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
                {item.quantity > 1 && (
                  <span className="checkout-item-each">
                    {formatPrice(item.product.price)} each
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="summary-divider" />

      {/* Calculations */}
      <div className="checkout-financials">
        <div className="checkout-financial-row">
          <span className="fin-label">Subtotal</span>
          <span className="fin-value">{formatPrice(subtotal)}</span>
        </div>

        <div className="checkout-financial-row">
          <span className="fin-label">Shipping</span>
          <span className="fin-value">
            {shippingFee === 0 ? (
              <span className="free-shipping-text">FREE</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>

        <div className="checkout-financial-row vat-note-row">
          <span className="fin-label-vat">
            Estimated VAT (15% included)
          </span>
          <span className="fin-value-vat">{formatPrice(calculatedVat)}</span>
        </div>

        <div className="summary-divider thick" />

        {/* Final Total */}
        <div className="checkout-financial-row total-highlight-row">
          <div className="total-label-box">
            <span className="total-main-label">TOTAL</span>
            <span className="total-vat-tag">VAT included</span>
          </div>
          <span className="total-orange-amount">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* Place Order CTA */}
      <div className="checkout-cta-section">
        <button
          type="button"
          id="btn-place-secure-order"
          className="btn-place-order"
          onClick={onPlaceOrder}
          disabled={isSubmitting || cart.length === 0}
          aria-label="Place Secure Order"
        >
          <span>{isSubmitting ? 'PROCESSING ORDER...' : 'PLACE SECURE ORDER'}</span>
        </button>

        {/* Terms Agreement */}
        <p className="checkout-terms-text">
          BY PLACING YOUR ORDER, YOU AGREE TO OUR{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            TERMS & CONDITIONS
          </a>
          .
        </p>

        {/* Trust Badges */}
        <div className="checkout-trust-indicators" aria-label="Security and buyer protections">
          <div className="trust-indicator-badge">
            <Check size={13} className="trust-check" />
            <span>3D Secure 2.0</span>
          </div>
          <div className="trust-indicator-badge">
            <Check size={13} className="trust-check" />
            <span>Buyer Protection</span>
          </div>
          <div className="trust-indicator-badge">
            <ShieldCheck size={14} className="trust-shield" />
            <span>256-Bit SSL</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
