import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Plus, Trash2, AlertCircle, Loader2, UploadCloud, Star } from 'lucide-react';
import { BackendShoe, createShoe, updateShoe, uploadShoeImage } from '../../../services/shoeService';
import { ShoeProduct } from '../../../types/catalogue';
import { formatPrice } from '../../../utils/formatters';
import { ProductImage } from '../../shared/ProductImage';
import './AddShoeModal.css';

export interface AddShoeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  /** Existing catalogue - used to work out the next Shoe ID for the chosen brand. */
  shoes: ShoeProduct[];
  /** Present -> the modal edits this shoe instead of creating a new one. */
  editingShoe?: ShoeProduct | null;
}

const SUPPORTED_BRANDS = [
  'Nike',
  'adidas',
  'PUMA',
  'New Balance',
  'Converse',
  'Vans',
  'Asics',
  'Reebok',
] as const;

const SUPPORTED_CATEGORIES = ['Sneaker', 'Casual', 'Trainer'] as const;
const SUPPORTED_GENDERS = ['Men', 'Women', 'Unisex'] as const;
const MAX_IMAGES = 3;

// Matches the prefixes already live in the database (ADI-/NIKE-/PUM-) and
// extends the convention to the other brands the catalogue supports.
const BRAND_PREFIXES: Record<string, string> = {
  Nike: 'NIKE',
  adidas: 'ADI',
  PUMA: 'PUM',
  'New Balance': 'NB',
  Converse: 'CONV',
  Vans: 'VANS',
  Asics: 'ASICS',
  Reebok: 'REEB',
};

// Shoe IDs aren't something an admin should have to make up — they just
// increment off whatever already exists for that brand (e.g. NIKE-017 -> NIKE-018).
const getNextShoeId = (brand: string, existingShoes: ShoeProduct[]): string => {
  const prefix = BRAND_PREFIXES[brand] || brand.slice(0, 4).toUpperCase();
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  let maxNum = 0;
  existingShoes.forEach((s) => {
    const match = s.id.match(pattern);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
};

// Mirrors Shoe.Builder.setSale() on the backend — the real create/update REST
// endpoints save whatever salePrice is sent as-is, they don't derive it, so
// the frontend has to do this calculation itself rather than let an admin
// type in a number that could drift from the percentage.
const computeSalePrice = (basePriceStr: string, salePercentageStr: string): number => {
  const basePrice = parseFloat(basePriceStr);
  const salePercentage = parseFloat(salePercentageStr);
  if (!basePrice || basePrice <= 0 || !salePercentage || salePercentage <= 0) return 0;
  const clampedPct = Math.min(Math.max(salePercentage, 0), 100);
  // Rounded to the nearest whole Rand — no cents — so the value saved to the
  // backend matches exactly what formatPrice() shows everywhere else.
  return Math.round(basePrice * (1 - clampedPct / 100));
};

interface FormDataState {
  shoeName: string;
  brand: string;
  category: string;
  gender: string;
  description: string;
  basePrice: string;
  salePercentage: string;
}

const INITIAL_FORM: FormDataState = {
  shoeName: '',
  brand: 'Nike',
  category: 'Sneaker',
  gender: 'Unisex',
  description: '',
  basePrice: '',
  salePercentage: '',
};

interface ImageSlot {
  id: string;
  previewUrl: string;
  status: 'uploading' | 'done' | 'error';
  url?: string;
}

const formDataFromShoe = (shoe: ShoeProduct): FormDataState => ({
  shoeName: shoe.name,
  brand: shoe.brand,
  category: shoe.category,
  gender: shoe.gender,
  description: shoe.description,
  basePrice: String(shoe.price),
  salePercentage: shoe.salePercentage ? String(shoe.salePercentage) : '',
});

// Existing catalogue images are already hosted — they load into the same
// preview grid as a fresh upload, just pre-marked as "done" with no file to send.
const imageSlotsFromShoe = (shoe: ShoeProduct): ImageSlot[] => {
  const urls = shoe.images && shoe.images.length > 0 ? shoe.images : [shoe.image];
  return urls
    .filter(Boolean)
    .map((url, idx) => ({ id: `existing-${idx}-${url}`, previewUrl: url, status: 'done' as const, url }));
};

export const AddShoeModal: React.FC<AddShoeModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  shoes,
  editingShoe = null,
}) => {
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // In edit mode the ID is fixed (it's the primary key); otherwise it's purely
  // derived from the brand + existing catalogue, computed during render.
  const shoeId = editingShoe ? editingShoe.id : getNextShoeId(formData.brand, shoes);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImageSlot[]>([]);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    setFieldErrors({});
    setServerError(null);
    setImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      return [];
    });
  }, []);

  // This modal instance is shared between "Add" and "Edit" and never
  // unmounts (Products.tsx always renders it, just toggling isOpen) — so
  // whichever shoe is being edited has to be re-seeded on every open.
  useEffect(() => {
    if (!isOpen) return;
    if (editingShoe) {
      setFormData(formDataFromShoe(editingShoe));
      setImages(imageSlotsFromShoe(editingShoe));
    } else {
      setFormData(INITIAL_FORM);
      setImages([]);
    }
    setFieldErrors({});
    setServerError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingShoe]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }, [isSubmitting, resetForm, onClose]);

  // Handle escape key to dismiss modal safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitting, handleClose]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Uploads happen the moment a file is picked/dropped — each gets its own
  // slot with an instant local preview while the real upload runs in the
  // background, so the admin sees progress per image rather than a single
  // spinner blocking the whole form.
  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) return;

    const files = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remainingSlots);

    files.forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const previewUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, { id, previewUrl, status: 'uploading' }]);

      uploadShoeImage(file, formData.brand)
        .then((url) => {
          setImages((prev) => prev.map((img) => (img.id === id ? { ...img, status: 'done', url } : img)));
        })
        .catch((err) => {
          console.error('Image upload failed:', err);
          setImages((prev) => prev.map((img) => (img.id === id ? { ...img, status: 'error' } : img)));
        });
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  // The first image in the list is what customers see as the product's main
  // photo, so letting the admin promote any thumbnail to the front matters.
  const handleMakePrimary = (id: string) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      if (index <= 0) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFiles(false);
    if (!isSubmitting) handleFilesSelected(e.dataTransfer.files);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!shoeId.trim()) {
      errors.shoeId = 'Could not generate a Shoe ID — try reselecting the brand.';
    }

    if (!formData.shoeName.trim()) {
      errors.shoeName = 'Shoe name is required.';
    }

    const basePriceNum = parseFloat(formData.basePrice);
    if (!formData.basePrice || isNaN(basePriceNum) || basePriceNum <= 0) {
      errors.basePrice = 'Base price is required and must be greater than 0.';
    }

    if (formData.salePercentage.trim() !== '') {
      const salePctNum = parseFloat(formData.salePercentage);
      if (isNaN(salePctNum) || salePctNum < 0 || salePctNum > 100) {
        errors.salePercentage = 'Sale percentage must be between 0 and 100.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    if (images.some((img) => img.status === 'uploading')) {
      setServerError('Please wait for all images to finish uploading.');
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedBasePrice = parseFloat(formData.basePrice);
      const parsedSalePercentage = parseFloat(formData.salePercentage) || 0;
      // The backend's create/update endpoints save salePrice exactly as sent —
      // they don't derive it — so it's computed here the same way
      // Shoe.Builder.setSale() does, rather than trusting a typed-in number.
      const computedSalePrice = computeSalePrice(formData.basePrice, formData.salePercentage);

      // Order matters — the first URL becomes the product's main photo.
      const cleanedImageUrls = images
        .filter((img) => img.status === 'done' && img.url)
        .map((img) => img.url as string);

      const payload: BackendShoe = {
        shoeId: shoeId.trim(),
        brand: formData.brand,
        shoeName: formData.shoeName.trim(),
        category: formData.category,
        description: formData.description.trim(),
        gender: formData.gender,
        basePrice: parsedBasePrice,
        salePrice: computedSalePrice,
        salePercentage: parsedSalePercentage,
        imageUrls: cleanedImageUrls,
      };

      const result = editingShoe ? await updateShoe(payload) : await createShoe(payload);
      if (!result) {
        throw new Error(
          editingShoe
            ? 'Unable to save changes. The server did not return the updated product.'
            : 'Unable to create shoe. The server did not return the saved product.'
        );
      }

      await onSaved();
      resetForm();
      onClose();
    } catch (err: unknown) {
      console.error('AddShoeModal save error:', err);
      let message = editingShoe
        ? 'Unable to save changes. Please check the product information and try again.'
        : 'Unable to create shoe. A shoe with this ID may already exist. Please check the product information and try again.';

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: unknown } };
        const data = axiosErr.response?.data;
        if (typeof data === 'string' && data.trim()) {
          message = data;
        } else if (data && typeof data === 'object' && 'message' in data) {
          const m = (data as { message?: unknown }).message;
          if (typeof m === 'string') {
            message = m;
          }
        }
      } else if (err instanceof Error && err.message) {
        message = err.message;
      }

      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="admin-modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-shoe-modal-title"
    >
      <div
        className="admin-modal-card add-shoe-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div className="modal-header-text">
            <h2 id="add-shoe-modal-title" className="modal-title">
              {editingShoe ? 'Edit Shoe' : 'Add New Shoe'}
            </h2>
            <p className="modal-subtitle">
              {editingShoe
                ? `Update details for ${editingShoe.name}.`
                : 'Create a new product listing for the TekkieStore catalogue.'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="modal-error-alert" role="alert">
            <AlertCircle size={18} className="error-alert-icon" />
            <div className="error-alert-content">
              <strong>{editingShoe ? 'Save Failed:' : 'Creation Failed:'}</strong> {serverError}
            </div>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="admin-modal-form" noValidate>
          <div className="modal-form-scrollable">
            {/* Row 1: Shoe ID & Shoe Name */}
            <div className="form-grid-row">
              <div className="form-group">
                <label htmlFor="shoeId">Shoe ID / SKU</label>
                <input
                  id="shoeId"
                  name="shoeId"
                  type="text"
                  value={shoeId}
                  className={`readonly-field ${fieldErrors.shoeId ? 'input-error' : ''}`}
                  disabled
                  readOnly
                  title={editingShoe ? "A shoe's ID can't be changed" : 'Generated automatically from the selected brand'}
                />
                {fieldErrors.shoeId && (
                  <span className="field-error-msg">{fieldErrors.shoeId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="shoeName">
                  Shoe Name <span className="required-star">*</span>
                </label>
                <input
                  id="shoeName"
                  name="shoeName"
                  type="text"
                  placeholder="e.g. Air Jordan 1 Retro High"
                  value={formData.shoeName}
                  onChange={handleInputChange}
                  className={fieldErrors.shoeName ? 'input-error' : ''}
                  disabled={isSubmitting}
                  required
                />
                {fieldErrors.shoeName && (
                  <span className="field-error-msg">{fieldErrors.shoeName}</span>
                )}
              </div>
            </div>

            {/* Row 2: Brand, Category & Gender */}
            <div className="form-grid-row form-grid-3">
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  {SUPPORTED_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  {SUPPORTED_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  {SUPPORTED_GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Product design details, materials, cushioning technology..."
                value={formData.description}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Row 4: Pricing (Base Price, Sale Price, Sale Percentage) */}
            <div className="form-grid-row form-grid-3">
              <div className="form-group">
                <label htmlFor="basePrice">
                  Base Price (R) <span className="required-star">*</span>
                </label>
                <input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="2499.00"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className={fieldErrors.basePrice ? 'input-error' : ''}
                  disabled={isSubmitting}
                  required
                />
                {fieldErrors.basePrice && (
                  <span className="field-error-msg">{fieldErrors.basePrice}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="salePercentage">Sale Percentage (%)</label>
                <input
                  id="salePercentage"
                  name="salePercentage"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  placeholder="e.g. 20 (leave blank if not on sale)"
                  value={formData.salePercentage}
                  onChange={handleInputChange}
                  className={fieldErrors.salePercentage ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
                {fieldErrors.salePercentage && (
                  <span className="field-error-msg">{fieldErrors.salePercentage}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="salePrice">Sale Price (R)</label>
                <input
                  id="salePrice"
                  type="text"
                  value={
                    formData.salePercentage.trim()
                      ? formatPrice(computeSalePrice(formData.basePrice, formData.salePercentage))
                      : ''
                  }
                  placeholder="Calculated from base price + %"
                  className="readonly-field"
                  disabled
                  readOnly
                  title="Calculated automatically from base price and sale percentage"
                />
              </div>
            </div>

            {/* Row 5: Product Images (real file upload, not URL pasting) */}
            <div className="form-group form-images-section">
              <div className="images-header">
                <label>Product Images</label>
                <span className="images-hint">
                  Upload up to {MAX_IMAGES} images. The first one is used as the main product photo.
                </span>
              </div>

              {images.length > 0 && (
                <div className="image-preview-grid">
                  {images.map((img, index) => (
                    <div key={img.id} className={`image-preview-tile ${img.status}`}>
                      {img.url ? (
                        // Hosted on Cloudinary already (existing image, or upload just
                        // finished) — use the compressed transform, not the full-size original.
                        <ProductImage src={img.url} alt={`Upload ${index + 1}`} />
                      ) : (
                        // Still uploading — no hosted URL yet, so this is the local blob
                        // preview, which is already fast (no network fetch involved).
                        <img src={img.previewUrl} alt={`Upload ${index + 1}`} />
                      )}

                      {index === 0 && <span className="primary-image-badge">Main Photo</span>}

                      {img.status === 'uploading' && (
                        <div className="image-tile-overlay">
                          <Loader2 size={20} className="btn-spinner" />
                        </div>
                      )}

                      {img.status === 'error' && (
                        <div className="image-tile-overlay error">
                          <AlertCircle size={18} />
                          <span>Upload failed</span>
                        </div>
                      )}

                      <div className="image-tile-actions">
                        {index !== 0 && img.status === 'done' && (
                          <button
                            type="button"
                            className="image-tile-action-btn"
                            onClick={() => handleMakePrimary(img.id)}
                            disabled={isSubmitting}
                            title="Set as main photo"
                            aria-label="Set as main photo"
                          >
                            <Star size={13} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="image-tile-action-btn remove"
                          onClick={() => handleRemoveImage(img.id)}
                          disabled={isSubmitting}
                          title="Remove image"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {images.length < MAX_IMAGES && (
                <div
                  className={`image-upload-dropzone ${isDraggingFiles ? 'dragging' : ''}`}
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!isSubmitting) setIsDraggingFiles(true);
                  }}
                  onDragLeave={() => setIsDraggingFiles(false)}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                >
                  <UploadCloud size={22} />
                  <span>Click to upload or drag images here</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden-file-input"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                    disabled={isSubmitting}
                    aria-label="Upload product images"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn-primary submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="btn-spinner" />
                  <span>{editingShoe ? 'Saving...' : 'Adding Shoe...'}</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>{editingShoe ? 'Save Changes' : 'Add Shoe'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShoeModal;
