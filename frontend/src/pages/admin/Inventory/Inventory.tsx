import React, { useMemo, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Search, AlertCircle } from 'lucide-react';
import { useShoes } from '../../../hooks/useShoes';
import { useShoeVariants } from '../../../hooks/useShoeVariants';
import { ShoeProduct } from '../../../types/catalogue';
import { ShoeVariant } from '../../../types/shoeVariant';
import { ProductImage } from '../../../components/shared/ProductImage';
import { InventoryDrawer } from '../../../components/admin/inventory/InventoryDrawer';
import './Inventory.css';

// A per-size-out-of-stock signal rather than an aggregate unit threshold —
// two shoes with the same total units can be in very different shape
// (one missing a size entirely, one just running low across the board).
// "No Stock" covers both a shoe with zero configured sizes and one whose
// sizes are all at zero — either way, nothing is currently sellable.
type StockCategory = 'no-stock' | 'some-out' | 'fully-stocked';

const STATUS_FILTER_OPTIONS: { value: StockCategory | 'All'; label: string }[] = [
  { value: 'All', label: 'All Statuses' },
  { value: 'fully-stocked', label: 'Fully In Stock' },
  { value: 'some-out', label: 'A Few Out of Stock' },
  { value: 'no-stock', label: 'No Stock' },
];

const getStockCategory = (variantCount: number, outOfStockCount: number): StockCategory => {
  if (variantCount === 0 || outOfStockCount === variantCount) return 'no-stock';
  if (outOfStockCount === 0) return 'fully-stocked';
  return 'some-out';
};

const getStatusLabel = (category: StockCategory, outOfStockCount: number): string => {
  switch (category) {
    case 'no-stock':
      return 'No Stock';
    case 'fully-stocked':
      return 'Fully In Stock';
    case 'some-out':
      return `${outOfStockCount} Size${outOfStockCount === 1 ? '' : 's'} Out of Stock`;
  }
};

const getStatusBadgeClass = (category: StockCategory): string => {
  switch (category) {
    case 'fully-stocked':
      return 'inv-status-in';
    case 'some-out':
      return 'inv-status-low';
    case 'no-stock':
      return 'inv-status-out';
  }
};

// Most shoes only ever have one colourway in this data model, but a shoe
// could technically have variants in more than one — list them all rather
// than silently picking the first.
const getColourLabel = (shoeVariants: ShoeVariant[]): string => {
  const colours = Array.from(new Set(shoeVariants.map((v) => v.colour).filter(Boolean)));
  return colours.length > 0 ? colours.join(', ') : '—';
};

const getSizesInStockLabel = (shoeVariants: ShoeVariant[]): string => {
  const inStock = shoeVariants
    .filter((v) => v.stockQuantity > 0)
    .sort((a, b) => a.size.sizeValue - b.size.sizeValue)
    .map((v) => `${v.size.sizeRegion}${v.size.sizeValue}`);
  return inStock.length > 0 ? inStock.join(', ') : 'None in stock';
};

export const Inventory: React.FC = () => {
  const { shoes, loading: shoesLoading, error: shoesError } = useShoes();
  const { variants, loading: variantsLoading, error: variantsError, refresh: refreshVariants } = useShoeVariants();
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<StockCategory | 'All'>('All');
  const [selectedShoe, setSelectedShoe] = useState<ShoeProduct | null>(null);

  const loading = shoesLoading || variantsLoading;
  const error = Boolean(shoesError) || variantsError;

  const brands = useMemo(() => ['All', ...Array.from(new Set(shoes.map((s) => s.brand))).sort()], [shoes]);

  const rows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return shoes
      .filter((s) => !term || s.name.toLowerCase().includes(term) || s.brand.toLowerCase().includes(term))
      .filter((s) => brandFilter === 'All' || s.brand === brandFilter)
      .map((shoe) => {
        const shoeVariants = variants.filter((v) => v.shoe?.shoeId === shoe.id);
        const totalStock = shoeVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
        const outOfStockCount = shoeVariants.filter((v) => v.stockQuantity <= 0).length;
        const category = getStockCategory(shoeVariants.length, outOfStockCount);
        return {
          shoe,
          colourLabel: getColourLabel(shoeVariants),
          sizesInStockLabel: getSizesInStockLabel(shoeVariants),
          totalStock,
          category,
          statusLabel: getStatusLabel(category, outOfStockCount),
        };
      })
      .filter((row) => statusFilter === 'All' || row.category === statusFilter)
      .sort((a, b) => a.totalStock - b.totalStock);
  }, [shoes, variants, searchTerm, brandFilter, statusFilter]);

  const selectedVariants = useMemo(
    () => (selectedShoe ? variants.filter((v) => v.shoe?.shoeId === selectedShoe.id) : []),
    [selectedShoe, variants]
  );

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory</h1>
          <p className="admin-page-subtitle">Manage stock levels and available sizes for every product.</p>
        </div>
      </div>

      <div className="inventory-toolbar-card">
        <div className="inventory-toolbar-left">
          <div className="inventory-search-box">
            <Search size={16} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by product name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="inventory-toolbar-right">
          <div className="inventory-filter-item">
            <label htmlFor="inv-brand-filter" className="inventory-filter-label">
              Brand:
            </label>
            <select
              id="inv-brand-filter"
              className="inventory-filter-select"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === 'All' ? 'All Brands' : b}
                </option>
              ))}
            </select>
          </div>

          <div className="inventory-filter-item">
            <label htmlFor="inv-status-filter" className="inventory-filter-label">
              Status:
            </label>
            <select
              id="inv-status-filter"
              className="inventory-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StockCategory | 'All')}
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="inventory-table-card">
        <div className="inv-table-responsive">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Shoe</th>
                <th>Colour</th>
                <th>Sizes in Stock</th>
                <th>Total Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="inv-product-cell">
                        <Skeleton variant="rounded" width={44} height={44} animation="wave" />
                        <div className="inv-product-info">
                          <Skeleton variant="text" width={140} animation="wave" />
                          <Skeleton variant="text" width={70} height={14} animation="wave" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <Skeleton variant="text" width={70} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={130} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={60} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="rounded" width={90} height={22} animation="wave" sx={{ borderRadius: '99px' }} />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="inventory-empty-row inventory-empty-row-error">
                    <AlertCircle size={16} />
                    <span>Unable to load inventory from the server.</span>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="inventory-empty-row">
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                rows.map(({ shoe, colourLabel, sizesInStockLabel, totalStock, category, statusLabel }) => (
                  <tr
                    key={shoe.id}
                    className="inventory-row"
                    onClick={() => setSelectedShoe(shoe)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedShoe(shoe);
                      }
                    }}
                  >
                    <td>
                      <div className="inv-product-cell">
                        <div className="inv-product-thumb">
                          <ProductImage src={shoe.image} alt={shoe.name} />
                        </div>
                        <div className="inv-product-info">
                          <span className="inv-product-name">{shoe.name}</span>
                          <span className="inv-product-brand">{shoe.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="inv-text-sm">{colourLabel}</td>
                    <td className="inv-text-sm inv-sizes-cell">{sizesInStockLabel}</td>
                    <td className="inv-text-sm inv-font-semibold">{totalStock} units</td>
                    <td>
                      <span className={`inv-status-pill ${getStatusBadgeClass(category)}`}>
                        <span className="inv-status-dot" />
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InventoryDrawer
        shoe={selectedShoe}
        variants={selectedVariants}
        isOpen={selectedShoe !== null}
        onClose={() => setSelectedShoe(null)}
        onChanged={refreshVariants}
      />
    </div>
  );
};

export default Inventory;
