import React from "react";

const BoxHeader = ({ title, description, image, totalSum, onAddToCart }) => {
  return (
    <div className="container p-3 p-md-5">
      <div className="row">
        <div className="col-md-6">
          {/* Kontejner s fiksnom visinom za sprečavanje layout shifta */}
          <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={image}
              alt={title}
              title={title}
              className="img-fluid"
              loading="lazy"
              decoding="async"
              style={{ maxHeight: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
        <div className="col-md-6 text-center text-md-start">
          <h1 className="mb-2 mb-md-4 mt-2">{title}</h1>
          <div 
            dangerouslySetInnerHTML={{ __html: description }} 
            className="box-description"
            style={{ minHeight: '80px' }} 
          />
          <h3 style={{ marginTop: '20px', minHeight: '38px' }}>
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

export default React.memo(BoxHeader);