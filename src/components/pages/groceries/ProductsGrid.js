import React from "react";
import ProductCard from "./ProductCard";

const ProductsGrid = ({ products, onProductClick }) => {

  if (!products || products.length === 0) {
    return <p className="text-center my-4">Nema dostupnih proizvoda.</p>;
  }

  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 mt-2">
            {products.map((product) => (
                <div key={product.id} className="col">
                    <ProductCard product={product} onProductClick={onProductClick} />
                </div>
            ))}
    </div>
  );
};

export default ProductsGrid;
