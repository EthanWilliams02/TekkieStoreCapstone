import { Link, useNavigate } from 'react-router-dom';
import './TrendingSection.css';
import { ArrowRight } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';
import { useShoes } from '../../hooks/useShoes';
import { ShoeProduct } from '../../types/catalogue';
import { CatalogueProductCard } from '../catalogue/CatalogueProductCard';

// Editorial marketing tags for the featured trending shoes
const TRENDING_TAGS: Record<string, string> = {
  "ADI-007": "SELLING FAST",
  "NIKE-001": "LIMITED",
  "PUM-011": "RESTOCKED",
  "NIKE-016": "JUST DROPPED",
};

// Target shoe IDs from the MySQL database to feature in this section.
// To update the trending products, modify this array with the new IDs.
const FEATURED_TRENDING_IDS = ["ADI-007", "NIKE-001", "PUM-011", "NIKE-016"];

// Homepage section displaying featured trending sneakers
export const TrendingSection = () => {
  const navigate = useNavigate();
  // Retrieve cached shoe data from the global state to minimize backend requests
  const { shoes, loading } = useShoes();

  // Filter the full shoe catalogue to match the specified featured IDs, maintaining order
  const selected = FEATURED_TRENDING_IDS
    .map((id) => shoes.find((p) => p.id === id))
    .filter(Boolean) as ShoeProduct[];

  // Fallback to the first 4 items in the catalogue if specific IDs are not found
  const trendingProducts = selected.length > 0 ? selected : shoes.slice(0, 4);

  const handleProductCardClick = (product: ShoeProduct) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="trending-section">
      <div className="trending-container">
        <div className="trending-header">
          <div className="trending-header-left">
            <h2 className="section-title">NOW TRENDING</h2>
            <p className="section-subtitle">
              The most hyped drops of the week.
            </p>
          </div>
          <Link to="/catalogue" className="view-all-link">
            Shop All <ArrowRight size={20} />
          </Link>
        </div>

        <div className="trending-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="product-card" aria-hidden="true">
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={300}
                    animation="wave"
                    sx={{ borderRadius: "12px", mb: 2 }}
                  />
                  <div className="product-info">
                    <Skeleton
                      variant="text"
                      width="35%"
                      height={16}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width="75%"
                      height={24}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={20}
                      animation="wave"
                    />
                  </div>
                </div>
              ))
            : trendingProducts.length > 0 ? (
            trendingProducts.map((product) => {
              // Inject the custom editorial trending tag into the product before rendering
              const productWithCustomTag = {
                ...product,
                tag: TRENDING_TAGS[product.id] || product.tag,
              };

              return (
                <CatalogueProductCard
                  key={product.id}
                  product={productWithCustomTag}
                  onClick={handleProductCardClick}
                />
              );
            })
          ) : null}
        </div>
      </div>
    </section>
  );
};
