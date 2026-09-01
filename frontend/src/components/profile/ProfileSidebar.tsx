import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Truck, LogOut } from 'lucide-react';

export type ProfileTab = 'profile' | 'orders' | 'delivery';

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleDeliveryClick = () => {
    onTabChange('delivery');
    navigate('/delivery-details');
  };

  return (
    <aside className="profile-sidebar" aria-label="Account Navigation">
      <nav className="profile-nav-menu">
        <button
          type="button"
          className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <User className="nav-item-icon" size={19} />
          <span>Profile</span>
        </button>

        <button
          type="button"
          className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => onTabChange('orders')}
        >
          <Package className="nav-item-icon" size={19} />
          <span>Order History</span>
        </button>

        <button
          type="button"
          className={`profile-nav-item ${activeTab === 'delivery' ? 'active' : ''}`}
          onClick={handleDeliveryClick}
        >
          <Truck className="nav-item-icon" size={19} />
          <span>Delivery Details</span>
        </button>

        <div className="profile-nav-divider" />

        <button
          type="button"
          className="profile-nav-item logout-item"
          onClick={onLogout}
        >
          <LogOut className="nav-item-icon" size={19} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};
