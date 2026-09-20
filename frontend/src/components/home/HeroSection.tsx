import { Link } from "react-router-dom";
import "./HeroSection.css";

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <img src="/hero.png" alt="Sole Town Hero" className="hero-image" />

      <div className="hero-overlay">
        <div className="hero-content">
          <p className="hero-eyebrow">NEW SEASON. NEW STYLE.</p>
          <h1 className="hero-title">
            STEP INTO
            <br />
            <span className="text-orange">SOMETHING</span>
            <br />
            <span className="text-orange">BOLD.</span>
          </h1>
          <p className="hero-subtitle">
            Discover the latest premium sneakers and streetwear from
            <br />
            top brands. Authentic gear for the modern culture.
          </p>

          <div className="hero-actions">
            <Link to="/new-drops" className="btn-primary">
              Shop New Drops
            </Link>
            <Link to="/catalogue" className="btn-secondary">
              Shop All
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-value">100%</span>
              <span className="hero-stat-label">Authentic</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">30 Day</span>
              <span className="hero-stat-label">Free Returns</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">24/7</span>
              <span className="hero-stat-label">Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
