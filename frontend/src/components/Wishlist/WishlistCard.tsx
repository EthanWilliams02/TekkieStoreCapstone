import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { ShoeProduct } from '../../types/catalogue';
import { ShoeVariant } from '../../types/shoeVariant';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { ProductPriceDisplay } from '../shared/ProductPriceDisplay';
import { SizeSelector } from '../shared/SizeSelector';
import { ProductImage } from '../shared/ProductImage';
import './WishlistCard.css';

interface WishlistCardProps {
  product: ShoeProduct;
  onClick?: (product: ShoeProduct) => void;
  onQuickAdd?: (product: ShoeProduct) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  product,
  onClick,
}) => {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [addedFeedback, setAddedFeedback] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Heart button on Wishlist card removes the shoe from the Wishlist
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWishlist(product.id);
  };

  // Cart + button opens the size selector modal to choose size before adding to cart
  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectorOpen(true);
  };

  // When size is chosen, add to cart with real size and variant; product stays in Wishlist
  const handleSizeSelected = async (selectedSize: string, selectedVariant?: ShoeVariant): Promise<boolean> => {
    const result = await addToCart(product, selectedSize, 1, selectedVariant);
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
        className="wishlist-product-card"
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
        <div className="wishlist-card-image-container">
          {/* Product Tag / Badge: SALE or custom tag in unified orange style */}
          {product.isOnSale ? (
            <span className="wishlist-card-tag tag-orange">SALE</span>
          ) : product.tag ? (
            <span className={`wishlist-card-tag ${product.tag === 'JUST DROPPED' ? 'tag-orange' : ''}`}>
              {product.tag}
            </span>
          ) : null}

          {/* Wishlist Active Heart Button - Removes item from wishlist on click */}
          <button
            className="wishlist-card-heart-btn active"
            onClick={handleRemove}
            aria-label={`Remove ${product.name} from wishlist`}
            title="Remove from wishlist"
            type="button"
          >
            <Heart
              size={18}
              className="wishlist-card-heart-icon"
              fill="var(--brand-orange)"
              color="var(--brand-orange)"
            />
          </button>

          {/* Product Image */}
          <ProductImage
            src={product.image}
            alt={`${product.brand} ${product.name} in ${product.colour}`}
            className="wishlist-card-image"
            loading="lazy"
          />

          {/* Cart Plus Action Button - Opens size selector */}
          <button
            className={`wishlist-card-cart-btn ${addedFeedback ? 'added' : ''}`}
            onClick={handlePlusClick}
            aria-label={`Add ${product.name} to cart`}
            title={`Add ${product.name} to cart`}
            type="button"
          >
            {addedFeedback ? (
              <Check size={18} className="wishlist-cart-btn-icon" />
            ) : (
              <Plus size={18} className="wishlist-cart-btn-icon" />
            )}
          </button>
        </div>

        <div className="wishlist-card-info">
          <div className="wishlist-card-meta-row">
            <span className="wishlist-card-brand">{product.brand}</span>
            <span className="wishlist-card-category-pill">{product.category}</span>
          </div>
          <h3 className="wishlist-card-name">{product.name}</h3>
          <p className="wishlist-card-colour-text">{product.colour}</p>
          <ProductPriceDisplay product={product} />
        </div>
      </div>

      {/* REUSABLE SIZE SELECTOR MODAL FOR ADDING TO CART */}
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
