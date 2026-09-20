import { useCustomers } from './useCustomers';

// Thin wrapper around useCustomers — the dashboard only needs the count, but
// it should share the same cache/request as the Customers page rather than
// hitting GET /customer/getAll a second time.
export const useCustomerCount = () => {
  const { customers, loading, error, refresh } = useCustomers();
  return { count: customers.length, loading, error, refresh };
};
