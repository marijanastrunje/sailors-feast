import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductsGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="row">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="col-6 col-sm-4 col-md-3 mb-3">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export default ProductsGridSkeleton;