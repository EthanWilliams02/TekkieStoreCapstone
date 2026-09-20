import { useState, useEffect } from 'react';
import { ShoeVariant } from '../types/shoeVariant';
import { shoeVariantService } from '../services/shoeVariantService';

// Same module-level in-memory cache pattern as useShoes.ts — fetch once per
// session, every consumer shares the result, resets on full page reload.
let cache: ShoeVariant[] | null = null;
let inFlight: Promise<ShoeVariant[]> | null = null;

export const loadShoeVariants = (): Promise<ShoeVariant[]> => {
  if (cache) return Promise.resolve(cache);
  if (!inFlight) {
    inFlight = shoeVariantService.getAllVariants().then((data) => {
      cache = data;
      inFlight = null;
      return data;
    });
  }
  return inFlight;
};

export const useShoeVariants = () => {
  const [variants, setVariants] = useState<ShoeVariant[]>(cache || []);
  const [loading, setLoading] = useState<boolean>(!cache);
  const [error, setError] = useState<boolean>(false);

  const fetchAndSetVariants = () => {
    setLoading(true);
    return loadShoeVariants()
      .then((data) => {
        setVariants(data);
        setError(false);
        return data;
      })
      .catch(() => {
        setError(true);
        return [] as ShoeVariant[];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (cache) {
      setVariants(cache);
      setLoading(false);
      return;
    }
    fetchAndSetVariants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    cache = null;
    return fetchAndSetVariants();
  };

  return { variants, loading, error, refresh };
};
