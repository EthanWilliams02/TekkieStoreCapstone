import { useState, useEffect } from 'react';
import { ShoeProduct } from '../types/catalogue';
import { fetchAllShoes } from '../services/shoeService';

// Global in-memory cache to persist data across component unmounts 
// (e.g. navigating between Home and Catalogue) without hitting the backend again.
let globalShoeCache: ShoeProduct[] | null = null;

export const useShoes = () => {
  const [shoes, setShoes] = useState<ShoeProduct[]>(globalShoeCache || []);
  const [loading, setLoading] = useState<boolean>(!globalShoeCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // If we already have the shoes cached globally, don't fetch again
    if (globalShoeCache) {
      setShoes(globalShoeCache);
      setLoading(false);
      return;
    }

    const loadShoes = async () => {
      try {
        setLoading(true);
        // Call the backend API (this should only happen once per session)
        const data = await fetchAllShoes();
        
        if (isMounted) {
          globalShoeCache = data; // Store the result in the cache
          setShoes(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch shoes from the database.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadShoes();

    return () => {
      isMounted = false;
    };
  }, []);

  return { shoes, loading, error };
};
