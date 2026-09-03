export type ShoeBrand = 'Nike' | 'adidas' | 'PUMA' | 'New Balance' | 'Converse' | 'Vans' | 'Asics' | 'Reebok';
export type ShoeCategory = 'Casual' | 'Sneaker' | 'Trainer';
export type ShoeGender = 'Men' | 'Women' | 'Unisex' | 'Kids';
export type RouteMode = 'all' | 'men' | 'women' | 'kids' | 'new-drops';

export interface ShoeProduct {
  id: string;
  brand: ShoeBrand;
  name: string;
  category: ShoeCategory;
  colour: string;
  sizes: string[];
  price: number;
  description: string;
  gender: ShoeGender;
  image: string;
  images?: string[];
  isNewDrop?: boolean;
  tag?: string;
}

export interface CatalogueFilterState {
  brands: ShoeBrand[];
  categories: ShoeCategory[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  sortBy: 'latest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}
