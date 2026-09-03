import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItemCard } from '../components/cart/CartItemCard';
import { OrderSummary } from '../components/cart/OrderSummary';
import { CartEmpty } from '../components/cart/CartEmpty';
import '../components/cart/CartPage.css';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal } = useCart();

  return (
    <div className="cart-page">
      {/* OBSIDIAN HEADER SECTION */}
      <section className="cart-header-section">
        <div className="cart-container">
          <div className="cart-header-content">
            <span className="cart-eyebrow">Shopping Bag</span>
            <h1 className="cart-main-title">SHOPPING CART</h1>
            <p className="cart-header-subtitle">
              Review your curated footwear rotation, adjust sizes and quantities, and prepare for dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* BREADCRUMB BAR */}
      <div className="cart-container">
        <div className="cart-breadcrumb-bar">
          <nav className="cart-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="cart-breadcrumb-separator">/</span>
            <Link to="/catalogue">Catalogue</Link>
            <span className="cart-breadcrumb-separator">/</span>
            <span className="cart-breadcrumb-current">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {/* MAIN BODY SECTION */}
      <main className="cart-body-section">
        <div className="cart-container">
          {cart.length === 0 ? (
            <CartEmpty />
          ) : (
            <div className="cart-layout-grid">
              {/* LEFT: CART ITEMS LIST */}
              <div className="cart-items-section">
                <div className="cart-items-toolbar">
                  <span className="cart-items-count-text">
                    Showing <strong>{cartCount}</strong> {cartCount === 1 ? 'item' : 'items'} in your cart
                  </span>
                  <button
                    type="button"
                    className="cart-clear-btn"
                    onClick={clearCart}
                    aria-label="Clear all items from shopping cart"
                    title="Clear Cart"
                  >
                    <Trash2 size={15} />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="cart-items-list" role="list" aria-label="Cart items">
                  {cart.map((item) => (
                    <CartItemCard
                      key={item.cartId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT: ORDER SUMMARY */}
              <OrderSummary subtotal={cartTotal} itemCount={cartCount} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
