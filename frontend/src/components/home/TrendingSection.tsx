import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TrendingSection.css';
import { ArrowRight } from 'lucide-react';
import { fetchAllShoes } from '../../services/shoeService';
import { ShoeProduct } from '../../types/catalogue';
import { formatPrice } from '../../utils/formatters';

// Editorial marketing tags for the featured trending shoes
const TRENDING_TAGS: Record<string, string> = {
  'ADI-007': 'SELLING FAST',
  'NIKE-001': 'LIMITED',
  'PUM-011': 'RESTOCKED',
  'NIKE-016': 'JUST DROPPED',
};

// Target shoe IDs from MySQL database: Samba OG, Air Max 90, Puma Suede Classic, P-6000 Metallic
const FEATURED_TRENDING_IDS = ['ADI-007', 'NIKE-001', 'PUM-011', 'NIKE-016'];

export const TrendingSection = () => {
  const [trendingProducts, setTrendingProducts] = useState<ShoeProduct[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchAllShoes().then((shoes) => {
      if (!isMounted) return;

      if (shoes && shoes.length > 0) {
        // Pick the 4 featured shoes, or fallback to first 4 real shoes
        const selected = FEATURED_TRENDING_IDS
          .map((id) => shoes.find((p) => p.id === id))
          .filter(Boolean) as ShoeProduct[];

        if (selected.length >= 4) {
          setTrendingProducts(selected);
        } else {
          setTrendingProducts(shoes.slice(0, 4));
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (trendingProducts.length === 0) {
    return null;
  }

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
            const tag = TRENDING_TAGS[product.id] || 'HOT';
            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-card"
              >
                <div className="product-image-container">
                  <span className="product-tag">{tag}</span>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
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