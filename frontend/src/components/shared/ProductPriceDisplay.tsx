import React from 'react';
import { ShoeProduct } from '../../types/catalogue';
import { formatPrice } from '../../utils/formatters';
import './ProductPriceDisplay.css';

interface ProductPriceDisplayProps {
  product: ShoeProduct;
  className?: string;
}

/**
 * Calculates the discount percentage safely using product.salePercentage or
 * derived from regular price and salePrice.
 */
export const getDiscountPercentage = (product: ShoeProduct): number => {
  if (product.salePercentage && product.salePercentage > 0) {
    return Math.round(product.salePercentage);
  }
  if (product.price && product.salePrice && product.price > product.salePrice) {
    return Math.round(((product.price - product.salePrice) / product.price) * 100);
  }
  return 0;
};

export const ProductPriceDisplay: React.FC<ProductPriceDisplayProps> = ({
  product,
  className = '',
}) => {
  const discount = getDiscountPercentage(product);
  const isOutOfStock = product.quantity === 0;

  if (product.isOnSale && product.salePrice) {
    return (
      <div className={`product-price-container ${className}`}>
        <div className="product-price-sale-row">
          <span className="product-price sale-price">{formatPrice(product.salePrice)}</span>
          <span className="product-price original-price">{formatPrice(product.price)}</span>
          {discount > 0 && (
            <span className="sale-discount-percentage">{discount}% OFF</span>
          )}
          {isOutOfStock && <span className="out-of-stock-badge">OUT OF STOCK</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`product-price-container ${className}`}>
      <div className="product-price-regular-row">
        <span className="product-price">{formatPrice(product.price)}</span>
        {isOutOfStock && <span className="out-of-stock-badge">OUT OF STOCK</span>}
      </div>
    </div>
  );
};
