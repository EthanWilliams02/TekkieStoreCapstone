import React, { useEffect, useState, useCallback } from 'react';
import { useShoes } from '../../../hooks/useShoes';
import { shoeVariantService, ShoeVariant } from '../../../services/shoeVariantService';
import { DashboardHeader } from '../../../components/admin/dashboard/DashboardHeader';
import { KpiCards } from '../../../components/admin/dashboard/KpiCards';
import { SalesOverview } from '../../../components/admin/dashboard/SalesOverview';
import { RecentOrders, DashboardOrder } from '../../../components/admin/dashboard/RecentOrders';
import { InventoryStatus } from '../../../components/admin/dashboard/InventoryStatus';
import { TopProducts } from '../../../components/admin/dashboard/TopProducts';
import { WarehouseSync } from '../../../components/admin/dashboard/WarehouseSync';
import api from '../../../services/api';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { shoes, loading: shoesLoading, refresh: refreshShoes } = useShoes();
  const [variants, setVariants] = useState<ShoeVariant[]>([]);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(248650);
  const [totalCustomers, setTotalCustomers] = useState<number>(84);

  // Load backend variants, orders, and customer data with graceful fallbacks
  const loadDashboardData = useCallback(async () => {
    try {
      // 1. Shoe Variants for Inventory Status
      const loadedVariants = await shoeVariantService.getAllVariants();
      if (Array.isArray(loadedVariants) && loadedVariants.length > 0) {
        setVariants(loadedVariants);
      }
    } catch (e) {
      console.warn('Dashboard: Could not load shoe variants, using fallback', e);
    }

    try {
      // 2. Orders for Recent Orders & Revenue
      const ordersRes = await api.get('/order/getAll');
      if (ordersRes.data && Array.isArray(ordersRes.data) && ordersRes.data.length > 0) {
        const mappedOrders: DashboardOrder[] = ordersRes.data.map((o: any) => {
          let custName = 'Customer';
          if (o.customer?.name) {
            custName = `${o.customer.name.firstName || ''} ${o.customer.name.lastName || ''}`.trim() || 'Customer';
          }
          return {
            orderNumber: `#${o.orderId || 'ORD'}`,
            customerName: custName,
            customerEmail: o.customer?.email,
            date: typeof o.orderDate === 'string' ? o.orderDate.split('T')[0] : 'Today',
            amount: o.totalAmount || 0,
            status: (o.status === 'PAID' ? 'Processing' : o.status === 'SHIPPED' ? 'Dispatched' : o.status === 'DELIVERED' ? 'Delivered' : 'Processing') as any,
          };
        });
        setOrders(mappedOrders);

        // Sum revenue
        const rev = ordersRes.data.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        if (rev > 0) setTotalRevenue(rev);
      }
    } catch (e) {
      console.warn('Dashboard: Could not load backend orders, using fallback', e);
    }

    try {
      // 3. Customers count
      const custRes = await api.get('/customer/getAll');
      if (custRes.data && Array.isArray(custRes.data)) {
        setTotalCustomers(custRes.data.length);
      }
    } catch (e) {
      console.warn('Dashboard: Could not load customers count, using fallback', e);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handler for Warehouse Sync
  const handleWarehouseSync = async () => {
    await refreshShoes();
    await loadDashboardData();
  };

  const totalOrdersCount = orders.length > 0 ? orders.length : 142;

  return (
    <div className="admin-dashboard-page">
      {/* 1. DASHBOARD HEADER */}
      <DashboardHeader />

      {/* 2. KPI CARDS */}
      <KpiCards
        totalShoes={shoes.length || 24}
        totalOrders={totalOrdersCount}
        totalRevenue={totalRevenue}
        totalCustomers={totalCustomers}
      />

      {/* 3. ROW 2: SALES OVERVIEW + RECENT ORDERS */}
      <div className="dashboard-grid-row-two">
        <div className="grid-cell-sales">
          <SalesOverview />
        </div>
        <div className="grid-cell-orders">
          <RecentOrders orders={orders} />
        </div>
      </div>

      {/* 4. ROW 3: INVENTORY STATUS + TOP PRODUCTS */}
      <div className="dashboard-grid-row-three">
        <div className="grid-cell-inventory">
          <InventoryStatus variants={variants} shoes={shoes} />
        </div>
        <div className="grid-cell-top-products">
          <TopProducts products={shoes} loading={shoesLoading} />
        </div>
      </div>

      {/* 5. ROW 4: WAREHOUSE SYNC */}
      <div className="dashboard-grid-row-four">
        <WarehouseSync onSync={handleWarehouseSync} />
      </div>
    </div>
  );
};
export default Dashboard;
