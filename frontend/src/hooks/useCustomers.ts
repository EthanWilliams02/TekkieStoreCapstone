import { useState, useEffect } from 'react';
import api from '../services/api';

export interface Customer {
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
}

// Same module-level in-memory cache pattern as useShoes.ts.
let cache: Customer[] | null = null;
let inFlight: Promise<Customer[]> | null = null;

const mapCustomer = (c: any): Customer => {
  const first = c?.name?.firstName || '';
  const last = c?.name?.lastName || '';
  return {
    customerId: c?.customerId || '',
    fullName: `${first} ${last}`.trim() || 'Unknown',
    email: c?.email || '',
    phone: c?.mobileNumber || '',
  };
};

const fetchCustomers = (): Promise<Customer[]> =>
  api.get('/customer/getAll').then((res) => (Array.isArray(res.data) ? res.data.map(mapCustomer) : []));

export const loadCustomers = (): Promise<Customer[]> => {
  if (cache) return Promise.resolve(cache);
  if (!inFlight) {
    inFlight = fetchCustomers().then((data) => {
      cache = data;
      inFlight = null;
      return data;
    });
  }
  return inFlight;
};

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(cache || []);
  const [loading, setLoading] = useState<boolean>(!cache);
  const [error, setError] = useState<boolean>(false);

  const fetchAndSetCustomers = () => {
    setLoading(true);
    return loadCustomers()
      .then((data) => {
        setCustomers(data);
        setError(false);
        return data;
      })
      .catch(() => {
        setError(true);
        return [] as Customer[];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (cache) {
      setCustomers(cache);
      setLoading(false);
      return;
    }
    fetchAndSetCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    cache = null;
    return fetchAndSetCustomers();
  };

  return { customers, loading, error, refresh };
};
