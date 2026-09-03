import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import './CartItemCard.css';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemove: (cartId: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, size, quantity, cartId } = item;
  const lineTotal = product.price * quantity;

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(cartId, quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(cartId, quantity + 1);
  };

  return (
    <div className="cart-item-card" data-cart-id={cartId}>
      {/* THUMBNAIL */}
      <div className="cart-item-thumb-wrapper">
        {product.tag && (
          <span className={`cart-item-tag ${product.tag === 'JUST DROPPED' ? 'tag-orange' : ''}`}>
            {product.tag}
          </span>
        )}
        <Link to={`/product/${product.id}`} className="cart-item-image-link" tabIndex={-1}>
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            className="cart-item-image"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/trending_shoe_1_1788049696433.jpg';
            }}
          />
        </Link>
      </div>

      {/* INFO SECTION */}
      <div className="cart-item-info">
        <div className="cart-item-meta-row">
          <span className="cart-item-brand">{product.brand}</span>
          <span className="cart-item-category-pill">{product.category}</span>
        </div>

        <h3 className="cart-item-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <p className="cart-item-colour">{product.colour}</p>

        <div className="cart-item-specs">
          <span className="cart-spec-pill">
            Size: <strong>{size}</strong>
          </span>
          <span className="cart-spec-pill stock-pill">In Stock</span>
        </div>
      </div>

      {/* QUANTITY CONTROLS */}
      <div className="cart-item-qty-section">
        <span className="qty-label">Quantity</span>
        <div className="cart-qty-control" role="group" aria-label={`Quantity for ${product.name}`}>
          <button
            type="button"
            className="cart-qty-btn"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            title={quantity <= 1 ? 'Minimum quantity is 1' : 'Decrease quantity'}
          >
            <Minus size={14} />
          </button>
          <span className="cart-qty-display" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="cart-qty-btn"
            onClick={handleIncrease}
            aria-label="Increase quantity"
            title="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* PRICE & REMOVE */}
      <div className="cart-item-price-actions">
        <div className="cart-price-col">
          <span className="cart-line-total">{formatPrice(lineTotal)}</span>
          {quantity > 1 && (
            <span className="cart-unit-price">{formatPrice(product.price)} each</span>
          )}
        </div>

        <button
          type="button"
          className="cart-item-remove-btn"
          onClick={() => onRemove(cartId)}
          aria-label={`Remove ${product.name} (${size}) from cart`}
          title="Remove item"
        >
          <Trash2 size={18} />
          <span className="remove-text-label">Remove</span>
        </button>
      </div>
    </div>
  );
};
