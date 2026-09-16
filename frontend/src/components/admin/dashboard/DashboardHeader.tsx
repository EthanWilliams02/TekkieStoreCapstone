import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import './DashboardHeader.css';

interface DashboardHeaderProps {
  onFilterChange?: (filter: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onFilterChange,
}) => {
  const [filterActive, setFilterActive] = useState(false);

  const handleFilterToggle = () => {
    const nextState = !filterActive;
    setFilterActive(nextState);
    if (onFilterChange) {
      onFilterChange(nextState ? 'all_channels' : 'default');
    }
  };

  return (
    <div className="dashboard-header-container">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your TekkieStore</p>
      </div>

      <div className="dashboard-header-actions">
        <button
          type="button"
          className={`admin-btn-secondary ${filterActive ? 'active' : ''}`}
          onClick={handleFilterToggle}
          title="Filter dashboard time ranges and metrics"
        >
          <SlidersHorizontal size={16} />
          <span>{filterActive ? 'Filtered (All Channels)' : 'Filter Data'}</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
