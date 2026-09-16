import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoeProduct } from '../../../types/catalogue';
import { CatalogueProductCard } from '../../catalogue/CatalogueProductCard';
import './TopProducts.css';

interface TopProductsProps {
  products: ShoeProduct[];
  loading?: boolean;
}

export const TopProducts: React.FC<TopProductsProps> = ({ products, loading = false }) => {
  const navigate = useNavigate();

  // Take top 3 shoes
  const topList = products.slice(0, 3);

  const handleProductClick = (product: ShoeProduct) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="dashboard-card top-products-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">Top Products</h2>
          <p className="card-subtitle">Highest volume sneaker styles this month</p>
        </div>
      </div>

      <div className="admin-top-products-grid">
        {loading ? (
          <div className="admin-loading-state">Loading top products...</div>
        ) : topList.length > 0 ? (
          topList.map((prod) => (
            <div key={prod.id} className="admin-product-card-wrapper">
              {/* REUSING THE EXISTING CATALOGUE PRODUCT CARD */}
              <CatalogueProductCard
                product={prod}
                onClick={handleProductClick}
              />
            </div>
          ))
        ) : (
          <p className="text-muted">No top products found.</p>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
