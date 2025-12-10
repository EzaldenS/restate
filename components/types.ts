export interface FilterShape {
  priceRange: [number, number];
  sizeRange: [number, number];
  types: string[];
  bedrooms: number;
  bathrooms: number;
}

export const defaultFilters: FilterShape = {
  priceRange: [100, 500],
  sizeRange: [1000, 3000],
  types: [],
  bedrooms: 0,
  bathrooms: 0,
};