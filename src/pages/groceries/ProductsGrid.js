import React from "react";
import ProductCard from "./ProductCard";

const ProductsGrid = ({ products, onShowModal, allProducts }) => {
  if (!products || products.length === 0) {
    return (
      <p
        className="text-center my-4"
        aria-live="polite"
        aria-busy="true"
        role="status"
      >
        Loading products...
      </p>
    );
  }

  return (
    <div
      className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 mt-2"
      role="list"
      aria-label="Add to cart"
      title="Add to cart"
    >
      {products.map((product) => (
        <div key={product.id} className="col" role="listitem">
          <ProductCard product={product} onShowModal={onShowModal} allProducts={allProducts} />
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;
