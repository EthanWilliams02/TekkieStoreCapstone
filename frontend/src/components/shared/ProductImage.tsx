import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { Cloudinary } from '@cloudinary/url-gen';
import { limitFit } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';
import './ProductImage.css';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

// Extracts cloud name and public ID from a Cloudinary delivery URL
const parseCloudinaryUrl = (url: string): { cloudName: string; publicId: string } | null => {
  const match = url.match(/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  if (!match) return null;
  return { cloudName: match[1], publicId: match[2] };
};

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = '', loading }) => {
  const [failed, setFailed] = useState(false);
  const parsed = src ? parseCloudinaryUrl(src) : null;

  if (!parsed || failed) {
    return (
      <div className={`product-image-placeholder ${className}`}>
        <ImageOff size={24} />
        <span>Image unavailable</span>
      </div>
    );
  }

  const cld = new Cloudinary({ cloud: { cloudName: parsed.cloudName } });
  const cldImage = cld
    .image(parsed.publicId)
    .format('auto')
    .quality('auto')
    .resize(limitFit(800, 800));

  return (
    <AdvancedImage
      cldImg={cldImage}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
};
