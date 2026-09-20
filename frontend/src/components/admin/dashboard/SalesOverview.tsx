import React, { useMemo, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { formatPrice } from '../../../utils/formatters';
import { BackendOrder } from '../../../services/orderService';
import './SalesOverview.css';

type Period = '7d' | '4w' | '12m';

interface SalesOverviewProps {
  orders: BackendOrder[];
  loading?: boolean;
  error?: boolean;
}

interface Bucket {
  label: string;
  amount: number;
  orderCount: number;
}

const parseOrderDate = (raw: string | number): Date | null => {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Buckets real orders into the last N calendar days.
const buildDailyBuckets = (orders: BackendOrder[], days: number): Bucket[] => {
  const today = startOfDay(new Date());
  const buckets: Bucket[] = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    return { label: d.toLocaleDateString('en-ZA', { weekday: 'short' }), amount: 0, orderCount: 0 };
  });

  orders.forEach((o) => {
    const d = parseOrderDate(o.orderDate);
    if (!d) return;
    const diffDays = Math.round((today.getTime() - startOfDay(d).getTime()) / 86400000);
    if (diffDays >= 0 && diffDays < days) {
      const bucket = buckets[days - 1 - diffDays];
      bucket.amount += o.totalAmount || 0;
      bucket.orderCount += 1;
    }
  });

  return buckets;
};

// Buckets real orders into the last N calendar weeks (Sun-Sat aligned by "days ago / 7").
const buildWeeklyBuckets = (orders: BackendOrder[], weeks: number): Bucket[] => {
  const today = startOfDay(new Date());
  const buckets: Bucket[] = Array.from({ length: weeks }, (_, i) => ({
    label: `Week ${i + 1}`,
    amount: 0,
    orderCount: 0,
  }));

  orders.forEach((o) => {
    const d = parseOrderDate(o.orderDate);
    if (!d) return;
    const diffDays = Math.round((today.getTime() - startOfDay(d).getTime()) / 86400000);
    const weeksAgo = Math.floor(diffDays / 7);
    if (weeksAgo >= 0 && weeksAgo < weeks) {
      const bucket = buckets[weeks - 1 - weeksAgo];
      bucket.amount += o.totalAmount || 0;
      bucket.orderCount += 1;
    }
  });

  return buckets;
};

// Buckets real orders into the last N calendar months.
const buildMonthlyBuckets = (orders: BackendOrder[], months: number): Bucket[] => {
  const now = new Date();
  const buckets: Bucket[] = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { label: d.toLocaleDateString('en-ZA', { month: 'short' }), amount: 0, orderCount: 0 };
  });

  orders.forEach((o) => {
    const d = parseOrderDate(o.orderDate);
    if (!d) return;
    const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (monthsAgo >= 0 && monthsAgo < months) {
      const bucket = buckets[months - 1 - monthsAgo];
      bucket.amount += o.totalAmount || 0;
      bucket.orderCount += 1;
    }
  });

  return buckets;
};

export const SalesOverview: React.FC<SalesOverviewProps> = ({ orders, loading = false, error = false }) => {
  const [period, setPeriod] = useState<Period>('7d');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Cancelled orders were never fulfilled sales — excluded from revenue.
  const validOrders = useMemo(() => orders.filter((o) => o.status !== 'CANCELLED'), [orders]);

  const buckets = useMemo(() => {
    if (period === '7d') return buildDailyBuckets(validOrders, 7);
    if (period === '4w') return buildWeeklyBuckets(validOrders, 4);
    return buildMonthlyBuckets(validOrders, 12);
  }, [validOrders, period]);

  const periodTotal = buckets.reduce((sum, b) => sum + b.amount, 0);
  const periodOrderCount = buckets.reduce((sum, b) => sum + b.orderCount, 0);
  const avgOrderValue = periodOrderCount > 0 ? periodTotal / periodOrderCount : 0;
  const maxAmount = Math.max(...buckets.map((b) => b.amount), 1);

  return (
    <div className="dashboard-card sales-overview-card">
      <div className="card-header-row">
        <h2 className="card-title">Sales Overview</h2>

        <div className="period-selector" role="group" aria-label="Sales time period">
          <button type="button" className={`period-btn ${period === '7d' ? 'active' : ''}`} onClick={() => setPeriod('7d')}>
            7 Days
          </button>
          <button type="button" className={`period-btn ${period === '4w' ? 'active' : ''}`} onClick={() => setPeriod('4w')}>
            4 Weeks
          </button>
          <button type="button" className={`period-btn ${period === '12m' ? 'active' : ''}`} onClick={() => setPeriod('12m')}>
            12 Months
          </button>
        </div>
      </div>

      {loading ? (
        <>
          <div className="sales-stats-row">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div className="sales-stat-item" key={idx}>
                <Skeleton variant="text" width={90} height={16} animation="wave" />
                <Skeleton variant="text" width={70} height={24} animation="wave" />
              </div>
            ))}
          </div>
          <div className="sales-chart-wrapper" aria-hidden="true">
            <div className="chart-bars-container">
              {Array.from({ length: 7 }).map((_, idx) => (
                <div className="chart-col" key={idx} style={{ justifyContent: 'flex-end' }}>
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={60 + ((idx * 23) % 120)}
                    animation="wave"
                    sx={{ borderRadius: '6px 6px 0 0', maxWidth: 42 }}
                  />
                  <Skeleton variant="text" width={28} height={16} animation="wave" sx={{ mt: 0.5 }} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : error ? (
        <div className="dashboard-empty-state dashboard-empty-state-error">Unable to load orders from the server.</div>
      ) : validOrders.length === 0 ? (
        <div className="dashboard-empty-state">No sales recorded yet.</div>
      ) : (
        <>
          <div className="sales-stats-row">
            <div className="sales-stat-item">
              <span className="sales-stat-label">Period Revenue</span>
              <span className="sales-stat-value">{formatPrice(periodTotal)}</span>
            </div>
            <div className="sales-stat-item">
              <span className="sales-stat-label">Orders in Period</span>
              <span className="sales-stat-value">{periodOrderCount}</span>
            </div>
            <div className="sales-stat-item">
              <span className="sales-stat-label">Avg Order Value</span>
              <span className="sales-stat-value">{formatPrice(avgOrderValue)}</span>
            </div>
          </div>

          <div className="sales-chart-wrapper" aria-label="Sales chart">
            <div className="chart-bars-container">
              {buckets.map((b, idx) => {
                const heightPercent = b.amount > 0 ? Math.max(6, Math.round((b.amount / maxAmount) * 100)) : 2;
                const isHovered = hoveredIdx === idx;

                return (
                  <div
                    key={`${b.label}-${idx}`}
                    className="chart-col"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {isHovered && (
                      <div className="chart-tooltip">
                        <span className="tooltip-amount">{formatPrice(b.amount)}</span>
                        <span className="tooltip-orders">
                          {b.orderCount} order{b.orderCount === 1 ? '' : 's'}
                        </span>
                      </div>
                    )}

                    <div className="bar-track">
                      <div className={`bar-fill ${isHovered ? 'hovered' : ''}`} style={{ height: `${heightPercent}%` }} />
                    </div>

                    <span className="col-label">{b.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesOverview;
