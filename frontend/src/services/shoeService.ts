import api from './api';
import { ShoeProduct, ShoeBrand, ShoeCategory, ShoeGender } from '../types/catalogue';

// Matches the exact fields returned by the Spring Boot Shoe entity
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

// Make sure the main front photo is always first, before alternate views like _2 or _3
export const sortShoeImages = (urls: string[]): string[] => {
  if (!urls || urls.length <= 1) return urls || [];

  return [...urls].sort((a, b) => {
    // If a photo filename has _2 or _3, it is an alternate angle
    const aIsAlternate = a.includes('_2') || a.includes('_3');
    const bIsAlternate = b.includes('_2') || b.includes('_3');

    // Keep the main photo (the one without _2 or _3) at index 0
    if (!aIsAlternate && bIsAlternate) return -1;
    if (aIsAlternate && !bIsAlternate) return 1;

    // Otherwise sort normally (_2 before _3)
    return a.localeCompare(b);
  });
};

// Maps backend Shoe data into the format expected by our frontend components
export const mapBackendShoeToProduct = (shoe: BackendShoe): ShoeProduct => {
  // Normalize brand names for clean UI filters
  let brand: ShoeBrand = 'Nike';
  const cleanBrand = (shoe.brand || '').trim().toLowerCase();
  if (cleanBrand === 'adidas') brand = 'adidas';
  else if (cleanBrand === 'puma') brand = 'PUMA';
  else if (cleanBrand.includes('balance')) brand = 'New Balance';
  else if (cleanBrand === 'converse') brand = 'Converse';
  else if (cleanBrand === 'vans') brand = 'Vans';
  else if (cleanBrand === 'asics') brand = 'Asics';
  else if (cleanBrand === 'reebok') brand = 'Reebok';

  // Get images straight from the database, main photo first
  const images = sortShoeImages(shoe.imageUrls || []);
  const primaryImage = images[0] || '';

  // Gender classification
  let gender: ShoeGender = 'Unisex';
  const cleanGender = (shoe.gender || '').trim().toLowerCase();
  if (cleanGender === 'men') gender = 'Men';
  else if (cleanGender === 'women') gender = 'Women';

  // Highlight specific hot shoes as new drops
  const newDropIds = ['ADI-001', 'ADI-002', 'ADI-007', 'ADI-008', 'NIKE-001', 'NIKE-006', 'NIKE-011', 'NIKE-014', 'PUM-004', 'PUM-007', 'PUM-008', 'PUM-012'];
  const isNewDrop = newDropIds.includes(shoe.shoeId);

  // Check if shoe is discounted
  const isOnSale = Boolean(
    shoe.salePercentage && shoe.salePercentage > 0 &&
    shoe.salePrice && shoe.salePrice > 0 && shoe.salePrice < shoe.basePrice
  );

  // Badge text for card overlays
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
    images: images,
    isNewDrop: isNewDrop,
    tag: tag,
  };
};

// GET: Fetches the entire shoe catalogue from the Spring Boot backend.
// Note: This data is heavily cached on the frontend to prevent excessive database queries.
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

// GET: Fetches a single shoe record by its ID from the backend
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

// POST: Sends payload to the backend to persist a new shoe record in the database
export const createShoe = async (shoe: BackendShoe): Promise<ShoeProduct | null> => {
  try {
    const response = await api.post<BackendShoe>('/shoe/create', shoe);
    return response.data ? mapBackendShoeToProduct(response.data) : null;
  } catch (error) {
    console.error('Failed to create shoe via backend API:', error);
    return null;
  }
};

// POST: Sends updated shoe details to the backend to modify an existing record
export const updateShoe = async (shoe: BackendShoe): Promise<ShoeProduct | null> => {
  try {
    const response = await api.post<BackendShoe>('/shoe/update', shoe);
    return response.data ? mapBackendShoeToProduct(response.data) : null;
  } catch (error) {
    console.error('Failed to update shoe via backend API:', error);
    return null;
  }
};

// DELETE: Removes a shoe record from the database by its ID
export const deleteShoe = async (id: string): Promise<boolean> => {
  try {
    const response = await api.delete<boolean>(`/shoe/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete shoe ${id}:`, error);
    return false;
  }
};


