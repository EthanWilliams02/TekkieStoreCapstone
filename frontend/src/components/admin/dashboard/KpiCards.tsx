import React from 'react';
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';
import { StatCard } from '../../shared/StatCard';
import './KpiCards.css';

interface KpiCardsProps {
  totalShoes: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalShoes,
  totalOrders,
  totalRevenue,
  totalCustomers,
}) => {
  const cards = [
    {
      id: 'shoes',
      label: 'Total Shoes',
      value: totalShoes.toString(),
      trend: '+4 this month',
      trendPositive: true,
      icon: Package,
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: totalOrders.toString(),
      trend: '+12.5% vs last month',
      trendPositive: true,
      icon: ShoppingBag,
    },
    {
      id: 'revenue',
      label: 'Total Sales Revenue',
      value: formatPrice(totalRevenue),
      trend: '+18.4% vs last month',
      trendPositive: true,
      icon: TrendingUp,
    },
    {
      id: 'customers',
      label: 'Total Customers',
      value: totalCustomers.toString(),
      trend: '+8 new this week',
      trendPositive: true,
      icon: Users,
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          icon={card.icon}
          label={card.label}
          value={card.value}
          trend={card.trend}
          trendPositive={card.trendPositive}
        />
      ))}
    </div>
  );
};

export default KpiCards;
