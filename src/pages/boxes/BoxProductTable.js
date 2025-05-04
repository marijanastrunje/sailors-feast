import React from "react";
import { Link, useNavigate } from "react-router-dom";

const BoxProductTable = ({
  subcategories,
  subcategoryProducts,
  setSubcategoryProducts,
  onShowProductModal,
  handleRemoveProduct,
  handleShowModal,
  onShowSaveModal,
  token,
  peopleCount,
}) => {
  
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 0) newQuantity = 0;

    setSubcategoryProducts((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((subcategoryId) => {
        updated[subcategoryId] = updated[subcategoryId].map((product) =>
          product.id === productId
            ? { ...product, quantity: newQuantity }
            : product
        );
      });
      return updated;
    });
  };

  const totalSum = subcategories.reduce((sum, subcategory) => {
    return (
      sum +
      (subcategoryProducts[subcategory.id]?.reduce(
        (subSum, product) =>
          subSum + product.price * (product.quantity || 0),
        0
      ) || 0)
    );
  }, 0);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const currentBoxProductIds = new Set();

    subcategories.forEach((subcategory) => {
      subcategoryProducts[subcategory.id]?.forEach((product) => {
        currentBoxProductIds.add(product.id);
      });
    });

    cart = cart.filter(
      (item) => !item.box || currentBoxProductIds.has(item.id)
    );

    subcategories.forEach((subcategory) => {
      subcategoryProducts[subcategory.id]?.forEach((product) => {
        const quantity = product.quantity || 0;
        if (quantity > 0) {
          const existing = cart.find((item) => item.id === product.id);
          if (existing) {
            existing.quantity = quantity;
          } else {
            cart.push({
              id: product.id,
              image: product.images,
              title: product.name,
              price: product.price,
              quantity,
              box: true,
            });
          }
        }
      });
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-lg-6 mx-auto mt-3">
          <table className="table box-products rounded-table shadow-sm">
            <thead>
              <tr>
                <th colSpan="4">
                  <h2 className="text-center mb-0">Product List</h2>
                </th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subcategory) => (
                <React.Fragment key={subcategory.id}>
                  <tr>
                    <td colSpan="4" className="table-secondary">
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        <h3 className="mb-0 me-2">{subcategory.name}</h3>
                        <button
                          className="add-products-button btn btn-secondary ms-auto ms-sm-0 me-0"
                          onClick={() => handleShowModal(subcategory.id)}
                        >
                          Add more
                        </button>
                      </div>
                    </td>
                  </tr>
                  {subcategoryProducts[subcategory.id]?.map((product) => (
                    <tr key={product.id}>
                      <td className="py-0 pe-md-0">
                        <img
                          onClick={() => onShowProductModal(product)}
                          src={
                            product.images?.length > 0
                              ? product.images[0].src
                              : "https://placehold.co/100"
                          }
                          alt={product.name}
                          width="90"
                        />
                      </td>
                      <td className="ps-lg-0">
                        <p
                          className="m-0"
                          onClick={() => onShowProductModal(product)}
                        >
                          {product.name} <br /> {product.price} €
                        </p>
                      </td>
                      <td className="px-0">
                        <div className="d-flex">
                          <button
                            className="plus-button"
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                product.quantity - 1
                              )
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="quantity-input-box"
                            value={product.quantity || 1}
                            onChange={(e) =>
                              handleQuantityChange(
                                product.id,
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                          />
                          <button
                            className="plus-button"
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                product.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn-close"
                          onClick={() =>
                            handleRemoveProduct(subcategory.id, product.id)
                          }
                        ></button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              <tr>
                <td colSpan="4">
                  <div className="d-flex justify-content-between">
                    <h3>SUM: {totalSum.toFixed(2)}€</h3>

                    <div>
                      {token && (
                        <button className="btn btn-sm btn-secondary me-2" onClick={onShowSaveModal}>
                          Save as List
                        </button>
                      )}

                      <button
                        className="btn btn-prim btn-sm"
                        onClick={addToCart}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {!token && (
            <small className="text-muted text-end d-block">
              Want to save your list?{" "}
              <Link
                to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                className="text-prim"
                onClick={() =>{
                  localStorage.setItem("pendingBoxProducts", JSON.stringify(subcategoryProducts));
                  localStorage.setItem("pendingPeopleCount", peopleCount);
                }}
              >
                Login here
              </Link>
            </small>
          )}

        </div>
      </div>
    </div>
  );
};

export default BoxProductTable;
