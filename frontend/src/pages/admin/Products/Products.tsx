import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useShoes } from '../../../hooks/useShoes';
import { formatPrice } from '../../../utils/formatters';
import { ProductImage } from '../../../components/shared/ProductImage';
import { ProductToolbar } from '../../../components/admin/products/ProductToolbar';
import { AddShoeModal } from '../../../components/admin/products/AddShoeModal';
import { Plus, SearchX, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import './Products.css';

export const Products: React.FC = () => {
  const { shoes, loading, error, refresh } = useShoes();
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [showAddShoeModal, setShowAddShoeModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Auto-dismiss success notification after 4 seconds
  useEffect(() => {
    if (!successToast) return;
    const timer = setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [successToast]);

  // Normalized instant search + brand filter logic
  const filtered = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return shoes.filter((shoe) => {
      const matchesSearch =
        !normalizedSearch ||
        shoe.name?.toLowerCase().includes(normalizedSearch) ||
        shoe.brand?.toLowerCase().includes(normalizedSearch) ||
        shoe.id?.toLowerCase().includes(normalizedSearch);

      const matchesBrand =
        brandFilter === 'All' || shoe.brand === brandFilter;

      return matchesSearch && matchesBrand;
    });
  }, [shoes, searchTerm, brandFilter]);

  // Derive unique brands from loaded catalogue, preserving 'All' at index 0
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(
      new Set(shoes.map((s) => s.brand).filter(Boolean))
    ).sort();
    return ['All', ...uniqueBrands];
  }, [shoes]);

  // Handler invoked by AddShoeModal on successful product creation
  const handleShoeCreated = useCallback(async () => {
    await refresh();
    setSuccessToast('Shoe added successfully.');
  }, [refresh]);

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products Catalogue</h1>
          <p className="admin-page-subtitle">
            Manage sneaker listings, pricing and availability
          </p>
        </div>

        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setShowAddShoeModal(true)}
          id="add-new-shoe-btn"
        >
          <Plus size={18} />
          <span>Add New Shoe</span>
        </button>
      </div>

      {/* Success Feedback Banner */}
      {successToast && (
        <div className="admin-toast-banner success" role="status" aria-live="polite">
          <div className="toast-left">
            <CheckCircle2 size={18} className="toast-icon success" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setSuccessToast(null)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Error Banner with Retry */}
      {error && (
        <div className="admin-toast-banner error" role="alert">
          <div className="toast-left">
            <AlertCircle size={18} className="toast-icon error" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            className="admin-btn-secondary toast-retry-btn"
            onClick={() => refresh()}
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Componentized Search & Filter Toolbar */}
      <ProductToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        brandFilter={brandFilter}
        onBrandFilterChange={setBrandFilter}
        brands={brands}
        totalCount={shoes.length}
        filteredCount={filtered.length}
      />

      {/* Products Table / State Container */}
      <div className="dashboard-card">
        {loading ? (
          <div className="admin-loading-state">
            <RefreshCw size={24} className="spinning loading-icon" />
            <span>Loading product catalogue...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-table-empty-state">
            <SearchX size={44} className="empty-state-icon" />
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-subtitle">
              Try changing your search or brand filter.
            </p>
            <div className="empty-state-actions">
              {searchTerm && (
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
              {brandFilter !== 'All' && (
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setBrandFilter('All')}
                >
                  Reset Brand Filter
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Gender</th>
                  <th>Base Price</th>
                  <th>Sale Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((shoe) => (
                  <tr key={shoe.id}>
                    <td>
                      <div className="admin-prod-cell">
                        <div className="admin-prod-img-box">
                          <ProductImage src={shoe.image} alt={shoe.name} />
                        </div>
                        <div className="admin-prod-info">
                          <span className="font-semibold text-obsidian">{shoe.name}</span>
                          <span className="text-muted text-sm">ID: {shoe.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{shoe.brand}</td>
                    <td>{shoe.category}</td>
                    <td>{shoe.gender}</td>
                    <td className="font-semibold text-obsidian">{formatPrice(shoe.price)}</td>
                    <td>
                      {shoe.isOnSale ? (
                        <span className="status-pill status-badge-processing">
                          {shoe.salePercentage}% OFF
                        </span>
                      ) : (
                        <span className="status-pill stock-badge-in">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Shoe Modal Component */}
      <AddShoeModal
        isOpen={showAddShoeModal}
        onClose={() => setShowAddShoeModal(false)}
        onShoeCreated={handleShoeCreated}
      />
    </div>
  );
};

export default Products;
