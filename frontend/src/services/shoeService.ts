import api from './api';
import { ShoeProduct, ShoeBrand, ShoeCategory, ShoeGender } from '../types/catalogue';

export interface BackendShoe {
  shoeId: string;
  brand: string;
  shoeName: string;
  category: string;
  description: string;
  gender: string;
  basePrice: number;
  salePrice?: number;
  salePercentage?: number;
  imageUrls: string[];
}

/**
 * Optimizes Cloudinary images dynamically on the fly:
 * - f_auto: delivers lightweight WebP or AVIF based on browser support
 * - q_auto: smart compression with zero visible loss of quality
 * - w_800: resizes massive 7MB-10MB raw uploads down to responsive 800px display width
 */
export const optimizeCloudinaryUrl = (url: string, width = 800): string => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('/upload/f_auto')) {
      return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }
  }
  return url;
};

/**
 * Transforms a backend Shoe entity into the frontend ShoeProduct format.
 */
export const mapBackendShoeToProduct = (shoe: BackendShoe): ShoeProduct => {
  let brand: ShoeBrand = 'Nike';
  const cleanBrand = (shoe.brand || '').trim().toLowerCase();
  if (cleanBrand === 'adidas') brand = 'adidas';
  else if (cleanBrand === 'puma') brand = 'PUMA';
  else if (cleanBrand.includes('balance')) brand = 'New Balance';
  else if (cleanBrand === 'converse') brand = 'Converse';
  else if (cleanBrand === 'vans') brand = 'Vans';
  else if (cleanBrand === 'asics') brand = 'Asics';
  else if (cleanBrand === 'reebok') brand = 'Reebok';

  const rawImages = shoe.imageUrls && shoe.imageUrls.length > 0
    ? shoe.imageUrls
    : ['/trending_shoe_1_1788049696433.jpg'];

  const optimizedImages = rawImages.map((u) => optimizeCloudinaryUrl(u, 800));
  const primaryImage = optimizedImages[0];

  let gender: ShoeGender = 'Unisex';
  const cleanGender = (shoe.gender || '').trim().toLowerCase();
  if (cleanGender === 'men') gender = 'Men';
  else if (cleanGender === 'women') gender = 'Women';

  const newDropIds = ['ADI-001', 'ADI-002', 'ADI-007', 'ADI-008', 'NIKE-001', 'NIKE-006', 'NIKE-011', 'NIKE-014', 'PUM-004', 'PUM-007', 'PUM-008', 'PUM-012'];
  const isNewDrop = newDropIds.includes(shoe.shoeId);

  const isOnSale = Boolean(
    shoe.salePercentage && shoe.salePercentage > 0 &&
    shoe.salePrice && shoe.salePrice > 0 && shoe.salePrice < shoe.basePrice
  );

  let tag: string | undefined = undefined;
  if (isOnSale) {
    tag = `${Math.round(shoe.salePercentage!)}% OFF`;
  } else if (isNewDrop) {
    tag = 'JUST DROPPED';
  }

  return {
    id: shoe.shoeId,
    brand: brand,
    name: shoe.shoeName,
    category: (shoe.category || 'Sneaker') as ShoeCategory,
    colour: 'Original',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    price: shoe.basePrice,
    salePrice: isOnSale ? shoe.salePrice : undefined,
    salePercentage: isOnSale ? shoe.salePercentage : undefined,
    isOnSale: isOnSale,
    description: shoe.description,
    gender: gender,
    image: primaryImage,
    images: optimizedImages,
    isNewDrop: isNewDrop,
    tag: tag,
  };
};

/**
 * Fetches all shoes from the Spring Boot backend REST endpoint (/shoe/getAll).
 * Falls back to local static dataset if the backend is unreachable.
 */
export const fetchAllShoes = async (): Promise<ShoeProduct[]> => {
  try {
    const response = await api.get<BackendShoe[]>('/shoe/getAll');
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(mapBackendShoeToProduct);
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch shoes from backend REST API:', error);
    return [];
  }
};

/**
 * Fetches a single shoe by ID from the Spring Boot backend REST endpoint (/shoe/read/{id}).
 */
export const fetchShoeById = async (id: string): Promise<ShoeProduct | undefined> => {
  try {
    const response = await api.get<BackendShoe>(`/shoe/read/${id}`);
    if (response.data && response.data.shoeId) {
      return mapBackendShoeToProduct(response.data);
    }
  } catch (error) {
    console.error(`Could not fetch shoe ${id} from backend API:`, error);
  }
  return undefined;
};

