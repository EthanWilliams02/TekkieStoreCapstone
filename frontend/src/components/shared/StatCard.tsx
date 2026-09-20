import React from 'react';
import Skeleton from '@mui/material/Skeleton';

interface StatCardProps {
  /** Icon component from lucide-react. */
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  loading?: boolean;
  error?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, loading = false, error = false }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <Icon size={16} className="kpi-icon" />
        <span className="kpi-label">{label}</span>
      </div>
      <div className="kpi-value-row">
        {loading ? (
          <Skeleton variant="text" width={70} height={38} animation="wave" sx={{ fontSize: '1.8rem' }} />
        ) : error ? (
          <span className="kpi-main-number kpi-error" title="Failed to load from the server">
            —
          </span>
        ) : (
          <span className="kpi-main-number">{value}</span>
        )}
      </div>
      <span className="kpi-accent-rule" />
    </div>
  );
};

export default StatCard;
