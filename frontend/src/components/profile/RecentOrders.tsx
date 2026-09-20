import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ExternalLink, RefreshCw, Truck } from 'lucide-react';
import { Order, OrderStatus } from '../../types/profile';
import { MOCK_ORDERS } from '../../data/mockOrders';
import { useAuth } from '../../context/AuthContext';
import { orderService, formatOrderStatus } from '../../services/orderService';
import { useOrder } from '../../context/OrderContext';
import { ProductImage } from '../shared/ProductImage';

interface RecentOrdersProps {
  orders?: Order[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders: propOrders }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeOrder, orders: contextOrders } = useOrder();
  const [customerOrders, setCustomerOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    // If explicit orders were passed as props, don't fetch
    if (propOrders) return;

    let isMounted = true;
    if (user?.customerId) {
      orderService
        .getOrdersByCustomerId(user.customerId)
        .then((data) => {
          if (!isMounted) return;
          const mapped: Order[] = data.map((bo) => {
            const dateObj = new Date(bo.orderDate);
            const dateStr = isNaN(dateObj.getTime())
              ? 'Recent'
              : dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

            return {
              id: bo.orderId,
              orderNumber: bo.orderId,
              date: dateStr,
              status: formatOrderStatus(bo.status) as OrderStatus,
              total: bo.totalAmount,
              items: (bo.orderItems || []).map((bi) => ({
                id: bi.orderItemId,
                name: bi.shoeName || 'Sneaker',
                brand: bi.brand || 'Tekkie',
                size: bi.size || '-',
                quantity: bi.quantity,
                price: bi.unitPrice,
                image: bi.imageUrl || '/trending_shoe_1_1788049696433.jpg',
              })),
            };
          });
          setCustomerOrders(mapped);
        })
        .catch((err) => {
          console.error('Failed to load customer orders:', err);
          if (isMounted) setCustomerOrders([]);
        });
    } else {
      setCustomerOrders([]);
    }

    return () => {
      isMounted = false;
    };
  }, [user?.customerId, propOrders, activeOrder]);

  const orders: Order[] = React.useMemo(() => {
    if (propOrders) return propOrders;

    const convertedContextOrders: Order[] = (contextOrders || []).map((co) => ({
      id: co.id,
      orderNumber: co.orderNumber.replace('#', ''),
      date: co.dateFormatted,
      status: co.status as any,
      total: co.total,
      items: co.items.map((it) => ({
        id: it.id,
        name: it.name,
        brand: it.brand,
        size: it.size,
        quantity: it.quantity,
        price: it.price,
        image: it.image,
      })),
    }));

    if (!customerOrders) {
      if (convertedContextOrders.length > 0) return convertedContextOrders;
      return user?.customerId ? [] : MOCK_ORDERS;
    }

    const orderMap = new Map<string, Order>();
    customerOrders.forEach((o) => orderMap.set(o.id.toUpperCase(), o));
    convertedContextOrders.forEach((o) => {
      const key = o.id.toUpperCase();
      if (!orderMap.has(key)) {
        orderMap.set(key, o);
      }
    });

    return Array.from(orderMap.values());
  }, [propOrders, customerOrders, contextOrders, user?.customerId]);

  const getStatusBadgeClass = (status: OrderStatus | string) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'In Transit':
      case 'Confirmed':
      case 'Order Confirmed':
        return 'status-transit';
      case 'Processing':
      case 'Pending':
        return 'status-processing';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-processing';
    }
  };

  return (
    <div className="profile-card recent-orders-card">
      <div className="profile-card-header">
        <div>
          <h2 className="profile-card-title">Recent Orders</h2>
          <p className="profile-card-subtitle">
            Track, manage, and view status history for all your purchases.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty-state">
          <Package className="orders-empty-icon" size={40} />
          <h3 className="orders-empty-title">No Orders Placed Yet</h3>
          <p className="orders-empty-text">
            When you purchase sneakers, your order tracking and history will appear here.
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item-card">
              {/* Order Card Header */}
              <div className="order-header-bar">
                <div className="order-meta-left">
                  <div className="order-meta-col">
                    <span className="order-meta-label">Order Number</span>
                    <span className="order-meta-value order-id">#{order.orderNumber}</span>
                  </div>
                  <div className="order-meta-col">
                    <span className="order-meta-label">Date Placed</span>
                    <span className="order-meta-value">{order.date}</span>
                  </div>
                  <div className="order-meta-col">
                    <span className="order-meta-label">Total Amount</span>
                    <span className="order-meta-value order-price">
                      R {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="order-meta-right">
                  <span className={`order-status-badge ${getStatusBadgeClass(order.status)}`}>
                    <span className="status-dot" />
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Products List */}
              <div className="order-products-list">
                {order.items.map((item) => (
                  <div key={item.id} className="order-product-row">
                    <div className="product-thumb-wrapper">
                      <ProductImage src={item.image} alt={item.name} className="product-thumb-img" />
                    </div>
                    <div className="product-details">
                      <span className="product-brand">{item.brand}</span>
                      <h4 className="product-name">{item.name}</h4>
                      <div className="product-specs">
                        <span className="spec-badge">Size: {item.size}</span>
                        <span className="spec-badge">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="product-price-col">
                      <span className="product-unit-price">
                        R {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions Footer */}
              <div className="order-footer-actions">
                <div className="order-actions-left">
                  {(order.status === 'In Transit' ||
                    order.status === ('Confirmed' as any) ||
                    (order.status as string) === 'Order Confirmed') && (
                    <button
                      type="button"
                      className="btn-order-action secondary"
                      onClick={() => navigate(`/delivery-details/${order.id}`)}
                    >
                      <Truck size={15} />
                      <span>Track Package</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-order-action secondary"
                    onClick={() => navigate(`/order-confirmation/${order.id}`)}
                  >
                    <ExternalLink size={15} />
                    <span>View Order Details</span>
                  </button>
                </div>

                <div className="order-actions-right">
                  <button
                    type="button"
                    className="btn-order-action primary"
                    onClick={() => navigate('/catalogue')}
                  >
                    <RefreshCw size={14} />
                    <span>Buy Again</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
