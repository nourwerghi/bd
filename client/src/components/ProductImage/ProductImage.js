import React, { useState } from 'react';
import './ProductImage.css';

const ProductImage = ({ imageUrl, alt, className = '' }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
  const fullImageUrl = imageUrl ? `${baseUrl}/uploads/${imageUrl}` : null;
  const placeholderUrl = 'https://via.placeholder.com/300x300?text=No+Image';

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <div className={`product-image-container ${className}`}>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <img
        src={error || !fullImageUrl ? placeholderUrl : fullImageUrl}
        alt={alt}
        className={`product-image ${loading ? 'loading' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default ProductImage;