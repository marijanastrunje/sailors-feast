import React, { useEffect } from "react";

const DeliveryDetailsStep = ({ 
  billing, 
  setBilling, 
  nextStep, 
  prevStep, 
  isSubmitting,
  errors = {},
  showWarning = false,
  setShowDeliveryWarning,
  checkDeliveryDateWarning,
  setHasCheckedDeliveryDate
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));

    // Check if date is changing
    if (name === "delivery_date" && value) {
      const needsWarning = checkDeliveryDateWarning(value);
      setShowDeliveryWarning(needsWarning);
      setHasCheckedDeliveryDate(true);
    }
  };

  
  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // resetiramo vrijeme na 00:00
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 4); // dodamo 3 dana
    return minDate.toISOString().split("T")[0];
  };

  const minDeliveryDate = getMinDate();
  


  // Update delivery warning when component mounts
  useEffect(() => {
    if (billing.delivery_date) {
      const needsWarning = checkDeliveryDateWarning(billing.delivery_date);
      setShowDeliveryWarning(needsWarning);
    }
  }, [billing.delivery_date, checkDeliveryDateWarning, setShowDeliveryWarning]);

  return (
    <div className="checkout-step">
      <h4 className="mb-3">
        Delivery Details
        {!showWarning && (
          <span className="optional-label"></span>
        )}
      </h4>

      {showWarning && (
        <div className="alert alert-warning mb-3" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <strong>Important:</strong> Your delivery date is less than 7 days away. Delivery details are required.
        </div>
      )}

      {!showWarning && billing.delivery_date && (
        <div className="alert alert-info mb-3" role="alert">
          <i className="fas fa-info-circle me-2"></i>
          Delivery details are optional when ordering more than 7 days in advance. However, 
          you must provide these details at least 7 days before your delivery date.
        </div>
      )}

      <form className="needs-validation">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="delivery_date" className="form-label">
              Preferred Delivery Date 
              <span className="text-danger ms-1">*</span>
            </label>
            <input
              type="date"
              className={`form-control ${errors.delivery_date ? 'is-invalid' : ''}`}
              id="delivery_date"
              name="delivery_date"
              value={billing.delivery_date || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              min={minDeliveryDate}
              required
            />
            {errors.delivery_date && (
              <div className="invalid-feedback">{errors.delivery_date}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="delivery_time" className="form-label">
              Preferred Delivery Time
              {showWarning && <span className="text-danger ms-1">*</span>}
            </label>
            <input
              type="time"
              min="08:00"
              max="22:00"
              step="1800"
              className={`form-control ${errors.delivery_time ? 'is-invalid' : ''}`}
              id="delivery_time"
              name="delivery_time"
              value={billing.delivery_time || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              required={showWarning}
            />
            {errors.delivery_time && (
              <div className="invalid-feedback">{errors.delivery_time}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="marina" className="form-label">
              Marina
              {showWarning && <span className="text-danger ms-1">*</span>}
              {!showWarning && <span className="optional-label">(optional)</span>}
            </label>
            <input
              type="text"
              className={`form-control ${errors.marina ? 'is-invalid' : ''}`}
              id="marina"
              name="marina"
              value={billing.marina || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Marina Kaštela"
              required={showWarning}
            />
            {errors.marina && (
              <div className="invalid-feedback">{errors.marina}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="charter" className="form-label">
              Charter
              {showWarning && <span className="text-danger ms-1">*</span>}
              {!showWarning && <span className="optional-label">(optional)</span>}
            </label>
            <input
              type="text"
              className={`form-control ${errors.charter ? 'is-invalid' : ''}`}
              id="charter"
              name="charter"
              value={billing.charter || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Croatia Yachting"
              required={showWarning}
            />
            {errors.charter && (
              <div className="invalid-feedback">{errors.charter}</div>
            )}
          </div>

          <div className="col-md-8">
            <label htmlFor="boat" className="form-label">
              Boat
              {showWarning && <span className="text-danger ms-1">*</span>}
              {!showWarning && <span className="optional-label">(optional)</span>}
            </label>
            <input
              type="text"
              className={`form-control ${errors.boat ? 'is-invalid' : ''}`}
              id="boat"
              name="boat"
              value={billing.boat || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Bavaria 46 'Sea Dream'"
              required={showWarning}
            />
            {errors.boat && (
              <div className="invalid-feedback">{errors.boat}</div>
            )}
          </div>

          <div className="col-md-4">
            <label htmlFor="gate" className="form-label">
              Gate/Pier
              {showWarning && <span className="text-danger ms-1">*</span>}
              {!showWarning && <span className="optional-label">(optional)</span>}
            </label>
            <input
              type="text"
              className={`form-control ${errors.gate ? 'is-invalid' : ''}`}
              id="gate"
              name="gate"
              value={billing.gate || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Gate B"
              required={showWarning}
            />
            {errors.gate && (
              <div className="invalid-feedback">{errors.gate}</div>
            )}
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
            onClick={() => {
              if (!billing.delivery_date) {
                alert("Please select a delivery date.");
                return;
              }
              nextStep();
            }}            
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