import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { BackendShoe, createShoe } from '../../../services/shoeService';
import './AddShoeModal.css';

export interface AddShoeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShoeCreated: () => Promise<void> | void;
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

interface FormDataState {
  shoeId: string;
  shoeName: string;
  brand: string;
  category: string;
  gender: string;
  description: string;
  basePrice: string;
  salePrice: string;
  salePercentage: string;
  imageUrls: string[];
}

const INITIAL_FORM: FormDataState = {
  shoeId: '',
  shoeName: '',
  brand: 'Nike',
  category: 'Sneaker',
  gender: 'Unisex',
  description: '',
  basePrice: '',
  salePrice: '',
  salePercentage: '',
  imageUrls: [''],
};

export const AddShoeModal: React.FC<AddShoeModalProps> = ({
  isOpen,
  onClose,
  onShoeCreated,
}) => {
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    setFieldErrors({});
    setServerError(null);
  }, []);

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

  const handleImageUrlChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.imageUrls];
      updated[index] = value;
      return { ...prev, imageUrls: updated };
    });
  };

  const handleAddImageUrlField = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ''],
    }));
  };

  const handleRemoveImageUrlField = (index: number) => {
    if (formData.imageUrls.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.shoeId.trim()) {
      errors.shoeId = 'Shoe ID / SKU is required (e.g. NIKE-015).';
    }

    if (!formData.shoeName.trim()) {
      errors.shoeName = 'Shoe name is required.';
    }

    const basePriceNum = parseFloat(formData.basePrice);
    if (!formData.basePrice || isNaN(basePriceNum) || basePriceNum <= 0) {
      errors.basePrice = 'Base price is required and must be greater than 0.';
    }

    if (formData.salePrice.trim() !== '') {
      const salePriceNum = parseFloat(formData.salePrice);
      if (isNaN(salePriceNum) || salePriceNum < 0) {
        errors.salePrice = 'Sale price cannot be negative.';
      } else if (!isNaN(basePriceNum) && basePriceNum > 0 && salePriceNum >= basePriceNum) {
        errors.salePrice = 'Sale price must be less than base price.';
      }
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

    setIsSubmitting(true);

    try {
      const parsedBasePrice = parseFloat(formData.basePrice);
      const parsedSalePrice =
        formData.salePrice.trim() !== '' ? parseFloat(formData.salePrice) : undefined;
      const parsedSalePercentage =
        formData.salePercentage.trim() !== '' ? parseFloat(formData.salePercentage) : undefined;

      const cleanedImageUrls = formData.imageUrls
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const payload: BackendShoe = {
        shoeId: formData.shoeId.trim(),
        brand: formData.brand,
        shoeName: formData.shoeName.trim(),
        category: formData.category,
        description: formData.description.trim(),
        gender: formData.gender,
        basePrice: parsedBasePrice,
        salePrice: parsedSalePrice,
        salePercentage: parsedSalePercentage,
        imageUrls: cleanedImageUrls,
      };

      const result = await createShoe(payload);
      if (!result) {
        throw new Error('Unable to create shoe. The server did not return the saved product.');
      }

      await onShoeCreated();
      resetForm();
      onClose();
    } catch (err: unknown) {
      console.error('AddShoeModal creation error:', err);
      let message =
        'Unable to create shoe. A shoe with this ID may already exist. Please check the product information and try again.';

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
              Add New Shoe
            </h2>
            <p className="modal-subtitle">
              Create a new product listing for the TekkieStore catalogue.
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
              <strong>Creation Failed:</strong> {serverError}
            </div>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="admin-modal-form" noValidate>
          <div className="modal-form-scrollable">
            {/* Row 1: Shoe ID & Shoe Name */}
            <div className="form-grid-row">
              <div className="form-group">
                <label htmlFor="shoeId">
                  Shoe ID / SKU <span className="required-star">*</span>
                </label>
                <input
                  id="shoeId"
                  name="shoeId"
                  type="text"
                  placeholder="e.g. NIKE-015"
                  value={formData.shoeId}
                  onChange={handleInputChange}
                  className={fieldErrors.shoeId ? 'input-error' : ''}
                  disabled={isSubmitting}
                  required
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
                <label htmlFor="salePrice">Sale Price (R)</label>
                <input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Optional discounted price"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  className={fieldErrors.salePrice ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
                {fieldErrors.salePrice && (
                  <span className="field-error-msg">{fieldErrors.salePrice}</span>
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
                  placeholder="e.g. 20"
                  value={formData.salePercentage}
                  onChange={handleInputChange}
                  className={fieldErrors.salePercentage ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
                {fieldErrors.salePercentage && (
                  <span className="field-error-msg">{fieldErrors.salePercentage}</span>
                )}
              </div>
            </div>

            {/* Row 5: Image URLs */}
            <div className="form-group form-images-section">
              <div className="images-header">
                <label>Product Images (Cloudinary / Web URLs)</label>
                <span className="images-hint">Add one or more direct image links</span>
              </div>

              <div className="image-inputs-list">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="image-input-row">
                    <span className="image-row-number">#{index + 1}</span>
                    <input
                      type="url"
                      placeholder="https://res.cloudinary.com/..."
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      disabled={isSubmitting}
                      aria-label={`Image URL ${index + 1}`}
                    />
                    {formData.imageUrls.length > 1 && (
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImageUrlField(index)}
                        disabled={isSubmitting}
                        title="Remove image URL"
                        aria-label={`Remove image URL ${index + 1}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="add-image-btn"
                onClick={handleAddImageUrlField}
                disabled={isSubmitting}
              >
                <Plus size={15} />
                <span>Add Another Image</span>
              </button>
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
                  <span>Adding Shoe...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Add Shoe</span>
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
