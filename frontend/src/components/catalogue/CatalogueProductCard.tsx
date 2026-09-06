import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { ShoeProduct } from '../../types/catalogue';
import { formatPrice } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';
import './CatalogueProductCard.css';

interface CatalogueProductCardProps {
  product: ShoeProduct;
  onQuickAdd?: (product: ShoeProduct) => void | boolean | Promise<void | boolean>;
  onClick?: (product: ShoeProduct) => void;
}

export const CatalogueProductCard: React.FC<CatalogueProductCardProps> = ({
  product,
  onQuickAdd,
  onClick,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAdd) {
      const result = await onQuickAdd(product);
      if (result !== false) {
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 1500);
      }
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div 
      className="catalogue-product-card" 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View details for ${product.brand} ${product.name}`}
    >
      <div className="product-image-container">
        {/* Product Tag / Badge */}
        {product.tag && (
          <span className={`product-tag ${product.isOnSale ? 'tag-sale' : product.tag === 'JUST DROPPED' ? 'tag-orange' : ''}`}>
            {product.tag}
          </span>
        )}

        {/* Wishlist Button */}
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          type="button"
        >
          <Heart 
            size={18} 
            className="wishlist-icon" 
            fill={isWishlisted ? 'var(--brand-orange)' : 'none'} 
            color={isWishlisted ? 'var(--brand-orange)' : 'var(--obsidian)'}
          />
        </button>

        {/* Product Image */}
        <img 
          src={product.image} 
          alt={`${product.brand} ${product.name} in ${product.colour}`} 
          className="product-image" 
          loading="lazy"
          onError={(e) => {
            // Clean fallback in case of loading anomaly
            (e.target as HTMLImageElement).src = '/trending_shoe_1_1788049696433.jpg';
          }}
        />

        {/* Quick Add Button */}
        <button 
          className={`add-to-cart-btn ${addedFeedback ? 'added' : ''}`}
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name} to cart`}
          type="button"
        >
          {addedFeedback ? (
            <span className="btn-feedback-content">
              <Check size={16} /> Added
            </span>
          ) : (
            'Quick Add'
          )}
        </button>
      </div>

      <div className="product-info">
        <div className="product-meta-row">
          <span className="product-brand">{product.brand}</span>
          <span className="product-category-pill">{product.category}</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-colour-text">{product.colour}</p>
        <div className="product-price-container">
          {product.isOnSale && product.salePrice ? (
            <div className="product-price-sale-row">
              <span className="product-price sale-price">{formatPrice(product.salePrice)}</span>
              <span className="product-price original-price">{formatPrice(product.price)}</span>
            </div>
          ) : (
            <span className="product-price">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};
