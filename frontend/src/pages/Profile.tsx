import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProfileSidebar, ProfileTab } from '../components/profile/ProfileSidebar';
import { PersonalInfoCard } from '../components/profile/PersonalInfoCard';
import { RecentOrders } from '../components/profile/RecentOrders';
import { DeliveryDetailsCard } from '../components/profile/DeliveryDetailsCard';
import '../components/profile/Profile.css';

export const Profile: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const isLoggingOut = useRef(false);

  // If a logged-out user visits /profile directly, redirect to /login
  useEffect(() => {
    if (!isAuthenticated && !isLoggingOut.current) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    isLoggingOut.current = true;
    logout();
    navigate('/', { replace: true });
  };

  if (!isAuthenticated && !isLoggingOut.current) {
    return null;
  }

  return (
    <div className="profile-page">
      {/* OBSIDIAN HEADER SECTION */}
      <section className="profile-header-section">
        <div className="profile-container">
          <div className="profile-header-content">
            <span className="profile-eyebrow">My Account</span>
            <h1 className="profile-main-title">ACCOUNT DASHBOARD</h1>
            <p className="profile-header-subtitle">
              Manage your personal information, order history, and track footwear deliveries.
            </p>
          </div>
        </div>
      </section>

      {/* BREADCRUMB BAR */}
      <div className="profile-container">
        <div className="profile-breadcrumb-bar">
          <nav className="profile-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">My Account</span>
          </nav>
        </div>
      </div>

      {/* MAIN BODY SECTION */}
      <main className="profile-body-section">
        <div className="profile-container">
          <div className="profile-layout">
            {/* SIDEBAR */}
            <div className="profile-sidebar-col">
              <ProfileSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
              />
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="profile-main-col">
              {activeTab === 'profile' && (
                <>
                  <PersonalInfoCard />
                  <RecentOrders />
                </>
              )}

              {activeTab === 'orders' && (
                <RecentOrders />
              )}

              {activeTab === 'delivery' && (
                <DeliveryDetailsCard showActionLink={true} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
