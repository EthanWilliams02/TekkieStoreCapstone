import { useState, useEffect } from 'react';
import { ShoeProduct } from '../types/catalogue';
import { fetchAllShoes } from '../services/shoeService';

let cache: ShoeProduct[] | null = null;
let inFlight: Promise<ShoeProduct[]> | null = null;

const loadShoes = (): Promise<ShoeProduct[]> => {
  if (cache) return Promise.resolve(cache);
  if (!inFlight) {
    inFlight = fetchAllShoes().then((data) => {
      cache = data;
      inFlight = null;
      return data;
    });
  }
  return inFlight;
};

// Starts the fetch immediately, without waiting for a component to mount
export const prefetchShoes = (): void => {
  loadShoes();
};

export const useShoes = () => {
  const [shoes, setShoes] = useState<ShoeProduct[]>(cache || []);
  const [loading, setLoading] = useState<boolean>(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) {
      setShoes(cache);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    loadShoes()
      .then((data) => {
        if (isMounted) {
          setShoes(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError('Failed to fetch shoes from the database.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { shoes, loading, error };
};
