import React, { useRef } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  Store,
  ExternalLink,
  ShieldCheck,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggingOut = useRef(false);

  const handleLogout = () => {
    isLoggingOut.current = true;
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.firstName || user?.lastName
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : 'Admin';
  const displayEmail = user?.email || 'Store Administrator';
  const initials = (
    (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')
  ).toUpperCase() || 'AD';

  // Helper to determine active section for breadcrumbs
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/products')) return 'Products Management';
    if (path.includes('/admin/inventory')) return 'Inventory Management';
    if (path.includes('/admin/orders')) return 'Customer Orders';
    if (path.includes('/admin/customers')) return 'Customers Directory';
    return 'Dashboard';
  };

  return (
    <div className="admin-container">
      {/* 1. LEFT ADMIN SIDEBAR */}
      <aside className="admin-sidebar" aria-label="Admin Navigation">
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo-link">
            <img src="/logo.png" alt="TekkieStore Logo" className="admin-logo-img" />
            <div className="admin-logo-text">
              <span className="brand-title">TEKKIESTORE</span>
              <span className="admin-portal-tag">ADMIN PORTAL</span>
            </div>
          </Link>
        </div>

        <nav className="admin-nav-menu">
          <div className="admin-nav-section-label">MAIN MENU</div>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <LayoutDashboard size={20} className="admin-nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Package size={20} className="admin-nav-icon" />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/inventory"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Boxes size={20} className="admin-nav-icon" />
            <span>Inventory</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <ShoppingBag size={20} className="admin-nav-icon" />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Users size={20} className="admin-nav-icon" />
            <span>Customers</span>
          </NavLink>

          <div className="admin-nav-divider" />

          <div className="admin-nav-section-label">STOREFRONT</div>
          <Link to="/" className="admin-nav-link exit-link">
            <Store size={20} className="admin-nav-icon" />
            <span>Live Storefront</span>
            <ExternalLink size={14} className="external-badge-icon" />
          </Link>

          <div className="admin-nav-divider" />

          <button
            type="button"
            className="admin-nav-link logout-link"
            onClick={handleLogout}
            title="Log out of admin session"
            aria-label="Log out of admin session"
          >
            <LogOut size={20} className="admin-nav-icon" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* 2. ADMIN MAIN WRAPPER */}
      <div className="admin-main-wrapper">
        {/* TOP ADMIN NAVBAR */}
        <header className="admin-top-navbar">
          <div className="admin-top-left">
            <div className="admin-breadcrumbs">
              <span className="breadcrumb-root">Admin</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{getPageTitle()}</span>
            </div>
          </div>

          <div className="admin-top-right">
            <Link to="/" className="admin-quick-store-btn" title="Go to Customer Storefront">
              <Store size={16} />
              <span>View Store</span>
            </Link>

            <div className="admin-profile-pill">
              <div className="admin-avatar">{initials}</div>
              <div className="admin-user-info">
                <span className="admin-name">{displayName}</span>
                <span className="admin-role">{displayEmail}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. MAIN DASHBOARD CONTENT AREA */}
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
