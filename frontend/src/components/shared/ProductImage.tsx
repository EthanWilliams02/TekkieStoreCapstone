import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import './ProductImage.css';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

// Renders the product image straight from the database URL.
// If the URL fails to load, shows a plain "Image unavailable" placeholder
// instead of swapping in an unrelated local photo.
export const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = '', loading }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`product-image-placeholder ${className}`}>
        <ImageOff size={24} />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
};
