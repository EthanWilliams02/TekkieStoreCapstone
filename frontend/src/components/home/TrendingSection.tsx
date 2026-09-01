import { Link } from 'react-router-dom';
import './TrendingSection.css';
import { ArrowRight } from 'lucide-react';
import airMax90 from '../../assets/Nike/Nike Air Max 90.jpg';
import mr530 from '../../assets/New Balance/MR530 White_Grey.jpg';
import vansOldSkool from '../../assets/Vans/Vans Old Skool Black_White.jpg';
import airMonarch from '../../assets/Nike/Nike Mens Air Monarch IV.jpg';

export const TrendingSection = () => {
  // IDs must match entries in SHOES_DATA (data/products.ts)
  const products = [
    {
      id: 'nike-men-2',
      name: 'Air Max 90',
      brand: 'NIKE',
      price: 'R3000',
      image: airMax90,
      tag: 'LIMITED',
    },
    {
      id: 'new-balance-unisex-11',
      name: 'MR530',
      brand: 'NEW BALANCE',
      price: 'R2200',
      image: mr530,
      tag: 'SELLING FAST',
    },
    {
      id: 'vans-men-1',
      name: 'Old Skool',
      brand: 'VANS',
      price: 'R1500',
      image: vansOldSkool,
      tag: 'RESTOCKED',
    },
    {
      id: 'nike-men-5',
      name: 'Air Monarch IV',
      brand: 'NIKE',
      price: 'R1800',
      image: airMonarch,
      tag: 'JUST DROPPED',
    },
  ];

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
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="product-card"
            >
              <div className="product-image-container">
                <span className="product-tag">{product.tag}</span>
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="quick-view-overlay">View Product</div>
              </div>
              <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <h3 className="product-name">{product.name}</h3>
                <span className="product-price">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};