import React, { useEffect, useState } from 'react';
import { X, PackagePlus, Check, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ShoeProduct } from '../../../types/catalogue';
import { ShoeVariant } from '../../../types/shoeVariant';
import { shoeVariantService } from '../../../services/shoeVariantService';
import { ProductImage } from '../../shared/ProductImage';
import './InventoryDrawer.css';

interface InventoryDrawerProps {
  shoe: ShoeProduct | null;
  variants: ShoeVariant[];
  isOpen: boolean;
  onClose: () => void;
  onChanged: () => Promise<unknown> | void;
}

const SIZE_REGION = 'UK';

// Mirrors ShoeVariantDataInitializer.formatSizeLabel on the backend, so IDs
// generated here match the existing "SHOEID-UK9" / "SHOEID-UK9_5" convention.
const formatSizeLabel = (size: number): string =>
  Number.isInteger(size) ? String(size) : String(size).replace('.', '_');

const buildVariantId = (shoeId: string, sizeRegion: string, sizeValue: number): string =>
  `${shoeId}-${sizeRegion}${formatSizeLabel(sizeValue)}`;

interface EditableRow {
  variantId: string;
  size: { sizeValue: number; sizeRegion: string };
  colour: string;
  stockQuantity: number;
  dirty: boolean;
  saving: boolean;
}

const toRows = (variants: ShoeVariant[]): EditableRow[] =>
  [...variants]
    .sort((a, b) => a.size.sizeValue - b.size.sizeValue)
    .map((v) => ({
      variantId: v.variantId,
      size: { sizeValue: v.size.sizeValue, sizeRegion: v.size.sizeRegion },
      colour: v.colour,
      stockQuantity: v.stockQuantity,
      dirty: false,
      saving: false,
    }));

const InventoryDrawerContent: React.FC<{
  shoe: ShoeProduct;
  variants: ShoeVariant[];
  onClose: () => void;
  onChanged: () => Promise<unknown> | void;
}> = ({ shoe, variants, onClose, onChanged }) => {
  const [rows, setRows] = useState<EditableRow[]>(() => toRows(variants));
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [newSizeValue, setNewSizeValue] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [adding, setAdding] = useState(false);

  // Colour isn't asked for when adding a size — a shoe only ever has one
  // colourway in this data model, so a new size just inherits it (falling
  // back to a sensible default if this is the shoe's very first variant).
  const colourForNewSize = rows[0]?.colour?.trim() || 'Original';

  const totalStock = rows.reduce((sum, r) => sum + r.stockQuantity, 0);

  const updateRow = (variantId: string, patch: Partial<EditableRow>) => {
    setRows((prev) => prev.map((r) => (r.variantId === variantId ? { ...r, ...patch, dirty: true } : r)));
  };

  const handleSaveRow = async (row: EditableRow) => {
    setRows((prev) => prev.map((r) => (r.variantId === row.variantId ? { ...r, saving: true } : r)));
    setFeedback(null);
    try {
      const result = await shoeVariantService.updateVariant({
        variantId: row.variantId,
        shoe: { shoeId: shoe.id },
        size: row.size,
        colour: row.colour,
        stockQuantity: row.stockQuantity,
      } as ShoeVariant);
      if (!result) throw new Error('No response');
      setRows((prev) => prev.map((r) => (r.variantId === row.variantId ? { ...r, dirty: false, saving: false } : r)));
      setFeedback({ type: 'success', message: `Updated ${row.size.sizeRegion} ${row.size.sizeValue}.` });
      await onChanged();
    } catch {
      setRows((prev) => prev.map((r) => (r.variantId === row.variantId ? { ...r, saving: false } : r)));
      setFeedback({ type: 'error', message: 'Failed to save — check your connection and try again.' });
    }
  };

  const handleDeleteRow = async (row: EditableRow) => {
    if (!window.confirm(`Remove ${row.size.sizeRegion} ${row.size.sizeValue} from ${shoe.name}?`)) return;
    setRows((prev) => prev.map((r) => (r.variantId === row.variantId ? { ...r, saving: true } : r)));
    setFeedback(null);
    const ok = await shoeVariantService.deleteVariant(row.variantId);
    if (ok) {
      setRows((prev) => prev.filter((r) => r.variantId !== row.variantId));
      setFeedback({ type: 'success', message: `Removed ${row.size.sizeRegion} ${row.size.sizeValue}.` });
      await onChanged();
    } else {
      setRows((prev) => prev.map((r) => (r.variantId === row.variantId ? { ...r, saving: false } : r)));
      setFeedback({ type: 'error', message: 'Failed to remove — check your connection and try again.' });
    }
  };

  const handleAddSize = async (e: React.FormEvent) => {
    e.preventDefault();

    const sizeValue = parseFloat(newSizeValue);
    const quantity = parseInt(newQuantity, 10);

    if (!newSizeValue || Number.isNaN(sizeValue) || sizeValue <= 0) {
      setFeedback({ type: 'error', message: 'Enter a valid size.' });
      return;
    }
    if (!newQuantity || Number.isNaN(quantity) || quantity < 0) {
      setFeedback({ type: 'error', message: 'Enter a valid quantity (0 or more).' });
      return;
    }

    const variantId = buildVariantId(shoe.id, SIZE_REGION, sizeValue);
    if (rows.some((r) => r.variantId === variantId)) {
      setFeedback({ type: 'error', message: `${SIZE_REGION} ${sizeValue} is already configured for this product.` });
      return;
    }

    setAdding(true);
    setFeedback(null);
    try {
      const created = await shoeVariantService.createVariant({
        variantId,
        shoe: { shoeId: shoe.id },
        size: { sizeValue, sizeRegion: SIZE_REGION },
        colour: colourForNewSize,
        stockQuantity: quantity,
      } as ShoeVariant);

      if (!created) throw new Error('No response');

      setRows((prev) =>
        [
          ...prev,
          {
            variantId,
            size: { sizeValue, sizeRegion: SIZE_REGION },
            colour: colourForNewSize,
            stockQuantity: quantity,
            dirty: false,
            saving: false,
          },
        ].sort((a, b) => a.size.sizeValue - b.size.sizeValue)
      );
      setNewSizeValue('');
      setNewQuantity('');
      setFeedback({ type: 'success', message: `Added ${SIZE_REGION} ${sizeValue}.` });
      await onChanged();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to add size — check your connection and try again.' });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="inventory-drawer-panel"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Manage stock for ${shoe.name}`}
    >
      <header className="inventory-drawer-header">
        <div className="inventory-drawer-thumb">
          <ProductImage src={shoe.image} alt={shoe.name} />
        </div>
        <div className="inventory-drawer-title-block">
          <h2 className="inventory-drawer-title">{shoe.name}</h2>
          <p className="inventory-drawer-subtitle">
            {shoe.brand} &middot; {totalStock} units across {rows.length} size{rows.length === 1 ? '' : 's'}
          </p>
        </div>
        <button type="button" className="inventory-drawer-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      </header>

      <div className="inventory-drawer-body">
        {feedback && (
          <div className={`inventory-drawer-feedback ${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <section className="inventory-drawer-section">
          <h3 className="inventory-drawer-section-title">Sizes &amp; Stock</h3>

          {rows.length === 0 ? (
            <p className="inventory-empty-note">No sizes configured yet — add the first one below.</p>
          ) : (
            <table className="inventory-variant-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Colour</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.variantId}>
                    <td className="inventory-size-cell">
                      {row.size.sizeRegion} {row.size.sizeValue}
                    </td>
                    <td className="inventory-colour-cell">{row.colour}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        value={row.stockQuantity}
                        onChange={(e) =>
                          updateRow(row.variantId, { stockQuantity: Math.max(0, parseInt(e.target.value, 10) || 0) })
                        }
                        className={`inventory-inline-input inventory-qty-input ${row.stockQuantity <= 0 ? 'zero-stock' : ''}`}
                        disabled={row.saving}
                      />
                    </td>
                    <td>
                      {row.stockQuantity <= 0 && <span className="inventory-row-status-pill">Out of Stock</span>}
                    </td>
                    <td className="inventory-row-actions">
                      <button
                        type="button"
                        className="inventory-icon-btn save"
                        onClick={() => handleSaveRow(row)}
                        disabled={!row.dirty || row.saving}
                        title="Save changes"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        className="inventory-icon-btn delete"
                        onClick={() => handleDeleteRow(row)}
                        disabled={row.saving || row.stockQuantity > 0}
                        title={row.stockQuantity > 0 ? 'Reduce quantity to 0 before removing this size' : 'Remove this size'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="inventory-drawer-section">
          <h3 className="inventory-drawer-section-title">Add a Size</h3>
          <form className="inventory-add-form" onSubmit={handleAddSize}>
            <div className="inventory-form-group">
              <label htmlFor="inv-new-size">Size (UK)</label>
              <input
                id="inv-new-size"
                type="number"
                step="0.5"
                min="0"
                value={newSizeValue}
                onChange={(e) => setNewSizeValue(e.target.value)}
                placeholder="e.g. 9 or 9.5"
              />
            </div>
            <div className="inventory-form-group">
              <label htmlFor="inv-new-qty">Quantity</label>
              <input
                id="inv-new-qty"
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="0"
              />
            </div>
            <button type="submit" className="inventory-add-btn" disabled={adding}>
              <PackagePlus size={16} />
              <span>{adding ? 'Adding...' : 'Add Size'}</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({ shoe, variants, isOpen, onClose, onChanged }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !shoe) return null;

  return (
    <div className="inventory-drawer-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <InventoryDrawerContent key={shoe.id} shoe={shoe} variants={variants} onClose={onClose} onChanged={onChanged} />
    </div>
  );
};

export default InventoryDrawer;
