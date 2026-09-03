import { ShoeProduct } from '../types/catalogue';

export interface ProductImageView {
  id: string;
  label: string;
  url: string;
}

/**
 * Returns distinct, authentic image perspectives for a given shoe product.
 * Guarantees that every view belongs strictly to the selected shoe.
 */
export const getShoeGalleryImages = (product: ShoeProduct): ProductImageView[] => {
  if (product.images && product.images.length > 0) {
    const labels = ['Primary View', 'Side Profile', 'Detail & Angle', 'Alternate View'];
    return product.images.map((url, idx) => ({
      id: `view-${idx + 1}`,
      label: labels[idx] || `View ${idx + 1}`,
      url,
    }));
  }

  // Single perspective available: return primary view of the exact shoe
  return [
    { id: 'view-1', label: 'Primary View', url: product.image },
  ];
};

