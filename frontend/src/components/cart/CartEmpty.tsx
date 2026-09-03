import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import './CartEmpty.css';

export const CartEmpty: React.FC = () => {
  return (
    <div className="cart-empty-container">
      <div className="cart-empty-card">
        <div className="cart-empty-icon-wrapper">
          <ShoppingBag size={48} strokeWidth={1.5} className="cart-empty-icon" />
        </div>
        <h2 className="cart-empty-title">YOUR SHOPPING CART IS EMPTY</h2>
        <p className="cart-empty-subtitle">
          Looks like you haven't added any pairs to your rotation yet. Explore our latest drops, classic vaults, and exclusive sneaker silhouettes.
        </p>
        <Link to="/catalogue" className="cart-empty-btn">
          <span>CONTINUE SHOPPING</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
