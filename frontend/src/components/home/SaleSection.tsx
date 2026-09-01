import { Link } from 'react-router-dom';
import './SaleSection.css';

export const SaleSection = () => {
  return (
    <section className="sale-section">
      <div className="sale-container">
        <div className="sale-content">
          <div className="sale-text-content">
            <h2 className="sale-title">STEP INTO THE SALE</h2>
            <h3 className="sale-subtitle">
              THE OBSIDIAN COLLECTION <br />
              <span className="highlight">20% OFF</span>
            </h3>
            <p className="sale-description">
              Use code <strong className="sale-promo-code">TEKKIE20</strong> at checkout. Limited time only.
            </p>
            <Link to="/catalogue" className="sale-button">
              Explore Catalogue
            </Link>
          </div>
          <div className="sale-image-container">
            <img
              src="/category_sneakers_1788049733131.jpg"
              alt="Orange Nike Shoe"
              className="sale-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
