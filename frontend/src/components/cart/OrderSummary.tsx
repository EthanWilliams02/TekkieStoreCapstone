import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Tag, Check, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import './OrderSummary.css';

interface OrderSummaryProps {
  subtotal: number;
  itemCount: number;
}

const FREE_SHIPPING_THRESHOLD = 1000;
const STANDARD_SHIPPING_FEE = 150;

export const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, itemCount }) => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const discountAmount = Math.round(subtotal * discountPercent);
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'TEKKIE10' || cleanCode === 'SNEAKER10') {
      setDiscountPercent(0.1);
      setPromoApplied(true);
      setPromoError('');
    } else if (cleanCode === 'SOLETOWN15') {
      setDiscountPercent(0.15);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "TEKKIE10"');
      setPromoApplied(false);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <aside className="order-summary-card" aria-label="Order Summary">
      <div className="order-summary-header">
        <h2 className="order-summary-title">ORDER SUMMARY</h2>
        <span className="summary-item-badge">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* FREE SHIPPING PROGRESS BAR */}
      <div className="free-shipping-tracker">
        {isFreeShipping ? (
          <div className="shipping-progress-text success">
            <Check size={16} />
            <span>You've unlocked <strong>FREE Express Delivery</strong>!</span>
          </div>
        ) : (
          <div className="shipping-progress-text">
            <span>
              Add <strong>{formatPrice(amountToFreeShipping)}</strong> more for <strong>FREE Delivery</strong>
            </span>
          </div>
        )}
        <div className="progress-bar-track" role="progressbar" aria-valuenow={freeShippingProgress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`progress-bar-fill ${isFreeShipping ? 'complete' : ''}`}
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* FINANCIAL LINES */}
      <div className="summary-financials">
        <div className="financial-row">
          <span className="financial-label">Subtotal</span>
          <span className="financial-val">{formatPrice(subtotal)}</span>
        </div>

        {promoApplied && (
          <div className="financial-row discount-row">
            <span className="financial-label">
              <Tag size={13} />
              <span>Discount ({Math.round(discountPercent * 100)}%)</span>
            </span>
            <span className="financial-val discount-val">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="financial-row">
          <span className="financial-label">
            <Truck size={14} className="inline-icon" />
            <span>Estimated Shipping</span>
          </span>
          <span className="financial-val">
            {isFreeShipping ? (
              <span className="free-shipping-badge">FREE</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>

        <div className="financial-row tax-note-row">
          <span className="financial-label-small">Estimated VAT</span>
          <span className="financial-val-small">Included in price</span>
        </div>

        {/* PROMO INPUT ACCORDION */}
        <form className="promo-code-form" onSubmit={handleApplyPromo}>
          <div className="promo-input-group">
            <input
              type="text"
              placeholder="Promo Code (e.g. TEKKIE10)"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setPromoError('');
              }}
              className={`promo-input ${promoError ? 'error' : ''}`}
              aria-label="Promo or discount code"
            />
            <button
              type="submit"
              className="promo-apply-btn"
              disabled={!promoCode.trim()}
            >
              Apply
            </button>
          </div>
          {promoError && <p className="promo-error-msg">{promoError}</p>}
          {promoApplied && (
            <p className="promo-success-msg">
              <Check size={12} /> Promo code applied successfully!
            </p>
          )}
        </form>

        <div className="financial-divider" />

        {/* FINAL TOTAL */}
        <div className="financial-row total-row">
          <div>
            <span className="total-title">Total</span>
            <span className="total-subtitle">VAT included</span>
          </div>
          <span className="final-total-amount">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* CHECKOUT ACTION BUTTON (No navigation, interactive feedback) */}
      <div className="checkout-action-wrapper">
        <button
          type="button"
          className="btn-proceed-checkout"
          onClick={handleProceedToCheckout}
          aria-label="Proceed to Checkout"
        >
          <ShoppingBag size={18} />
          <span>PROCEED TO CHECKOUT</span>
        </button>

        <Link to="/catalogue" className="btn-continue-shopping">
          <span>Continue Shopping</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* TRUST GUARANTEES */}
      <div className="summary-trust-perks">
        <div className="trust-perk-item">
          <ShieldCheck size={18} className="perk-icon" />
          <div className="perk-text">
            <strong>100% Authentic Guarantee</strong>
            <span>Direct from verified brands</span>
          </div>
        </div>
        <div className="trust-perk-item">
          <Truck size={18} className="perk-icon" />
          <div className="perk-text">
            <strong>Fast Courier Delivery</strong>
            <span>Dispatched via DSV Express</span>
          </div>
        </div>
        <div className="trust-perk-item">
          <RotateCcw size={18} className="perk-icon" />
          <div className="perk-text">
            <strong>30-Day Easy Returns</strong>
            <span>Hassle-free exchange policy</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
