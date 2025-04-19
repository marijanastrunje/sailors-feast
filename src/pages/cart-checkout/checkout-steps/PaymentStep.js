import React from "react";
import { Link } from "react-router-dom";

const PaymentStep = ({ billing, setBilling, handlePayment, prevStep, isSubmitting }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBilling((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  return (
    <div className="checkout-step">
      <h4 className="mb-3">Payment</h4>
      <form className="needs-validation">
        <div className="mb-4">
          <h5 className="mb-3">Payment Method</h5>
          
          <div className="payment-option selected d-flex align-items-center">
            <input
              type="radio"
              id="viva-wallet"
              name="payment_method"
              checked
              className="me-2"
              readOnly
            />
            <label htmlFor="viva-wallet" className="mb-0 d-flex align-items-center flex-grow-1">
              <img src="/img/payment/viva-wallet.png" alt="Viva Wallet" className="me-2" />
              <span>Viva Wallet (Credit/Debit Card)</span>
            </label>
          </div>
          
          <p className="small text-muted">
            You will be redirected to Viva Wallet's secure payment page to complete your payment.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="mb-3">Review Order</h5>
          <p>Please review your information before completing your order:</p>
          
          <div className="d-flex flex-column mb-3">
            <div className="row mb-1">
              <div className="col-4 fw-bold">Name:</div>
              <div className="col-8">{billing.first_name} {billing.last_name}</div>
            </div>
            <div className="row mb-1">
              <div className="col-4 fw-bold">Email:</div>
              <div className="col-8">{billing.email}</div>
            </div>
            <div className="row mb-1">
              <div className="col-4 fw-bold">Phone:</div>
              <div className="col-8">{billing.phone}</div>
            </div>
            
            {billing.marina && (
              <div className="row mb-1">
                <div className="col-4 fw-bold">Marina:</div>
                <div className="col-8">{billing.marina}</div>
              </div>
            )}
            
            {(billing.delivery_date || billing.delivery_time) && (
              <div className="row mb-1">
                <div className="col-4 fw-bold">Delivery:</div>
                <div className="col-8">
                  {billing.delivery_date && new Date(billing.delivery_date).toLocaleDateString()}
                  {billing.delivery_time && ` at ${billing.delivery_time}`}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="privacyConsent"
            name="privacyConsent"
            checked={billing.privacyConsent || false}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <label className="form-check-label" htmlFor="privacyConsent">
            I agree with the <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</Link>
          </label>
        </div>

        <div className="step-navigation">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            Back to Delivery Details
          </button>
          <button
            type="button"
            className="btn btn-prim"
            onClick={handlePayment}
            disabled={isSubmitting || !billing.privacyConsent}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing Payment...
              </>
            ) : "Complete Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentStep;