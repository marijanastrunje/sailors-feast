import React from "react";
import { Link } from "react-router-dom";

const PaymentStep = ({ 
  billing, 
  setBilling, 
  handlePayment, 
  prevStep, 
  isSubmitting,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  showDeliveryWarning,
  deliveryDate 
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBilling((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Calculate payment deadline based on delivery date (7 days before)
  const getPaymentDeadline = () => {
    if (!deliveryDate) return null;
    
    const date = new Date(deliveryDate);
    date.setDate(date.getDate() - 7);
    return date.toLocaleDateString();
  };
  
  // Check if payment is required immediately (less than 7 days to delivery)
  const isImmediatePaymentRequired = () => {
    return showDeliveryWarning;
  };

  const paymentDeadline = getPaymentDeadline();
  const requiresImmediatePayment = isImmediatePaymentRequired();
  
  return (
    <div className="checkout-step">
      <h4 className="mb-3">Payment</h4>
      <form className="needs-validation">
        {/* Payment notice for early bookings */}
        {deliveryDate && !requiresImmediatePayment && (
          <div className="alert alert-info mb-4">
            <p className="mb-0"><strong>Early Booking Notice:</strong></p>
            <p className="mb-0">
              Since your delivery date is more than 7 days away, you can:
            </p>
            <ul className="mb-0 mt-2">
              <li>Pay now using credit/debit card, or</li>
              <li>Pay later by bank transfer (before the deadline)</li>
            </ul>
            {paymentDeadline && (
              <p className="mt-2 mb-0"><strong>Payment Deadline: {paymentDeadline}</strong></p>
            )}
          </div>
        )}

        {/* Immediate payment warning */}
        {requiresImmediatePayment && (
          <div className="alert alert-warning mb-4">
            <p className="mb-0">
              <strong>Important:</strong> Since your delivery date is less than 7 days away, 
              immediate payment is required to process your order.
            </p>
          </div>
        )}

        <div className="mb-4">
          <h5 className="mb-3">Select Payment Method</h5>
          
          {/* Credit/Debit Card option */}
          <div 
            className={`payment-option d-flex align-items-center mb-3 ${selectedPaymentMethod === 'vivawallet' ? 'selected' : ''}`}
            onClick={() => setSelectedPaymentMethod('vivawallet')}
          >
            <input
              type="radio"
              id="viva-wallet"
              name="payment_method"
              checked={selectedPaymentMethod === 'vivawallet'}
              onChange={() => setSelectedPaymentMethod('vivawallet')}
              className="me-2"
            />
            <label htmlFor="viva-wallet" className="mb-0 d-flex align-items-center flex-grow-1">
              <img src="/img/payment/viva-wallet.png" alt="Viva Wallet" className="me-2" />
              <span>Pay Now with Credit/Debit Card</span>
            </label>
          </div>
          
          {/* Bank Transfer option - only available for orders more than 7 days before delivery */}
          {!requiresImmediatePayment && (
            <div 
              className={`payment-option d-flex align-items-center ${selectedPaymentMethod === 'banktransfer' ? 'selected' : ''}`}
              onClick={() => setSelectedPaymentMethod('banktransfer')}
            >
              <input
                type="radio"
                id="bank-transfer"
                name="payment_method"
                checked={selectedPaymentMethod === 'banktransfer'}
                onChange={() => setSelectedPaymentMethod('banktransfer')}
                className="me-2"
              />
              <label htmlFor="bank-transfer" className="mb-0 d-flex align-items-center flex-grow-1">
                <img src="/img/payment/bank-transfer.png" alt="Bank Transfer" className="me-2" />
                <div>
                  <span>Pay Later by Bank Transfer</span>
                  {paymentDeadline && (
                    <small className="d-block text-muted">Payment required by {paymentDeadline}</small>
                  )}
                </div>
              </label>
            </div>
          )}
          
          <p className="small text-muted mt-2">
            {selectedPaymentMethod === 'vivawallet' ? 
              "You will be redirected to Viva Wallet's secure payment page to complete your payment." :
              "After confirming your order, you'll receive payment instructions with a QR code for easy bank transfer."
            }
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
            
            {billing.delivery_date && (
              <div className="row mb-1">
                <div className="col-4 fw-bold">Delivery Date:</div>
                <div className="col-8">
                  {new Date(billing.delivery_date).toLocaleDateString()}
                  {billing.delivery_time && ` at ${billing.delivery_time}`}
                </div>
              </div>
            )}
            
            {billing.marina && (
              <div className="row mb-1">
                <div className="col-4 fw-bold">Marina:</div>
                <div className="col-8">{billing.marina}</div>
              </div>
            )}
            
            {billing.charter && (
              <div className="row mb-1">
                <div className="col-4 fw-bold">Charter:</div>
                <div className="col-8">{billing.charter}</div>
              </div>
            )}
            
            {billing.boat && (
              <div className="row mb-1">
                <div className="col-4 fw-bold">Boat:</div>
                <div className="col-8">{billing.boat}</div>
              </div>
            )}
            
            {billing.gate && (
              <div className="row mb-1">
                <div className="col-4 fw-bold">Gate:</div>
                <div className="col-8">{billing.gate}</div>
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
                Processing...
              </>
            ) : selectedPaymentMethod === 'vivawallet' ? (
              "Pay Now"
            ) : (
              "Complete Order"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentStep;