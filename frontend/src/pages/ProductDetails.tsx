import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, SearchX, Sparkles } from 'lucide-react';
import { SHOES_DATA } from '../data/products';
import { ShoeProduct } from '../types/catalogue';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductInfo } from '../components/product/ProductInfo';
import { CatalogueProductCard } from '../components/catalogue/CatalogueProductCard';
import '../components/product/ProductDetails.css';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Find product by id from the single source of truth
  const product: ShoeProduct | undefined = SHOES_DATA.find((p) => p.id === id);

  // Suggested products from the same brand or category
  const relatedProducts = React.useMemo(() => {
    if (!product) return [];
    return SHOES_DATA
      .filter((p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category))
      .slice(0, 3);
  }, [product]);

  // Handle Product Not Found
  if (!product) {
    return (
      <div className="product-not-found-page">
        <div className="product-details-container">
          <div className="not-found-card">
            <div className="not-found-icon-circle">
              <SearchX size={48} strokeWidth={1.5} />
            </div>
            <h1 className="not-found-title">PRODUCT NOT FOUND</h1>
            <p className="not-found-text">
              The shoe you're looking for (ID: <code className="missing-id">{id}</code>) could not be found in our collection.
            </p>
            <Link to="/catalogue" className="btn-back-catalogue">
              <ArrowLeft size={18} />
              <span>BACK TO CATALOGUE</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const handleAddToCart = (size: string, quantity: number) => {
    addToCart(product, size, quantity);
    // Stays on page, does not navigate
  };

  const handleBuyItNow = (size: string, quantity: number) => {
    addToCart(product, size, quantity);
    navigate('/cart');
  };

  const handleBackNavigation = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/catalogue');
    }
  };

  return (
    <div className="product-details-page">
      {/* BREADCRUMB & BACK NAVIGATION BAR */}
      <div className="details-breadcrumb-bar">
        <div className="product-details-container">
          <div className="breadcrumb-row">
            <button
              type="button"
              className="back-btn-link"
              onClick={handleBackNavigation}
              aria-label="Back to previous page"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <span className="breadcrumb-divider">/</span>

            <nav className="product-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/catalogue">Catalogue</Link>
              <span className="breadcrumb-divider">/</span>
              <Link to={`/catalogue?brand=${encodeURIComponent(product.brand)}`}>{product.brand}</Link>
              <span className="breadcrumb-divider">/</span>
              <span className="breadcrumb-current">{product.name}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN PRODUCT HERO SECTION */}
      <main className="product-details-main">
        <div className="product-details-container">
          <div className="product-details-grid">
            {/* LEFT COLUMN: 3-VIEW IMAGE GALLERY */}
            <div className="product-gallery-col">
              <ProductGallery
                product={product}
                selectedImageIndex={selectedImageIndex}
                onSelectImage={setSelectedImageIndex}
                isWishlisted={isWishlisted}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>

            {/* RIGHT COLUMN: INFORMATION & PURCHASE CONTROLS */}
            <div className="product-info-col">
              <ProductInfo
                product={product}
                onAddToCart={handleAddToCart}
                onBuyItNow={handleBuyItNow}
              />
            </div>
          </div>
        </div>
      </main>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="product-details-container">
            <div className="related-header">
              <div className="related-header-left">
                <span className="related-eyebrow">
                  <Sparkles size={14} /> You May Also Like
                </span>
                <h2 className="related-title">MORE FROM {product.brand.toUpperCase()}</h2>
              </div>
              <Link to="/catalogue" className="view-more-link">
                View Full Vault →
              </Link>
            </div>

            <div className="related-grid">
              {relatedProducts.map((relProduct) => (
                <CatalogueProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onClick={() => navigate(`/product/${relProduct.id}`)}
                  onQuickAdd={(item) => addToCart(item)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
