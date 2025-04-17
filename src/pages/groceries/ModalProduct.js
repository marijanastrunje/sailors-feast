import React from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min';

const ModalProduct = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      aria-label={`Details for product ${product.name}`}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h1 className="modal-title fs-5" id="modal-product-title">
              {product.name}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close product modal"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body text-center">
            <img
              src={product.images.length > 0 ? product.images[0].src : "https://placehold.co/160"}
              width={150}
              height={180}
              className="mb-3"
              alt={`${product.name}`}
              title={product.name}
            />
            <p><strong>Price:</strong> {product.price} €</p>
            <p dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              aria-label="Close product details"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModalProduct;
