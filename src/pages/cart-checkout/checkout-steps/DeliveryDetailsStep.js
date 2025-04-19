import React from "react";

const DeliveryDetailsStep = ({ billing, setBilling, nextStep, prevStep, isSubmitting }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="checkout-step">
      <h4 className="mb-3">Delivery Details <span className="optional-label">(optional but recommended)</span></h4>

      <form className="needs-validation">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="marina" className="form-label">
              Marina <span className="optional-label">(optional)</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="marina"
              name="marina"
              value={billing.marina || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Marina Kaštela"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="charter" className="form-label">
              Charter <span className="optional-label">(optional)</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="charter"
              name="charter"
              value={billing.charter || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Croatia Yachting"
            />
          </div>

          <div className="col-md-8">
            <label htmlFor="boat" className="form-label">
              Boat <span className="optional-label">(optional)</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="boat"
              name="boat"
              value={billing.boat || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Bavaria 46 'Sea Dream'"
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="gate" className="form-label">
              Gate/Pier <span className="optional-label">(optional)</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="gate"
              name="gate"
              value={billing.gate || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Gate B"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="delivery_date" className="form-label">
              Preferred Delivery Date <span className="optional-label">(optional)</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="delivery_date"
              name="delivery_date"
              value={billing.delivery_date || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]} // Today or later
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="delivery_time" className="form-label">
              Preferred Delivery Time <span className="optional-label">(optional)</span>
            </label>
            <input
              type="time"
              className="form-control"
              id="delivery_time"
              name="delivery_time"
              value={billing.delivery_time || ''}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="col-12">
            <label htmlFor="order_notes" className="form-label">
              Order Notes <span className="optional-label">(optional)</span>
            </label>
            <textarea
              className="form-control"
              id="order_notes"
              name="order_notes"
              value={billing.order_notes || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Any special instructions for your delivery..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <div className="step-navigation">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            Back to Personal Details
          </button>
          <button
            type="button"
            className="btn btn-prim"
            onClick={nextStep}
            disabled={isSubmitting}
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryDetailsStep;