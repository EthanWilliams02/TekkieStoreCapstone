import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-top">
              <Link to="/" className="footer-logo">
                <img src="/logo.png" alt="Tekkie Logo" />
              </Link>
              <p className="footer-tagline">
                The ultimate destination for premium sneakerheads and streetwear enthusiasts. 
                Step up your game.
              </p>
            </div>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook"><FaFacebook size={20} /></a>
              <a href="#" aria-label="Twitter"><FaTwitter size={20} /></a>
              <a href="#" aria-label="Instagram"><FaInstagram size={20} /></a>
              <a href="#" aria-label="Youtube"><FaYoutube size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h3 className="footer-title">SHOP</h3>
            <ul>
              <li><Link to="/new-drops">New Drops</Link></li>
              <li><Link to="/men">Men</Link></li>
              <li><Link to="/women">Women</Link></li>
              <li><Link to="/sale" style={{ color: '#E02B20', fontWeight: 600 }}>Sale</Link></li>
              <li><Link to="/catalogue">All Products</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">SUPPORT</h3>
            <ul>
              <li><a href="/help">FAQ</a></li>
              <li><a href="/shipping">Shipping & Returns</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/track">Track Order</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">COMPANY</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sole Town. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
