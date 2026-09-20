import { useState, useEffect } from 'react';
import { orderService, BackendOrder } from '../services/orderService';

// Same module-level in-memory cache pattern as useShoes.ts — this is the
// admin-wide "every order in the system" list (GET /order/getAll), distinct
// from OrderContext's per-customer order history.
let cache: BackendOrder[] | null = null;
let inFlight: Promise<BackendOrder[]> | null = null;

export const loadAdminOrders = (): Promise<BackendOrder[]> => {
  if (cache) return Promise.resolve(cache);
  if (!inFlight) {
    inFlight = orderService.getAllOrders().then((data) => {
      cache = data;
      inFlight = null;
      return data;
    });
  }
  return inFlight;
};

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<BackendOrder[]>(cache || []);
  const [loading, setLoading] = useState<boolean>(!cache);
  const [error, setError] = useState<boolean>(false);

  const fetchAndSetOrders = () => {
    setLoading(true);
    return loadAdminOrders()
      .then((data) => {
        setOrders(data);
        setError(false);
        return data;
      })
      .catch(() => {
        setError(true);
        return [] as BackendOrder[];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (cache) {
      setOrders(cache);
      setLoading(false);
      return;
    }
    fetchAndSetOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    cache = null;
    return fetchAndSetOrders();
  };

  return { orders, loading, error, refresh };
};
