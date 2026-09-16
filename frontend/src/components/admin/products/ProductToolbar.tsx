import React from 'react';
import { Search, X } from 'lucide-react';
import './ProductToolbar.css';

export interface ProductToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  brandFilter: string;
  onBrandFilterChange: (brand: string) => void;
  brands: string[];
  totalCount?: number;
  filteredCount?: number;
}

export const ProductToolbar: React.FC<ProductToolbarProps> = ({
  searchTerm,
  onSearchChange,
  brandFilter,
  onBrandFilterChange,
  brands,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="product-toolbar-card">
      <div className="product-toolbar-left">
        <div className="product-search-box">
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            id="product-search-input"
            type="text"
            placeholder="Search by shoe name, brand, or SKU ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search shoes by name, brand, or SKU"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search text"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {filteredCount !== undefined && totalCount !== undefined && (
          <div className="product-count-badge">
            <span>
              Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> products
            </span>
          </div>
        )}
      </div>

      <div className="product-toolbar-right">
        <div className="product-filter-group">
          <label htmlFor="admin-products-brand-filter">Brand:</label>
          <select
            id="admin-products-brand-filter"
            className="product-brand-select"
            value={brandFilter}
            onChange={(e) => onBrandFilterChange(e.target.value)}
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === 'All' ? 'All Brands' : b}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
