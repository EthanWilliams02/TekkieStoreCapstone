import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { ShoeProduct } from '../../types/catalogue';
import { ShoeVariant } from '../../types/shoeVariant';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { ProductPriceDisplay } from '../shared/ProductPriceDisplay';
import { SizeSelector } from '../shared/SizeSelector';
import { ProductImage } from '../shared/ProductImage';
import './CatalogueProductCard.css';

interface CatalogueProductCardProps {
  product: ShoeProduct;
  onQuickAdd?: (product: ShoeProduct) => void | boolean | Promise<void | boolean>;
  onClick?: (product: ShoeProduct) => void;
}

export const CatalogueProductCard: React.FC<CatalogueProductCardProps> = ({
  product,
  onClick,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectorOpen(true);
  };

  const handleSizeSelected = async (size: string, variant?: ShoeVariant): Promise<boolean> => {
    const result = await addToCart(product, size, 1, variant);
    if (result !== false) {
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1500);
      return true;
    }
    return false;
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <>
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
          {product.isOnSale ? (
            <span className="product-tag tag-sale">SALE</span>
          ) : product.tag ? (
            <span className={`product-tag ${product.tag === 'JUST DROPPED' ? 'tag-orange' : ''}`}>
              {product.tag}
            </span>
          ) : null}

          {/* Wishlist Button - Directly toggles wishlist without size selection */}
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
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
          <ProductImage
            src={product.image}
            alt={`${product.brand} ${product.name} in ${product.colour}`}
            className="product-image"
            loading="lazy"
          />

          {/* Cart Plus Action Button */}
          <button
            className={`card-cart-btn ${addedFeedback ? 'added' : ''}`}
            onClick={handlePlusClick}
            aria-label={`Add ${product.name} to cart`}
            title={`Add ${product.name} to cart`}
            type="button"
          >
            {addedFeedback ? (
              <Check size={18} className="cart-btn-icon" />
            ) : (
              <Plus size={18} className="cart-btn-icon" />
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
          <ProductPriceDisplay product={product} />
        </div>
      </div>

      {/* REUSABLE SIZE SELECTOR MODAL FOR CART */}
      <SizeSelector
        product={product}
        actionType="cart"
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSizeSelected={handleSizeSelected}
      />
    </>
  );
};
