import React from "react";

const BoxHeader = ({
  title,
  description,
  image,
  totalSum,
  onAddToCart,
  peopleCount = 4,
  onPeopleCountChange,
}) => {
  const handleDecreasePeople = () => {
    if (peopleCount > 1) {
      onPeopleCountChange(peopleCount - 1);
    }
  };

  const handleIncreasePeople = () => {
    onPeopleCountChange(peopleCount + 1);
  };

  const handlePeopleInputChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value, 10) || 1);
    if (value !== peopleCount) {
      onPeopleCountChange(value);
    }
  };

  return (
    <div className="container p-3 p-md-5">
      <div className="row">
        <div className="col-md-6">
          <div style={{ minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={image}
              alt={title}
              title={title}
              className="img-fluid"
              loading="lazy"
              decoding="async"
              style={{ maxHeight: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
        <div className="col-md-6 text-center text-md-start">
          <h1 className="mb-2 mb-md-4 mt-1">{title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: description }}
            className="box-description"
            style={{ minHeight: "50px" }}
          />

          <div className="d-flex align-items-center mt-4 mb-2">
            <label htmlFor="peopleCount" className="me-3 fw-bold">
              Number of people:
            </label>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleDecreasePeople}
                disabled={peopleCount <= 1}
              >
                -
              </button>
              <input
                id="peopleCount"
                type="number"
                className="form-control mx-2"
                value={peopleCount}
                onChange={handlePeopleInputChange}
                min="1"
                style={{ width: "60px", textAlign: "center" }}
              />
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleIncreasePeople}
              >
                +
              </button>
            </div>
          </div>

          <h3 style={{ marginTop: "20px", minHeight: "38px" }}>
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
