import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchAllShoes } from '../services/shoeService';
import { ShoeBrand, ShoeCategory, ShoeProduct, RouteMode } from '../types/catalogue';
import { CatalogueFilters } from '../components/catalogue/CatalogueFilters';
import { CatalogueToolbar } from '../components/catalogue/CatalogueToolbar';
import { CatalogueProductCard } from '../components/catalogue/CatalogueProductCard';
import { CataloguePagination } from '../components/catalogue/CataloguePagination';
import { X, SearchX } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../components/catalogue/CataloguePage.css';

const MIN_PRICE = 1000;
const MAX_PRICE = 4000;
const ITEMS_PER_PAGE = 12;

export const CataloguePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mainColRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // Determine current route mode
  const routeMode: RouteMode = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('men') && !path.includes('women')) return 'men';
    if (path.includes('women')) return 'women';
    if (path.includes('kids')) return 'kids';
    if (path.includes('new-drops') || path.includes('drops')) return 'new-drops';
    return 'all';
  }, [location.pathname]);

  // Dynamic Context-Aware Header
  const headerContent = useMemo(() => {
    switch (routeMode) {
      case 'men':
        return {
          eyebrow: "Men's Footwear",
          title: "MEN'S ROTATION",
          subtitle: 'Engineered for performance, comfort, and timeless street style.',
        };
      case 'women':
        return {
          eyebrow: "Women's Footwear",
          title: "WOMEN'S COLLECTION",
          subtitle: 'Your next statement pair starts here. Premium silhouettes and elevated platforms.',
        };
      case 'kids':
        return {
          eyebrow: "Kids' Footwear",
          title: "KIDS' ROTATION",
          subtitle: 'Everyday comfort, durability, and playful style for the next generation.',
        };
      case 'new-drops':
        return {
          eyebrow: 'Just Landed',
          title: 'NEW DROPS',
          subtitle: 'The freshest silhouettes and latest colourways across top global brands.',
        };
      case 'all':
      default:
        return {
          eyebrow: 'Complete Collection',
          title: 'THE CATALOGUE',
          subtitle: 'Explore our full vault of premium sneakers, casual essentials, and trainers.',
        };
    }
  }, [routeMode]);

  // Sidebar Filter States
  const [selectedBrands, setSelectedBrands] = useState<ShoeBrand[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ShoeCategory[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [currentMaxPrice, setCurrentMaxPrice] = useState<number>(MAX_PRICE);
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('latest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search Query from URL parameter
  const searchQuery = searchParams.get('search') || '';

  // Brand pre-selection from URL parameter (?brand=Nike)
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      const normalised = brandParam.trim() as ShoeBrand;
      setSelectedBrands([normalised]);
      // Remove the ?brand= param from the URL so the filter panel is the source of truth
      const next = new URLSearchParams(searchParams);
      next.delete('brand');
      setSearchParams(next, { replace: true });
      setCurrentPage(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter Toggle Handlers (all automatically reset to page 1)
  const handleToggleBrand = (brand: ShoeBrand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleToggleCategory = (cat: ShoeCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handleChangeMaxPrice = (price: number) => {
    setCurrentMaxPrice(price);
    setCurrentPage(1);
  };

  const handleChangeSort = (sort: 'latest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc') => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setCurrentMaxPrice(MAX_PRICE);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    searchParams.delete('search');
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    currentMaxPrice < MAX_PRICE;

  const activeFilterCount =
    selectedBrands.length +
    selectedCategories.length +
    selectedSizes.length +
    (currentMaxPrice < MAX_PRICE ? 1 : 0);

  // Live Shoes from Spring Boot REST API
  const [allProducts, setAllProducts] = useState<ShoeProduct[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchAllShoes().then((shoes) => {
      if (isMounted) {
        setAllProducts(shoes);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. BASE ROUTE PRODUCTS
  const baseProducts = useMemo(() => {
    switch (routeMode) {
      case 'men':
        return allProducts.filter((p) => p.gender === 'Men' || p.gender === 'Unisex');
      case 'women':
        return allProducts.filter((p) => p.gender === 'Women' || p.gender === 'Unisex');
      case 'kids':
        return allProducts.filter((p) => p.gender === 'Kids');
      case 'new-drops':
        return allProducts.filter((p) => Boolean(p.isNewDrop));
      case 'all':
      default:
        return allProducts;
    }
  }, [allProducts, routeMode]);

  // 2. APPLY SIDEBAR FILTERS & SEARCH ON TOP OF BASE ROUTE PRODUCTS
  const filteredProducts = useMemo(() => {
    return baseProducts.filter((product) => {
      // Brand filter (case-insensitive)
      if (
        selectedBrands.length > 0 &&
        !selectedBrands.some((b) => b.toLowerCase() === product.brand.toLowerCase())
      ) {
        return false;
      }

      // Category filter (case-insensitive)
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.some((c) => c.toLowerCase() === product.category.toLowerCase())
      ) {
        return false;
      }

      // Size filter (must match at least one selected size)
      if (
        selectedSizes.length > 0 &&
        !selectedSizes.some((sz) => product.sizes.includes(sz))
      ) {
        return false;
      }

      // Price filter
      if (product.price > currentMaxPrice) {
        return false;
      }

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesColour = product.colour.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);

        if (!matchesName && !matchesBrand && !matchesCategory && !matchesColour && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [baseProducts, selectedBrands, selectedCategories, selectedSizes, currentMaxPrice, searchQuery]);

  // 3. APPLY SORTING (BEFORE PAGINATION)
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'latest':
      default:
        // New drops priority, then stable order
        return list.sort((a, b) => {
          if (a.isNewDrop && !b.isNewDrop) return -1;
          if (!a.isNewDrop && b.isNewDrop) return 1;
          return 0;
        });
    }
  }, [filteredProducts, sortBy]);

  // 4. CALCULATE PAGINATION
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  // Safely derive active page without cascading effects
  const activePage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1;

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedProducts, startIndex]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Smooth scroll back to top of product grid
    if (mainColRef.current) {
      const topOffset = mainColRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  };

  // Close mobile filter when resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileFiltersOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProductCardClick = (product: ShoeProduct) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="catalogue-page">
      {/* CATALOGUE HEADER SECTION */}
      <section className="catalogue-header-section">
        <div className="catalogue-container">
          <div className="catalogue-header-content">
            <span className="catalogue-eyebrow">{headerContent.eyebrow}</span>
            <h1 className="catalogue-main-title">{headerContent.title}</h1>
            <p className="catalogue-header-subtitle">{headerContent.subtitle}</p>
          </div>
        </div>
      </section>

      {/* CATALOGUE BODY SECTION */}
      <section className="catalogue-body-section">
        <div className="catalogue-container">
          <div className="catalogue-layout">
            {/* DESKTOP FILTER SIDEBAR */}
            <div className="catalogue-sidebar-col">
              <CatalogueFilters
                selectedBrands={selectedBrands}
                onToggleBrand={handleToggleBrand}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                selectedSizes={selectedSizes}
                onToggleSize={handleToggleSize}
                minPrice={MIN_PRICE}
                maxPrice={MAX_PRICE}
                currentMaxPrice={currentMaxPrice}
                onChangeMaxPrice={handleChangeMaxPrice}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="catalogue-main-col" ref={mainColRef}>
              {/* TOOLBAR */}
              <CatalogueToolbar
                displayedCount={paginatedProducts.length}
                filteredCount={sortedProducts.length}
                currentPage={activePage}
                totalPages={totalPages}
                sortBy={sortBy}
                onChangeSort={handleChangeSort}
                selectedBrands={selectedBrands}
                onRemoveBrand={handleToggleBrand}
                selectedCategories={selectedCategories}
                onRemoveCategory={handleToggleCategory}
                selectedSizes={selectedSizes}
                onRemoveSize={handleToggleSize}
                searchQuery={searchQuery}
                onClearSearch={handleClearSearch}
                onOpenMobileFilters={() => setMobileFiltersOpen(true)}
                activeFilterCount={activeFilterCount}
              />

              {/* PRODUCT GRID OR EMPTY STATE */}
              {paginatedProducts.length > 0 ? (
                <>
                  <div className="catalogue-product-grid">
                    {paginatedProducts.map((product) => (
                      <CatalogueProductCard
                        key={product.id}
                        product={product}
                        onClick={handleProductCardClick}
                        onQuickAdd={addToCart}
                      />
                    ))}
                  </div>

                  {/* PAGINATION CONTROLS */}
                  <CataloguePagination
                    currentPage={activePage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="catalogue-empty-state">
                  <div className="empty-state-icon-wrapper">
                    <SearchX size={44} strokeWidth={1.5} />
                  </div>
                  <h2 className="empty-state-title">NO PAIRS FOUND</h2>
                  <p className="empty-state-text">
                    We couldn't find any shoes matching your selected filters in this collection.
                  </p>
                  <div className="empty-state-actions">
                    {hasActiveFilters && (
                      <button
                        type="button"
                        className="btn-reset-filters"
                        onClick={handleClearFilters}
                      >
                        Reset Sidebar Filters
                      </button>
                    )}
                    {searchQuery && (
                      <button
                        type="button"
                        className="btn-reset-search"
                        onClick={handleClearSearch}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* MOBILE FILTERS DRAWER / MODAL */}
      {mobileFiltersOpen && (
        <div className="mobile-filter-overlay" onClick={() => setMobileFiltersOpen(false)}>
          <div
            className="mobile-filter-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Filter Options"
          >
            <div className="mobile-filter-header">
              <span className="mobile-filter-heading">FILTERS</span>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={22} />
              </button>
            </div>
            <div className="mobile-filter-body">
              <CatalogueFilters
                selectedBrands={selectedBrands}
                onToggleBrand={handleToggleBrand}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                selectedSizes={selectedSizes}
                onToggleSize={handleToggleSize}
                minPrice={MIN_PRICE}
                maxPrice={MAX_PRICE}
                currentMaxPrice={currentMaxPrice}
                onChangeMaxPrice={handleChangeMaxPrice}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                onCloseMobile={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
