import React from "react";

const BoxHeader = ({ title, description, image, totalSum, onAddToCart }) => {
  return (
    <div className="container p-3 p-md-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={image}
            alt={title}
            title={title}
            className="img-fluid"
          />
        </div>
        <div className="col-md-6 text-center text-md-start">
          <h1 className="mb-2 mb-md-4 mt-2">{title}</h1>
          <p>{description}</p>
          <h3>
            SUM: {totalSum.toFixed(2)}€
            <span className="text-muted"> VAT is included</span>
          </h3>
          <button className="btn btn-prim btn-l" onClick={onAddToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoxHeader;