import { ShoeProduct } from '../types/catalogue';

// Import existing local assets
import airMax90 from '../assets/Nike/Nike Air Max 90.jpg';
import airMonarch from '../assets/Nike/Nike Mens Air Monarch IV.jpg';
import mr530 from '../assets/New Balance/MR530 White_Grey.jpg';
import vansOldSkool from '../assets/Vans/Vans Old Skool Black_White.jpg';

export interface ProductImageView {
  id: string;
  label: string;
  url: string;
}

/**
 * Returns 3 distinct, brand-consistent image perspectives for a given shoe product.
 */
export const getShoeGalleryImages = (product: ShoeProduct): ProductImageView[] => {
  if (product.images && product.images.length >= 3) {
    return [
      { id: 'view-1', label: 'Primary View', url: product.images[0] },
      { id: 'view-2', label: 'Side Profile', url: product.images[1] },
      { id: 'view-3', label: 'Detail & Sole', url: product.images[2] },
    ];
  }

  const lowerName = product.name.toLowerCase();
  const brand = product.brand;

  // Nike
  if (brand === 'Nike') {
    if (lowerName.includes('air max 90')) {
      return [
        { id: 'front', label: 'Angle View', url: airMax90 },
        { id: 'side', label: 'Side Profile', url: '/category_men_sneakers_nike.jpg' },
        { id: 'detail', label: 'On-Foot View', url: '/trending_shoe_1_1788049696433.jpg' },
      ];
    }
    if (lowerName.includes('monarch')) {
      return [
        { id: 'front', label: 'Side View', url: airMonarch },
        { id: 'side', label: 'Action Profile', url: '/category_men_sneakers_standing.jpg' },
        { id: 'detail', label: 'Full Perspective', url: '/category_men_sneakers_nike.jpg' },
      ];
    }
    return [
      { id: 'front', label: 'Primary View', url: product.image },
      { id: 'side', label: 'Side Profile', url: '/category_men_sneakers_nike.jpg' },
      { id: 'detail', label: 'Detail & Texture', url: '/trending_shoe_1_1788049696433.jpg' },
    ];
  }

  // New Balance
  if (brand === 'New Balance') {
    if (lowerName.includes('530') || lowerName.includes('mr530')) {
      return [
        { id: 'front', label: 'Side Profile', url: mr530 },
        { id: 'side', label: 'Angle View', url: '/trending_shoe_3_1788049721067.jpg' },
        { id: 'detail', label: 'Texture & Cushion', url: '/category_sneakers_1788049733131.jpg' },
      ];
    }
    return [
      { id: 'front', label: 'Primary View', url: product.image },
      { id: 'side', label: 'Side Profile', url: mr530 },
      { id: 'detail', label: 'Angle & Sole', url: '/trending_shoe_3_1788049721067.jpg' },
    ];
  }

  // Vans
  if (brand === 'Vans') {
    return [
      { id: 'front', label: 'Side Profile', url: vansOldSkool },
      { id: 'side', label: 'Angle View', url: '/category_sneakers_1788049733131.jpg' },
      { id: 'detail', label: 'Waffle Sole Detail', url: '/category_men_sneakers_sitting.jpg' },
    ];
  }

  // adidas
  if (brand === 'adidas') {
    return [
      { id: 'front', label: 'Primary View', url: product.image },
      { id: 'side', label: 'Side Profile', url: '/trending_shoe_2_1788049708432.jpg' },
      { id: 'detail', label: 'Street Perspective', url: '/category_women_sneakers_orange.jpg' },
    ];
  }

  // PUMA
  if (brand === 'PUMA') {
    return [
      { id: 'front', label: 'Primary View', url: product.image },
      { id: 'side', label: 'Side Profile', url: '/category_men_sneakers_standing_outfit.jpg' },
      { id: 'detail', label: 'Lifestyle View', url: '/category_women_sneakers_sitting_orange.jpg' },
    ];
  }

  // Converse
  if (brand === 'Converse') {
    return [
      { id: 'front', label: 'Primary View', url: product.image },
      { id: 'side', label: 'Side Profile', url: '/category_men_sneakers_sitting.jpg' },
      { id: 'detail', label: 'Classic Canvas Detail', url: '/category_women.jpg' },
    ];
  }

  // Generic fallback
  return [
    { id: 'view-1', label: 'Primary View', url: product.image },
    { id: 'view-2', label: 'Angle Perspective', url: '/category_sneakers_1788049733131.jpg' },
    { id: 'view-3', label: 'Studio Profile', url: '/trending_shoe_1_1788049696433.jpg' },
  ];
};
