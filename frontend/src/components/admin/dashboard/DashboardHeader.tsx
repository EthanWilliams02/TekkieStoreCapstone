import React from 'react';
import { RefreshCw } from 'lucide-react';
import './DashboardHeader.css';

interface DashboardHeaderProps {
  onRefresh: () => void;
  refreshing?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh, refreshing = false }) => {
  return (
    <div className="dashboard-header-container">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your TekkieStore</p>
      </div>

      <div className="dashboard-header-actions">
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={onRefresh}
          disabled={refreshing}
          title="Reload dashboard data from the server"
        >
          <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
          <span>{refreshing ? 'Refreshing…' : 'Refresh'}</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
