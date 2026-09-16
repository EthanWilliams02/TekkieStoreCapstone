import React, { useState } from 'react';
import { formatPrice } from '../../../utils/formatters';
import './SalesOverview.css';

type Period = '7d' | '30d' | '12m';

interface SalesDataPoint {
  label: string;
  amount: number;
  orders: number;
}

const SALES_DATA: Record<Period, { points: SalesDataPoint[]; total: number; avgOrder: number }> = {
  '7d': {
    points: [
      { label: 'Mon', amount: 14200, orders: 8 },
      { label: 'Tue', amount: 18500, orders: 11 },
      { label: 'Wed', amount: 22400, orders: 14 },
      { label: 'Thu', amount: 19800, orders: 12 },
      { label: 'Fri', amount: 31200, orders: 19 },
      { label: 'Sat', amount: 38900, orders: 24 },
      { label: 'Sun', amount: 26500, orders: 16 },
    ],
    total: 171500,
    avgOrder: 1650,
  },
  '30d': {
    points: [
      { label: 'Week 1', amount: 54000, orders: 34 },
      { label: 'Week 2', amount: 62500, orders: 39 },
      { label: 'Week 3', amount: 71200, orders: 45 },
      { label: 'Week 4', amount: 60950, orders: 38 },
    ],
    total: 248650,
    avgOrder: 1590,
  },
  '12m': {
    points: [
      { label: 'Oct', amount: 112000, orders: 70 },
      { label: 'Nov', amount: 145000, orders: 92 },
      { label: 'Dec', amount: 230000, orders: 145 },
      { label: 'Jan', amount: 128000, orders: 81 },
      { label: 'Feb', amount: 139000, orders: 88 },
      { label: 'Mar', amount: 156000, orders: 98 },
      { label: 'Apr', amount: 142000, orders: 90 },
      { label: 'May', amount: 168000, orders: 106 },
      { label: 'Jun', amount: 175000, orders: 110 },
      { label: 'Jul', amount: 189000, orders: 119 },
      { label: 'Aug', amount: 204000, orders: 128 },
      { label: 'Sep', amount: 248650, orders: 156 },
    ],
    total: 2036650,
    avgOrder: 1720,
  },
};

export const SalesOverview: React.FC = () => {
  const [period, setPeriod] = useState<Period>('30d');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeData = SALES_DATA[period];
  const maxAmount = Math.max(...activeData.points.map((p) => p.amount), 1);

  return (
    <div className="dashboard-card sales-overview-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">Sales Overview</h2>
          <p className="card-subtitle">Monthly revenue and sales performance</p>
        </div>

        {/* Period Selector */}
        <div className="period-selector" role="group" aria-label="Sales time period">
          <button
            type="button"
            className={`period-btn ${period === '7d' ? 'active' : ''}`}
            onClick={() => setPeriod('7d')}
          >
            7 Days
          </button>
          <button
            type="button"
            className={`period-btn ${period === '30d' ? 'active' : ''}`}
            onClick={() => setPeriod('30d')}
          >
            30 Days
          </button>
          <button
            type="button"
            className={`period-btn ${period === '12m' ? 'active' : ''}`}
            onClick={() => setPeriod('12m')}
          >
            12 Months
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="sales-stats-row">
        <div className="sales-stat-item">
          <span className="stat-label">Period Revenue</span>
          <span className="stat-value">{formatPrice(activeData.total)}</span>
        </div>
        <div className="sales-stat-item">
          <span className="stat-label">Avg Order Value</span>
          <span className="stat-value">{formatPrice(activeData.avgOrder)}</span>
        </div>
        <div className="sales-stat-item">
          <span className="stat-label">Conversion Rate</span>
          <span className="stat-value">3.4%</span>
        </div>
      </div>

      {/* CSS / SVG Visual Bar Chart */}
      <div className="sales-chart-wrapper" aria-label="Sales Chart">
        <div className="chart-bars-container">
          {activeData.points.map((pt, idx) => {
            const heightPercent = Math.max(12, Math.round((pt.amount / maxAmount) * 100));
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={pt.label}
                className="chart-col"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="chart-tooltip">
                    <span className="tooltip-amount">{formatPrice(pt.amount)}</span>
                    <span className="tooltip-orders">{pt.orders} orders</span>
                  </div>
                )}

                <div className="bar-track">
                  <div
                    className={`bar-fill ${isHovered ? 'hovered' : ''}`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span className="col-label">{pt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
