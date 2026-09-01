import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw, AlertCircle } from 'lucide-react';
import { ShoeProduct } from '../../types/catalogue';
import { formatPrice } from '../../utils/formatters';
import './ProductInfo.css';

interface ProductInfoProps {
  product: ShoeProduct;
  onProceedToCheckout: (size: string, quantity: number) => void;
  onBuyItNow: (size: string, quantity: number) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onProceedToCheckout,
  onBuyItNow,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeError, setSizeError] = useState<boolean>(false);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    if (sizeError) {
      setSizeError(false);
    }
  };

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleProceedClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    onProceedToCheckout(selectedSize, quantity);
  };

  const handleBuyNowClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    onBuyItNow(selectedSize, quantity);
  };

  return (
    <div className="product-details-info">
      {/* BRAND & CATEGORY */}
      <div className="product-brand-row">
        <span className="product-info-brand">{product.brand}</span>
        <span className="product-info-category-pill">{product.category}</span>
        {product.gender && (
          <span className="product-info-gender-pill">{product.gender}'s</span>
        )}
      </div>

      {/* PRODUCT TITLE */}
      <h1 className="product-info-title">{product.name}</h1>

      {/* PRICE */}
      <div className="product-info-price-row">
        <span className="product-info-price">{formatPrice(product.price)}</span>
        <span className="product-info-vat">Incl. VAT</span>
      </div>

      {/* COLOUR SPECIFICATION */}
      <div className="product-info-section colour-section">
        <span className="info-section-title">
          COLOUR: <strong className="highlight-text">{product.colour}</strong>
        </span>
        <div className="colour-indicator-bar">
          <span className="colour-swatch" title={product.colour} />
          <span className="colour-desc-text">{product.colour}</span>
        </div>
      </div>

      {/* SIZE SELECTOR (REQUIRED) */}
      <div className={`product-info-section size-section ${sizeError ? 'has-error' : ''}`}>
        <div className="size-header-row">
          <span className="info-section-title">
            SIZE (UK):{' '}
            {selectedSize ? (
              <strong className="highlight-text">{selectedSize}</strong>
            ) : (
              <span className="select-prompt-text">Select your size</span>
            )}
          </span>
          <span className="size-guide-text">True to size</span>
        </div>

        <div className="product-size-grid" role="radiogroup" aria-label="Available Sizes">
          {product.sizes.map((sz) => {
            const isSelected = selectedSize === sz;
            return (
              <button
                key={sz}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`product-size-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSizeSelect(sz)}
              >
                {sz.replace('UK ', '')}
              </button>
            );
          })}
        </div>

        {/* VALIDATION ERROR MESSAGE */}
        {sizeError && (
          <div className="size-validation-msg" role="alert">
            <AlertCircle size={15} />
            <span>Please select a size before proceeding.</span>
          </div>
        )}
      </div>

      {/* QUANTITY SELECTOR */}
      <div className="product-info-section quantity-section">
        <span className="info-section-title">QUANTITY</span>
        <div className="quantity-control-wrapper">
          <button
            type="button"
            className="qty-btn"
            onClick={handleDecreaseQty}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            title="Decrease Quantity"
          >
            <Minus size={16} />
          </button>
          <span className="qty-value-display" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="qty-btn"
            onClick={handleIncreaseQty}
            aria-label="Increase quantity"
            title="Increase Quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* ACTION BUTTONS: PROCEED TO CHECKOUT & BUY IT NOW */}
      <div className="product-actions-group">
        <button
          type="button"
          className="btn-proceed-checkout"
          onClick={handleProceedClick}
        >
          <ShoppingBag size={18} />
          <span>PROCEED TO CHECKOUT</span>
        </button>

        <button
          type="button"
          className="btn-buy-it-now"
          onClick={handleBuyNowClick}
        >
          <Zap size={18} />
          <span>BUY IT NOW</span>
        </button>
      </div>

      {/* PRODUCT DESCRIPTION */}
      <div className="product-info-section description-section">
        <h2 className="info-section-heading">DESCRIPTION</h2>
        <p className="product-description-body">{product.description}</p>
      </div>

      {/* VALUE / TRUST HIGHLIGHTS */}
      <div className="product-trust-badges">
        <div className="trust-badge-item">
          <Truck className="trust-icon" size={20} />
          <div className="trust-badge-text">
            <strong>Fast Delivery Across SA</strong>
            <span>Free delivery on orders over R1 000</span>
          </div>
        </div>

        <div className="trust-badge-item">
          <ShieldCheck className="trust-icon" size={20} />
          <div className="trust-badge-text">
            <strong>100% Authentic Guarantee</strong>
            <span>Direct from authorized global distributors</span>
          </div>
        </div>

        <div className="trust-badge-item">
          <RotateCcw className="trust-icon" size={20} />
          <div className="trust-badge-text">
            <strong>Easy Returns & Exchanges</strong>
            <span>30-day hassle-free return policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
