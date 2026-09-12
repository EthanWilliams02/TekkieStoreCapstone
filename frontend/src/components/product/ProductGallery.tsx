import React from 'react';
import { Heart } from 'lucide-react';
import { ShoeProduct } from '../../types/catalogue';
import { getShoeGalleryImages } from '../../utils/productImages';
import { ProductImage } from '../shared/ProductImage';
import './ProductGallery.css';

interface ProductGalleryProps {
  product: ShoeProduct;
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  selectedImageIndex,
  onSelectImage,
  isWishlisted,
  onToggleWishlist,
}) => {
  const galleryImages = getShoeGalleryImages(product);
  const currentImage = galleryImages[selectedImageIndex] || galleryImages[0];

  return (
    <div className="product-gallery" aria-label="Product Image Gallery">
      {/* MAIN LARGE PRODUCT IMAGE */}
      <div className="main-image-container">
        {/* Product Tag / Badge */}
        {product.isOnSale ? (
          <span className="product-gallery-tag tag-sale">SALE</span>
        ) : product.tag ? (
          <span className={`product-gallery-tag ${product.tag === 'JUST DROPPED' ? 'tag-orange' : ''}`}>
            {product.tag}
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          type="button"
          className={`gallery-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={onToggleWishlist}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={22}
            className="gallery-wishlist-icon"
            fill={isWishlisted ? 'var(--brand-orange)' : 'none'}
            color={isWishlisted ? 'var(--brand-orange)' : 'var(--obsidian)'}
          />
        </button>

        {/* Main Image */}
        <div className="main-image-viewport">
          <ProductImage
            key={currentImage.url}
            src={currentImage.url}
            alt={`${product.brand} ${product.name} - ${currentImage.label}`}
            className="main-gallery-image"
          />
        </div>

        {/* Current View Label */}
        <span className="view-indicator-badge">{currentImage.label}</span>
      </div>

      {/* THREE THUMBNAIL SWITCHERS */}
      <div className="gallery-thumbnails-row" role="tablist" aria-label="Shoe image perspectives">
        {galleryImages.slice(0, 3).map((img, index) => {
          const isSelected = index === selectedImageIndex;
          return (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`gallery-thumbnail-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectImage(index)}
              title={img.label}
              aria-label={`View ${img.label}`}
            >
              <ProductImage
                src={img.url}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="thumbnail-img"
              />
              <span className="thumbnail-label">{img.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
