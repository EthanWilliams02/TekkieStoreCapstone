import { Link } from 'react-router-dom';
import './TrendingSection.css';
import { ArrowRight } from 'lucide-react';
import { SHOES_DATA } from '../../data/products';
import { formatPrice } from '../../utils/formatters';
import airMax90 from '../../assets/Nike/Nike Air Max 90.jpg';
import mr530 from '../../assets/New Balance/MR530 White_Grey.jpg';
import vansOldSkool from '../../assets/Vans/Vans Old Skool Black_White.jpg';
import airMonarch from '../../assets/Nike/Nike Mens Air Monarch IV.jpg';

// Local image overrides for the 4 featured trending products (LCP-critical assets)
const TRENDING_IMAGES: Record<string, string> = {
  'nike-men-2': airMax90,
  'new-balance-unisex-11': mr530,
  'vans-men-1': vansOldSkool,
  'nike-men-5': airMonarch,
};

// Tags shown on the trending cards (editorial/marketing labels, not in product data)
const TRENDING_TAGS: Record<string, string> = {
  'nike-men-2': 'LIMITED',
  'new-balance-unisex-11': 'SELLING FAST',
  'vans-men-1': 'RESTOCKED',
  'nike-men-5': 'JUST DROPPED',
};

// The 4 products featured in the Trending section — sourced from SHOES_DATA
const TRENDING_IDS = ['nike-men-2', 'new-balance-unisex-11', 'vans-men-1', 'nike-men-5'];

export const TrendingSection = () => {
  const trendingProducts = TRENDING_IDS
    .map((id) => SHOES_DATA.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <section className="trending-section">
      <div className="trending-container">
        <div className="trending-header">
          <div className="trending-header-left">
            <h2 className="section-title">NOW TRENDING</h2>
            <p className="section-subtitle">The most hyped drops of the week.</p>
          </div>
          <Link to="/catalogue" className="view-all-link">
            Shop All <ArrowRight size={20} />
          </Link>
        </div>

        <div className="trending-grid">
          {trendingProducts.map((product) => {
            if (!product) return null;
            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-card"
              >
                <div className="product-image-container">
                  <span className="product-tag">{TRENDING_TAGS[product.id]}</span>
                  <img
                    src={TRENDING_IMAGES[product.id] ?? product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="quick-view-overlay">View Product</div>
                </div>
                <div className="product-info">
                  <span className="product-brand">{product.brand.toUpperCase()}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-price">{formatPrice(product.price)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};