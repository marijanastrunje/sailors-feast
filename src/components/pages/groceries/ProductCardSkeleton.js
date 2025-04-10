import React from 'react';
import './ProductCardSkeleton.css'; 

const ProductCardSkeleton = () => {
  return (
    <div className="products card flex-column justify-content-between p-2 skeleton-card">
      <div className="skeleton-img"></div>
      <div className="product-footer px-2">
        <div className="product-description-3">
          <div className="skeleton-title"></div>
          <div className="skeleton-price"></div>
        </div>
        <div className="d-flex align-items-center justify-content-center mt-auto">
          <div className="skeleton-button"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;