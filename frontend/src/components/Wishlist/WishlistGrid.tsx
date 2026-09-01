import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { ShoeProduct } from '../../types/catalogue';
import { WishlistCard } from './WishlistCard';
import { useWishlist } from '../../context/WishlistContext';
import './WishlistGrid.css';

interface WishlistGridProps {
  products: ShoeProduct[];
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({ products }) => {
  const { clearWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="wishlist-grid-section">
      <div className="wishlist-grid-toolbar">
        <span className="wishlist-grid-count">
          Showing <strong>{products.length}</strong> {products.length === 1 ? 'item' : 'items'}
        </span>
        <button
          type="button"
          className="wishlist-clear-all-btn"
          onClick={clearWishlist}
          title="Clear all items from wishlist"
          aria-label="Clear all items from wishlist"
        >
          <Trash2 size={16} />
          <span>Clear Wishlist</span>
        </button>
      </div>

      <div className="wishlist-products-grid">
        {products.map((product) => (
          <WishlistCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
};
