import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { WishlistGrid } from '../components/Wishlist/WishlistGrid';
import { WishlistEmpty } from '../components/Wishlist/WishlistEmpty';
import '../components/catalogue/CataloguePage.css';

export const Wishlist: React.FC = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="catalogue-page">
      {/* WISHLIST HEADER SECTION */}
      <section className="catalogue-header-section">
        <div className="catalogue-container">
          <div className="catalogue-header-content">
            <span className="catalogue-eyebrow">Your Saved Pairs</span>
            <h1 className="catalogue-main-title">MY WISHLIST</h1>
            <p className="catalogue-header-subtitle">
              Manage your curated selection of favorite sneakers, ready for your next rotation.
            </p>
          </div>
        </div>
      </section>

      {/* WISHLIST BODY SECTION */}
      <section className="catalogue-body-section">
        <div className="catalogue-container">
          {wishlist.length === 0 ? (
            <WishlistEmpty />
          ) : (
            <WishlistGrid products={wishlist} />
          )}
        </div>
      </section>
    </div>
  );
};
