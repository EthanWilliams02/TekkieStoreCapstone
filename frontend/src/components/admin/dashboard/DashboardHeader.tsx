import React from 'react';
import './DashboardHeader.css';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="dashboard-header-container">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your TekkieStore</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
