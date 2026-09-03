import { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState<string | null>(null);
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();

  const searchValue = localSearch !== null ? localSearch : urlSearch;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    
    // Check if currently on a catalogue route
    const isCatalogueRoute = ['/catalogue', '/men', '/women', '/kids', '/new-drops'].includes(location.pathname);
    
    if (isCatalogueRoute) {
      if (query) {
        searchParams.set('search', query);
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams);
      setLocalSearch(null);
    } else {
      if (query) {
        navigate(`/catalogue?search=${encodeURIComponent(query)}`);
      } else {
        navigate('/catalogue');
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    
    const isCatalogueRoute = ['/catalogue', '/men', '/women', '/kids', '/new-drops'].includes(location.pathname);
    if (isCatalogueRoute) {
      if (val.trim()) {
        searchParams.set('search', val.trim());
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <nav className="navbar">
      <div className="navContainer">
        
        {/* LEFT: Logo + Nav Links */}
        <div className="navLeft">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Tekkies Store Logo" />
          </Link>

          <ul className="navLinks">
            <li>
              <NavLink to="/new-drops" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                NEW DROPS
              </NavLink>
            </li>
            <li>
              <NavLink to="/men" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                MEN
              </NavLink>
            </li>
            <li>
              <NavLink to="/women" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                WOMEN
              </NavLink>
            </li>
            <li>
              <NavLink to="/kids" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                KIDS
              </NavLink>
            </li>
            <li>
              <NavLink to="/catalogue" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                CATALOGUE
              </NavLink>
            </li>
          </ul>
        </div>

        {/* RIGHT: Search + Actions */}
        <div className="navRight">
          
          <form className="searchWrapper" onSubmit={handleSearchSubmit}>
            <Search className="searchIcon" strokeWidth={1.75} />
            <input 
              type="text" 
              className="searchInput" 
              placeholder="Search for shoes, brands..."
              value={searchValue}
              onChange={handleSearchChange}
              aria-label="Search shoes and brands"
            />
          </form>

          <div className="navActions">
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="navActionBtn" aria-label={`Wishlist (${wishlistCount} items)`} title="Wishlist">
              <div className="navBadgeWrapper">
                <Heart className="actionIcon" strokeWidth={1.75} />
                {wishlistCount > 0 && (
                  <span className="navBadge" aria-label={`${wishlistCount} items in wishlist`}>
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>
            
            {/* Cart Icon with Live Badge */}
            <Link to="/cart" className="navActionBtn" aria-label={`Cart (${cartCount} items)`} title="Shopping Cart">
              <div className="navBadgeWrapper">
                <ShoppingBag className="actionIcon" strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span className="navBadge" aria-label={`${cartCount} items in cart`}>
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Conditional Profile Avatar or Log In / Sign Up */}
            {isAuthenticated ? (
              <Link to="/profile" className="profileAvatar" aria-label="My Account" title="My Account">
                <User className="actionIcon" strokeWidth={1.75} />
              </Link>
            ) : (
              <div className="navAuthGroup">
                <Link to="/login" className="navAuthBtn navLoginBtn">
                  Log In
                </Link>
                <Link to="/signup" className="navAuthBtn navSignupBtn">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

