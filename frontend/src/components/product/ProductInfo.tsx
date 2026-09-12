import React, { useState, useMemo, useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw, AlertCircle, Check } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';
import { ShoeProduct } from '../../types/catalogue';
import { ShoeVariant } from '../../types/shoeVariant';
import { formatPrice } from '../../utils/formatters';
import './ProductInfo.css';

interface ProductInfoProps {
  product: ShoeProduct;
  variants?: ShoeVariant[];
  variantsLoading?: boolean;
  variantsError?: boolean;
  onAddToCart?: (size: string, quantity: number, variant?: ShoeVariant) => void | boolean | Promise<void | boolean>;
  onProceedToCheckout?: (size: string, quantity: number, variant?: ShoeVariant) => void;
  onBuyItNow: (size: string, quantity: number, variant?: ShoeVariant) => void | boolean | Promise<void | boolean>;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  variants = [],
  variantsLoading = false,
  variantsError = false,
  onAddToCart,
  onProceedToCheckout,
  onBuyItNow,
}) => {
  // Sanitize and filter valid variants from the backend
  const validVariants = useMemo(() => {
    if (!variants || !Array.isArray(variants)) return [];
    return variants.filter(
      (v) =>
        v &&
        typeof v === 'object' &&
        v.variantId &&
        v.size &&
        typeof v.size.sizeValue !== 'undefined'
    );
  }, [variants]);

  const hasVariants = validVariants.length > 0;

  // Extract distinct available colours from backend variants
  const availableColours = useMemo(() => {
    if (!hasVariants) return [];
    const colours = validVariants
      .map((v) => (v.colour || '').trim())
      .filter((c) => Boolean(c));
    return Array.from(new Set(colours));
  }, [validVariants, hasVariants]);

  // Selected colour state
  const [selectedColour, setSelectedColour] = useState<string>('');

  // Default selected colour on variants load/change
  useEffect(() => {
    if (availableColours.length > 0) {
      // Prioritize first colour with in-stock variants
      const inStockColour = availableColours.find((col) =>
        validVariants.some((v) => v.colour?.toLowerCase() === col.toLowerCase() && v.stockQuantity > 0)
      );
      setSelectedColour(inStockColour || availableColours[0]);
    } else {
      setSelectedColour(product.colour || 'Original');
    }
  }, [availableColours, validVariants, product.colour]);

  // Variants filtered by the currently selected colour
  const colourVariants = useMemo(() => {
    if (!hasVariants) return [];
    if (!selectedColour) return validVariants;
    return validVariants.filter(
      (v) => v.colour?.trim().toLowerCase() === selectedColour.trim().toLowerCase()
    );
  }, [hasVariants, validVariants, selectedColour]);

  // Detected size region from backend data (e.g. UK, US, EU)
  const sizeRegion = useMemo(() => {
    if (colourVariants.length > 0 && colourVariants[0].size?.sizeRegion) {
      return colourVariants[0].size.sizeRegion.trim();
    }
    if (validVariants.length > 0 && validVariants[0].size?.sizeRegion) {
      return validVariants[0].size.sizeRegion.trim();
    }
    return 'UK';
  }, [colourVariants, validVariants]);

  // Distinct size options with real stock information for the selected colour
  const sizeOptions = useMemo(() => {
    if (!hasVariants) {
      return [];
    }

    // Sort numerically by sizeValue
    const sorted = [...colourVariants].sort((a, b) => a.size.sizeValue - b.size.sizeValue);

    return sorted.map((v) => {
      const region = v.size.sizeRegion || sizeRegion || 'UK';
      return {
        sizeLabel: `${v.size.sizeValue}`,
        fullSize: `${region} ${v.size.sizeValue}`,
        sizeValue: v.size.sizeValue,
        stockQuantity: v.stockQuantity,
        isAvailable: v.stockQuantity > 0,
        variant: v,
      };
    });
  }, [hasVariants, colourVariants, sizeRegion]);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  // If colour changes and current size is out of stock in new colour, reset size
  useEffect(() => {
    if (hasVariants && selectedSize) {
      const match = sizeOptions.find(
        (opt) => opt.sizeLabel === selectedSize || opt.fullSize === selectedSize
      );
      if (!match || !match.isAvailable) {
        setSelectedSize('');
      }
    }
  }, [selectedColour, sizeOptions, hasVariants, selectedSize]);

  // Determine currently matched ShoeVariant
  const selectedVariant = useMemo(() => {
    if (!hasVariants) return undefined;
    const match = sizeOptions.find(
      (opt) =>
        (opt.sizeLabel === selectedSize || opt.fullSize === selectedSize) && opt.isAvailable
    );
    return match?.variant;
  }, [hasVariants, sizeOptions, selectedSize]);

  // Stock status text and indicators for all 4 states
  const stockInfo = useMemo(() => {
    // 1. Loading state
    if (variantsLoading) {
      return { inStock: false, text: 'Checking live stock...', count: undefined };
    }
    // 2. Variant API error state
    if (variantsError) {
      return { inStock: false, text: 'Stock data unavailable', count: 0 };
    }
    // 3. No variants registered for this shoe
    if (!hasVariants) {
      return { inStock: false, text: 'Currently unavailable', count: 0 };
    }
    // 4. Variant selected
    if (selectedVariant) {
      if (selectedVariant.stockQuantity > 0) {
        return {
          inStock: true,
          text:
            selectedVariant.stockQuantity <= 5
              ? `Only ${selectedVariant.stockQuantity} left in stock`
              : `${selectedVariant.stockQuantity} in stock`,
          count: selectedVariant.stockQuantity,
        };
      }
      return { inStock: false, text: 'Out of Stock', count: 0 };
    }
    // No size selected yet: don't reveal stock count until a size is chosen
    return { inStock: false, text: '', count: undefined };
  }, [variantsLoading, variantsError, hasVariants, selectedVariant]);

  // Quantity control bounds
  const maxStock = selectedVariant ? Math.max(1, selectedVariant.stockQuantity) : 1;

  const handleColourSelect = (col: string) => {
    setSelectedColour(col);
    setValidationError(null);
    // Reset selected size if not in stock for new colour
    const newColourVariants = validVariants.filter(
      (v) => v.colour?.trim().toLowerCase() === col.trim().toLowerCase()
    );
    const sizeStillAvailable = newColourVariants.some(
      (v) =>
        (v.size?.sizeValue.toString() === selectedSize ||
          `${v.size?.sizeRegion} ${v.size?.sizeValue}` === selectedSize) &&
        v.stockQuantity > 0
    );
    if (!sizeStillAvailable) {
      setSelectedSize('');
    }
  };

  const handleSizeSelect = (sizeLabel: string) => {
    setSelectedSize(sizeLabel);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCartClick = async () => {
    if (variantsLoading) return;

    if (variantsError) {
      setValidationError('Unable to add to cart: variant stock could not be verified from the server.');
      return;
    }

    if (!hasVariants) {
      setValidationError('This shoe currently has no available variants in stock.');
      return;
    }

    if (!selectedSize || !selectedVariant) {
      setValidationError('Please select an available size before adding to cart.');
      return;
    }

    if (selectedVariant.stockQuantity <= 0) {
      setValidationError('This variant is out of stock. Please select another size.');
      return;
    }

    setValidationError(null);
    const sizeToPass = `${selectedVariant.size.sizeRegion} ${selectedVariant.size.sizeValue}`;

    if (onAddToCart) {
      const result = await onAddToCart(sizeToPass, quantity, selectedVariant);
      if (result !== false) {
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 1800);
      }
    } else if (onProceedToCheckout) {
      onProceedToCheckout(sizeToPass, quantity, selectedVariant);
    }
  };

  const handleBuyNowClick = async () => {
    if (variantsLoading) return;

    if (variantsError) {
      setValidationError('Unable to proceed: variant stock could not be verified from the server.');
      return;
    }

    if (!hasVariants) {
      setValidationError('This shoe currently has no available variants in stock.');
      return;
    }

    if (!selectedSize || !selectedVariant) {
      setValidationError('Please select an available size before proceeding.');
      return;
    }

    if (selectedVariant.stockQuantity <= 0) {
      setValidationError('This variant is out of stock. Please select another size.');
      return;
    }

    setValidationError(null);
    const sizeToPass = `${selectedVariant.size.sizeRegion} ${selectedVariant.size.sizeValue}`;
    await onBuyItNow(sizeToPass, quantity, selectedVariant);
  };

  const isAddToCartDisabled =
    variantsLoading ||
    variantsError ||
    (!variantsLoading && !hasVariants) ||
    Boolean(selectedVariant && selectedVariant.stockQuantity <= 0);

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
        {product.isOnSale && product.salePrice ? (
          <div className="product-details-sale-pricing">
            <span className="product-info-price sale-price">{formatPrice(product.salePrice)}</span>
            <span className="product-info-price original-price">{formatPrice(product.price)}</span>
            {product.salePercentage && (
              <span className="product-sale-pill">
                Save {Math.round(product.salePercentage)}%
              </span>
            )}
          </div>
        ) : (
          <span className="product-info-price">{formatPrice(product.price)}</span>
        )}
        <span className="product-info-vat">Incl. VAT</span>
      </div>

      {/* COLOUR SPECIFICATION */}
      <div className="product-info-section colour-section">
        <div className="size-header-row">
          <span className="info-section-title">
            COLOUR: <strong className="highlight-text">{selectedColour || product.colour}</strong>
          </span>
          {availableColours.length > 1 && (
            <span className="colour-count-badge">
              {availableColours.length} Colours Available
            </span>
          )}
        </div>

        {availableColours.length > 1 ? (
          <div className="colour-options-grid" role="radiogroup" aria-label="Available Colours">
            {availableColours.map((col) => {
              const isSelected = selectedColour.toLowerCase() === col.toLowerCase();
              const hasStock = validVariants.some(
                (v) => v.colour?.toLowerCase() === col.toLowerCase() && v.stockQuantity > 0
              );
              return (
                <button
                  key={col}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={!hasStock}
                  className={`colour-pill-btn ${isSelected ? 'selected' : ''} ${
                    !hasStock ? 'out-of-stock' : ''
                  }`}
                  onClick={() => handleColourSelect(col)}
                  title={hasStock ? col : `${col} (Out of stock)`}
                >
                  <span className="colour-dot-indicator" />
                  <span>{col}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="colour-indicator-bar">
            <span className="colour-swatch" title={selectedColour || product.colour} />
            <span className="colour-desc-text">{selectedColour || product.colour}</span>
          </div>
        )}
      </div>

      {/* SIZE SELECTOR (REQUIRED) */}
      <div className={`product-info-section size-section ${validationError ? 'has-error' : ''}`}>
        <div className="size-header-row">
          <span className="info-section-title">
            SIZE ({sizeRegion}):{' '}
            {selectedSize ? (
              <strong className="highlight-text">{selectedSize}</strong>
            ) : (
              <span className="select-prompt-text">Select your size</span>
            )}
          </span>
          <span className="size-guide-text">True to size</span>
        </div>

        {/* 1. SKELETON LOADING STATE */}
        {variantsLoading && (
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={68}
                height={42}
                sx={{ borderRadius: '8px' }}
                animation="wave"
              />
            ))}
          </div>
        )}

        {/* 2. API ERROR STATE */}
        {!variantsLoading && variantsError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#DC2626',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.5rem 0',
            }}
            role="alert"
          >
            <AlertCircle size={16} />
            <span>Unable to retrieve live sizing and stock from server. Please refresh the page.</span>
          </div>
        )}

        {/* 3. NO VARIANTS EXIST STATE */}
        {!variantsLoading && !variantsError && !hasVariants && (
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
            No shoe size variants are currently registered or in stock for this shoe model.
          </div>
        )}

        {/* 4. VARIANTS LOADED SUCCESSFULLY */}
        {!variantsLoading && !variantsError && hasVariants && (
          <div className="product-size-grid" role="radiogroup" aria-label="Available Sizes">
            {sizeOptions.map((opt) => {
              const isSelected = selectedSize === opt.sizeLabel || selectedSize === opt.fullSize;
              const isOutOfStock = !opt.isAvailable;
              return (
                <button
                  key={opt.sizeLabel}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isOutOfStock}
                  className={`product-size-btn ${isSelected ? 'selected' : ''} ${
                    isOutOfStock ? 'out-of-stock' : ''
                  }`}
                  onClick={() => handleSizeSelect(opt.sizeLabel)}
                  title={
                    isOutOfStock
                      ? `Size ${opt.sizeLabel} is out of stock`
                      : `Size ${opt.sizeLabel} (${opt.stockQuantity} in stock)`
                  }
                >
                  {opt.sizeLabel}
                </button>
              );
            })}
          </div>
        )}

        {/* STOCK QUANTITY BADGE */}
        {!variantsLoading && stockInfo.text && (
          <div className="stock-status-row">
            <span
              className={`stock-indicator-badge ${
                !stockInfo.inStock
                  ? 'out-of-stock'
                  : stockInfo.count !== undefined && stockInfo.count <= 5
                  ? 'low-stock'
                  : 'in-stock'
              }`}
            >
              {stockInfo.text}
            </span>
            {selectedVariant && (
              <span className="variant-sku-tag">
                Variant ID: <strong>{selectedVariant.variantId}</strong>
              </span>
            )}
          </div>
        )}

        {/* VALIDATION ERROR MESSAGE */}
        {validationError && (
          <div className="size-validation-msg" role="alert">
            <AlertCircle size={15} />
            <span>{validationError}</span>
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
            disabled={quantity <= 1 || isAddToCartDisabled}
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
            disabled={quantity >= maxStock || isAddToCartDisabled}
            aria-label="Increase quantity"
            title={quantity >= maxStock ? 'Maximum available stock reached' : 'Increase Quantity'}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* ACTION BUTTONS: ADD TO CART & BUY IT NOW */}
      <div className="product-actions-group">
        <button
          type="button"
          className={`btn-proceed-checkout ${addedFeedback ? 'added' : ''}`}
          onClick={handleAddToCartClick}
          aria-label={addedFeedback ? 'Added to Cart' : 'Add to Cart'}
          disabled={isAddToCartDisabled}
        >
          {addedFeedback ? (
            <>
              <Check size={18} />
              <span>ADDED TO CART</span>
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              <span>ADD TO CART</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-buy-it-now"
          onClick={handleBuyNowClick}
          disabled={isAddToCartDisabled}
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
