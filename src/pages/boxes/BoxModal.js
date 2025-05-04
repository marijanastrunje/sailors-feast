import React, { useState, useMemo, useCallback } from "react";

const BoxModal = ({ extraProducts, handleAddProduct, closeModal, onShowProductModal, categoryMapping }) => {
  const [quantities, setQuantities] = useState({});

  // Funkcija za promjenu količine proizvoda
  const handleQuantityChange = useCallback((productId, value) => {
    if (value === "") {
        setQuantities(prev => ({ ...prev, [productId]: "" }));
        return;
    }

    const newValue = Math.max(0, parseInt(value, 10) || 0);
    setQuantities(prev => ({ ...prev, [productId]: newValue }));
  }, []);

  // Optimizirani renderiranje proizvoda s memorizacijom
  const renderSubcategories = useMemo(() => {
    if (!extraProducts || extraProducts.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center py-4">
            <div className="spinner-border text-prim" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading products...</p>
          </td>
        </tr>
      );
    }

    return extraProducts.map((subcategory) => {
      // Provjera postoji li mapiranje za ovu kategoriju
      const mappedCategory = categoryMapping && categoryMapping[subcategory.id] 
        ? categoryMapping[subcategory.id] 
        : subcategory.name;

      return (
        <React.Fragment key={subcategory.id}>
          <tr>
            <td colSpan="4" className="table-secondary fw-bold text-center">
              {mappedCategory}
            </td>
          </tr>
          {subcategory.products.map((product) => (
            <tr key={product.id}>
              <td className="py-0">
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0].src}
                    alt={product.name}
                    width="90"
                    loading="lazy"
                  />
                ) : (
                  <div className="placeholder-img" style={{ width: "90px", height: "90px", background: "#eee" }}></div>
                )}
              </td>
              <td>
                <p 
                  className="m-0 product-name-link" 
                  onClick={() => onShowProductModal(product)}
                  style={{ cursor: "pointer" }}
                >
                  {product.name} <br /> {product.price} €
                </p>
              </td>
              <td className="px-0">
                <div className="d-flex">
                  <button 
                    className="plus-button" 
                    onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 0) - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="quantity-input-box"
                    value={quantities[product.id] === undefined ? "" : quantities[product.id]}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  />
                  <button 
                    className="plus-button" 
                    onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 0) + 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td>
                <button
                  className="plus-button"
                  onClick={() => handleAddProduct(
                    { ...product, categories: [...(product.categories || []), { id: subcategory.id }] },
                    quantities[product.id] || 1
                  )}
                  
                >
                  Add
                </button>
              </td>
            </tr>
          ))}
        </React.Fragment>
      );
    });
  }, [extraProducts, quantities, handleQuantityChange, onShowProductModal, handleAddProduct, categoryMapping]);

  return (
    <div className="modal fade show d-block" id="boxModal" tabIndex="-1">
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add More Products</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <table className="table box-products">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {renderSubcategories}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BoxModal);