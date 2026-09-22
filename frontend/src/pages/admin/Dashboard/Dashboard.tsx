import React, { useEffect } from 'react';
import { useShoes } from '../../../hooks/useShoes';
import { useShoeVariants } from '../../../hooks/useShoeVariants';
import { useAdminOrders } from '../../../hooks/useAdminOrders';
import { useCustomerCount } from '../../../hooks/useCustomerCount';
import { DashboardHeader } from '../../../components/admin/dashboard/DashboardHeader';
import { KpiCards } from '../../../components/admin/dashboard/KpiCards';
import { SalesOverview } from '../../../components/admin/dashboard/SalesOverview';
import { RecentOrders } from '../../../components/admin/dashboard/RecentOrders';
import { InventoryStatus } from '../../../components/admin/dashboard/InventoryStatus';
import { TopProducts } from '../../../components/admin/dashboard/TopProducts';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  // Every metric on this page comes from a real backend call — no invented
  // fallback numbers. Each source is cached in-memory (module-level, one
  // fetch per session) via its own hook, same pattern as useShoes, so
  // navigating back to the dashboard doesn't refetch everything again.
  const { shoes, loading: shoesLoading, error: shoesError, refresh: refreshShoes } = useShoes();
  const { variants, loading: variantsLoading, error: variantsError, refresh: refreshVariants } = useShoeVariants();
  const { orders, loading: ordersLoading, error: ordersError, refresh: refreshOrders } = useAdminOrders();
  const { count: customerCount, loading: customersLoading, error: customersError, refresh: refreshCustomerCount } = useCustomerCount();

  useEffect(() => {
    const id = setInterval(() => {
      refreshShoes();
      refreshVariants();
      refreshOrders();
      refreshCustomerCount();
    }, 30000);
    return () => clearInterval(id);
  }, [refreshShoes, refreshVariants, refreshOrders, refreshCustomerCount]);

  // Cancelled orders were never fulfilled sales — excluded from revenue.
  const totalRevenue = orders.filter((o) => o.status !== 'CANCELLED').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="admin-dashboard-page">
      <DashboardHeader />

      <KpiCards
        shoes={{ value: shoes.length, loading: shoesLoading, error: Boolean(shoesError) }}
        orders={{ value: orders.length, loading: ordersLoading, error: ordersError }}
        revenue={{ value: totalRevenue, loading: ordersLoading, error: ordersError }}
        customers={{ value: customerCount, loading: customersLoading, error: customersError }}
      />

      <div className="dashboard-grid-row-two">
        <div className="grid-cell-sales">
          <SalesOverview orders={orders} loading={ordersLoading} error={ordersError} />
        </div>
        <div className="grid-cell-orders">
          <RecentOrders orders={orders} loading={ordersLoading} error={ordersError} />
        </div>
      </div>

      <div className="dashboard-grid-row-three">
        <div className="grid-cell-inventory">
          <InventoryStatus variants={variants} loading={variantsLoading} error={variantsError} />
        </div>
        <div className="grid-cell-top-products">
          <TopProducts orders={orders} loading={ordersLoading} error={ordersError} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
