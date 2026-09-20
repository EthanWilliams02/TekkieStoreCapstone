import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import { ShoeProduct } from '../../types/catalogue';
import { ShoeVariant } from '../../types/shoeVariant';
import { shoeVariantService } from '../../services/shoeVariantService';
import { ProductPriceDisplay } from './ProductPriceDisplay';
import { ProductImage } from './ProductImage';
import './SizeSelector.css';

export interface SizeOption {
  sizeLabel: string;
  fullSize: string;
  sizeValue?: number;
  sizeRegion?: string;
  stockQuantity: number;
  isAvailable: boolean;
  variant?: ShoeVariant;
}

interface SizeSelectorProps {
  product: ShoeProduct;
  variants?: ShoeVariant[];
  actionType?: 'cart' | 'wishlist';
  isOpen: boolean;
  onClose: () => void;
  onSizeSelected: (size: string, variant?: ShoeVariant) => void | Promise<void | boolean>;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  product,
  variants: initialVariants,
  isOpen,
  onClose,
  onSizeSelected,
}) => {
  const [variants, setVariants] = useState<ShoeVariant[]>(initialVariants || []);
  const [loading, setLoading] = useState<boolean>(!initialVariants || initialVariants.length === 0);
  const [error, setError] = useState<boolean>(false);
  const [submittingSize, setSubmittingSize] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Load variants on open if not provided
  useEffect(() => {
    if (!isOpen) {
      setSubmittingSize(null);
      setSuccessFeedback(null);
      return;
    }

    if (initialVariants && initialVariants.length > 0) {
      setVariants(initialVariants);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(false);

    shoeVariantService
      .getVariantsByShoeId(product.id)
      .then((data) => {
        if (isMounted) {
          setVariants(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn(`[SizeSelector] Failed to fetch variants for shoe ${product.id}:`, err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, product.id, initialVariants]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Extract valid size options from variants or fallback to product.sizes
  const sizeOptions: SizeOption[] = useMemo(() => {
    const validVariants = (variants || []).filter(
      (v) =>
        v &&
        typeof v === 'object' &&
        v.variantId &&
        v.size &&
        typeof v.size.sizeValue !== 'undefined'
    );

    if (validVariants.length > 0) {
      // Sort numerically by sizeValue
      const sorted = [...validVariants].sort((a, b) => a.size.sizeValue - b.size.sizeValue);

      return sorted.map((v) => {
        const region = v.size.sizeRegion || 'UK';
        const formatted = `${region} ${v.size.sizeValue}`;
        return {
          sizeLabel: formatted,
          fullSize: formatted,
          sizeValue: v.size.sizeValue,
          sizeRegion: region,
          stockQuantity: v.stockQuantity,
          isAvailable: v.stockQuantity > 0,
          variant: v,
        };
      });
    }

    // Fallback to static product.sizes if no variants returned or on error
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.map((sz) => ({
        sizeLabel: sz.startsWith('UK') ? sz : `UK ${sz}`,
        fullSize: sz.startsWith('UK') ? sz : `UK ${sz}`,
        stockQuantity: 10,
        isAvailable: true,
      }));
    }

    return [];
  }, [variants, product.sizes]);

  if (!isOpen) return null;

  const handleSizeClick = async (option: SizeOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!option.isAvailable || submittingSize) return;

    setSubmittingSize(option.fullSize);

    try {
      const result = await onSizeSelected(option.fullSize, option.variant);
      if (result !== false) {
        setSuccessFeedback(option.fullSize);
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setSubmittingSize(null);
      }
    } catch (err) {
      console.error('[SizeSelector] Error during size selection:', err);
      setSubmittingSize(null);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="size-selector-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`size-selector-title-${product.id}`}
    >
      <div className="size-selector-modal" onClick={handleModalClick}>
        {/* HEADER */}
        <div className="size-selector-header">
          <div className="size-selector-product-preview">
            <ProductImage src={product.image} alt={product.name} className="size-selector-thumb" />
            <div className="size-selector-product-info">
              <span className="size-selector-brand">{product.brand}</span>
              <h4 className="size-selector-name">{product.name}</h4>
              <ProductPriceDisplay product={product} className="size-selector-pricing" />
            </div>
          </div>
          <button
            type="button"
            className="size-selector-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close size selector"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ACTION TITLE */}
        <div className="size-selector-action-title">
          <ShoppingBag size={15} />
          <span id={`size-selector-title-${product.id}`}>SELECT A SIZE</span>
        </div>

        {/* BODY */}
        <div className="size-selector-body">
          {loading ? (
            <div className="size-selector-loading">
              <Loader2 className="size-selector-spinner" size={24} />
              <span>Checking available sizes...</span>
            </div>
          ) : error && sizeOptions.length === 0 ? (
            <div className="size-selector-error">
              <AlertCircle size={20} />
              <span>Unable to retrieve live sizing. Please try again or view product details.</span>
            </div>
          ) : sizeOptions.length === 0 ? (
            <div className="size-selector-empty">
              <span>No sizes are currently available for this sneaker.</span>
            </div>
          ) : (
            <div className="size-selector-grid" role="group" aria-label="Available Sizes">
              {sizeOptions.map((option) => {
                const isSelected = submittingSize === option.fullSize;
                const isSuccess = successFeedback === option.fullSize;
                return (
                  <button
                    key={option.fullSize}
                    type="button"
                    disabled={!option.isAvailable || (submittingSize !== null && !isSelected)}
                    className={`size-selector-btn ${!option.isAvailable ? 'out-of-stock' : ''} ${
                      isSelected ? 'selecting' : ''
                    } ${isSuccess ? 'success' : ''}`}
                    onClick={(e) => handleSizeClick(option, e)}
                    aria-label={
                      option.isAvailable
                        ? `Select size ${option.fullSize}`
                        : `Size ${option.fullSize} out of stock`
                    }
                  >
                    {isSuccess ? (
                      <span className="size-btn-feedback">
                        <Check size={14} /> Added
                      </span>
                    ) : isSelected ? (
                      <Loader2 className="size-selector-spinner-sm" size={14} />
                    ) : (
                      <span className="size-label-text">{option.sizeLabel}</span>
                    )}

                    {option.isAvailable && option.stockQuantity <= 3 && !isSelected && !isSuccess && (
                      <span className="size-stock-hint">{option.stockQuantity} left</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="size-selector-footer">
          <span className="size-selector-hint">
            True to size. Click any available size to add to your bag.
          </span>
        </div>
      </div>
    </div>
  );
};
