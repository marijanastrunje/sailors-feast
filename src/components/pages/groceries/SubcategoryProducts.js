import React from "react";
import ProductCard from "./ProductCard";

const SubcategoryProducts = ({
  subcategories,
  openCategory,
  subcategoryProducts,
  setActiveSubcategory,
  fetchProducts,
  onShowModal
}) => {
  if (!openCategory || !subcategories[openCategory]) return null;

  return (
    <>
      {subcategories[openCategory].map((subcategory) => {
        const products = subcategoryProducts[subcategory.id] || [];

        if (products.length === 0) {
          return (
            <div key={subcategory.id} className="mb-4">
              <h3
                className="subcategory-title"
                onClick={() => {
                  fetchProducts(subcategory.id, true);
                  setActiveSubcategory(subcategory.id);
                }}
                role="button"
                tabIndex="0"
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  fetchProducts(subcategory.id, true)
                }
              >
                {subcategory.name}
              </h3>
              <p>No products available.</p>
            </div>
          );
        }

        return (
          <div key={subcategory.id} className="mb-5">
            <div className="d-flex align-items-center mb-2">
              <h3
                className="subcategory-title"
                onClick={() => {
                  fetchProducts(subcategory.id, true);
                  setActiveSubcategory(subcategory.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                role="button"
                tabIndex="0"
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  fetchProducts(subcategory.id, true)
                }
              >
                {subcategory.name}
              </h3>
              <p
                className="subcategory-show-all ms-auto"
                onClick={() => {
                  fetchProducts(subcategory.id, true);
                  setActiveSubcategory(subcategory.id);
                }}
                role="button"
                tabIndex="0"
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  fetchProducts(subcategory.id, true)
                }
              >
                Show all
              </p>
            </div>

            <div
              className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3"
              role="list"
              aria-label={`Products in ${subcategory.name}`}
            >
              {products.map((product) => (
                <div key={product.id} className="col" role="listitem">
                  <ProductCard
                    product={product}
                    onShowModal={onShowModal}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SubcategoryProducts;
