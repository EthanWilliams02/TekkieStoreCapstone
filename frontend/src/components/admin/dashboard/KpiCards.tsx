import React from 'react';
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';
import { StatCard } from '../../shared/StatCard';
import './KpiCards.css';

interface KpiMetric {
  value: number;
  loading?: boolean;
  error?: boolean;
}

interface KpiCardsProps {
  shoes: KpiMetric;
  orders: KpiMetric;
  revenue: KpiMetric;
  customers: KpiMetric;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ shoes, orders, revenue, customers }) => {
  const cards = [
    { id: 'shoes', label: 'Catalogue Size', icon: Package, metric: shoes, format: (v: number) => v.toString() },
    { id: 'orders', label: 'Total Orders', icon: ShoppingBag, metric: orders, format: (v: number) => v.toString() },
    { id: 'revenue', label: 'Total Revenue', icon: TrendingUp, metric: revenue, format: formatPrice },
    { id: 'customers', label: 'Registered Customers', icon: Users, metric: customers, format: (v: number) => v.toString() },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          icon={card.icon}
          label={card.label}
          value={card.format(card.metric.value)}
          loading={card.metric.loading}
          error={card.metric.error}
        />
      ))}
    </div>
  );
};

export default KpiCards;
