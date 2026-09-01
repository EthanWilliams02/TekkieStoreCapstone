import { Link } from 'react-router-dom';
import './BrandsSection.css';

export const BrandsSection = () => {
  const brands = [
    { name: 'Nike',        displayName: 'NIKE',        src: '/nike.svg' },
    { name: 'adidas',      displayName: 'ADIDAS',      src: '/adidas.svg' },
    { name: 'Vans',        displayName: 'VANS',        src: '/vans.svg' },
    { name: 'New Balance', displayName: 'NEW BALANCE', src: '/newBalance.svg' },
    { name: 'PUMA',        displayName: 'PUMA',        src: '/puma.svg' },
    { name: 'Converse',    displayName: 'CONVERSE',    src: '/converse.svg' },
  ];

  return (
    <section className="brands-section">
      <div className="brands-container">
        <div className="brands-header">
          <h2 className="brands-title">PREMIUM BRANDS</h2>
          <p className="brands-subtitle">
            Curated selection from the best in the game.
          </p>
        </div>
        <div className="brands-row">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={`/catalogue?brand=${encodeURIComponent(brand.name)}`}
              className="brand-link"
              aria-label={`Shop ${brand.displayName}`}
            >
              <img
                src={brand.src}
                alt={brand.displayName}
                className="brand-icon"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
