import React from "react";

const BoxModal = ({ extraProducts, handleAddProduct, closeModal }) => {
  return (
    <div className="modal fade show d-block" id="boxModal" tabIndex="-1">
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add More Products</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            {extraProducts.length > 0 ? (
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
                  {extraProducts.map((subcategory) => (
                    <React.Fragment key={subcategory.id}>
                      <tr>
                        <td colSpan="4" className="table-secondary fw-bold text-center">
                          {subcategory.name}
                        </td>
                      </tr>
                      {subcategory.products.map((product) => (
                        <tr key={product.id}>
                          <td className="py-0">
                            <img
                              src={
                                product.images?.length > 0
                                  ? product.images[0].src
                                  : "https://placehold.co/100"
                              }
                              alt={product.name}
                              width="90"
                            />
                          </td>
                          <td>
                            <p className="m-0">
                              {product.name} <br /> {product.price} €
                            </p>
                          </td>
                          <td className="px-0">
                            <div className="d-flex">
                              <button className="plus-button">-</button>
                              <input
                                type="number"
                                readOnly
                                className="quantity-input-box"
                              />
                              <button className="plus-button">+</button>
                            </div>
                          </td>
                          <td>
                            <button
                              className="plus-button"
                              onClick={() => handleAddProduct(product)}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxModal;
