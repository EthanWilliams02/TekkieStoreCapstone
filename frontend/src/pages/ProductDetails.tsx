import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, SearchX, Sparkles } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';
import { fetchShoeById } from '../services/shoeService';
import { useShoes } from '../hooks/useShoes';
import { shoeVariantService, ShoeVariant } from '../services/shoeVariantService';
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

  // Active shoe being viewed
  const [product, setProduct] = useState<ShoeProduct | undefined>(undefined);
  // Real backend variants belonging to this shoe
  const [variants, setVariants] = useState<ShoeVariant[]>([]);
  // Variants loading state
  const [variantsLoading, setVariantsLoading] = useState<boolean>(true);
  // Variants fetch error state
  const [variantsError, setVariantsError] = useState<boolean>(false);
  // Full shoe list for recommendations
  const { shoes: allProducts } = useShoes();
  // Selected image thumbnail index in the gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  // Loading state while fetching from cloud database
  const [loading, setLoading] = useState<boolean>(true);

  // Load the selected shoe, catalogue, and variants when URL ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setLoading(true);
    setVariantsLoading(true);
    setVariantsError(false);
    let isMounted = true;

    // GET single shoe by ID from backend
    if (id) {
      fetchShoeById(id)
        .then((p) => {
          if (isMounted) {
            setProduct(p);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });

      // GET only the variants that belong to this specific shoe
      shoeVariantService
        .getVariantsByShoeId(id)
        .then((fetchedVariants) => {
          if (isMounted) {
            setVariants(fetchedVariants);
            setVariantsLoading(false);
          }
        })
        .catch((err) => {
          console.warn('[ProductDetails] Failed to load variants from backend API:', err);
          if (isMounted) {
            setVariants([]);
            setVariantsError(true);
            setVariantsLoading(false);
          }
        });
    } else {
      setLoading(false);
      setVariantsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Pick 4 random shoes from the same brand only
  const [relatedProducts, setRelatedProducts] = useState<ShoeProduct[]>([]);

  useEffect(() => {
    if (!product) {
      setRelatedProducts([]);
      return;
    }
    const sameBrand = allProducts.filter((p) => p.id !== product.id && p.brand === product.brand);
    setRelatedProducts([...sameBrand].sort(() => Math.random() - 0.5).slice(0, 4));
  }, [product, allProducts]);

  // Handle Loading Skeleton State while communicating with cloud DB
  if (loading) {
    return (
      <div className="product-details-page" aria-busy="true" aria-label="Loading product details">
        <div className="details-breadcrumb-bar">
          <div className="product-details-container">
            <div className="breadcrumb-row">
              <Skeleton variant="text" width={180} height={20} animation="wave" />
            </div>
          </div>
        </div>

        <main className="product-details-main">
          <div className="product-details-container">
            <div className="product-details-grid">
              {/* SKELETON GALLERY */}
              <div className="product-gallery-col">
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={500}
                  animation="wave"
                  sx={{ borderRadius: '16px', mb: 2.5 }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Skeleton variant="rounded" width={85} height={85} animation="wave" sx={{ borderRadius: '10px' }} />
                  <Skeleton variant="rounded" width={85} height={85} animation="wave" sx={{ borderRadius: '10px' }} />
                  <Skeleton variant="rounded" width={85} height={85} animation="wave" sx={{ borderRadius: '10px' }} />
                </div>
              </div>

              {/* SKELETON INFO */}
              <div className="product-info-col">
                <Skeleton variant="text" width="25%" height={18} animation="wave" sx={{ mb: 1.5 }} />
                <Skeleton variant="text" width="85%" height={42} animation="wave" sx={{ mb: 1.5 }} />
                <Skeleton variant="text" width="35%" height={32} animation="wave" sx={{ mb: 3 }} />
                <Skeleton variant="rounded" width="100%" height={70} animation="wave" sx={{ borderRadius: '8px', mb: 3 }} />
                <Skeleton variant="rounded" width="100%" height={48} animation="wave" sx={{ borderRadius: '8px', mb: 2 }} />
                <Skeleton variant="rounded" width="100%" height={52} animation="wave" sx={{ borderRadius: '8px' }} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

  const handleAddToCart = async (size: string, quantity: number, variant?: ShoeVariant) => {
    return await addToCart(product, size, quantity, variant);
  };

  const handleBuyItNow = async (size: string, quantity: number, variant?: ShoeVariant) => {
    const success = await addToCart(product, size, quantity, variant);
    if (success) {
      navigate('/cart');
    }
    return success;
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
                variants={variants}
                variantsLoading={variantsLoading}
                variantsError={variantsError}
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
