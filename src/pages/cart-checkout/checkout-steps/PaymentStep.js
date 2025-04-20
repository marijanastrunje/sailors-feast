import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faExclamationTriangle, faCreditCard, faUniversity } from "@fortawesome/free-solid-svg-icons";

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
      <h4 className="mb-3 pb-2 border-bottom">Payment</h4>
      <form className="needs-validation">
        {/* Payment notice for early bookings */}
        {deliveryDate && !requiresImmediatePayment && (
          <div className="alert alert-info mb-4 d-flex align-items-start">
            <FontAwesomeIcon icon={faInfoCircle} className="me-3 mt-1" />
            <div>
              <p className="mb-0 fw-bold">Early Booking Notice:</p>
              <p className="mb-0">
                Since your delivery date is more than 7 days away, you can:
              </p>
              <ul className="mb-0 mt-2">
                <li>Pay now using credit/debit card, or</li>
                <li>Pay later by bank transfer (before the deadline)</li>
              </ul>
              {paymentDeadline && (
                <p className="mt-2 mb-0 fw-bold">Payment Deadline: {paymentDeadline}</p>
              )}
            </div>
          </div>
        )}

        {/* Immediate payment warning */}
        {requiresImmediatePayment && (
          <div className="alert alert-warning mb-4 d-flex align-items-start">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-3 mt-1" />
            <div>
              <p className="mb-0">
                <strong>Important:</strong> Since your delivery date is less than 7 days away, 
                immediate payment is required to process your order.
              </p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h5 className="mb-3 border-bottom pb-2">Select Payment Method</h5>
          
          {/* Credit/Debit Card option */}
          <div 
            className={`payment-option rounded border p-3 mb-3 ${selectedPaymentMethod === 'vivawallet' ? 'border-primary shadow-sm' : ''}`}
            onClick={() => setSelectedPaymentMethod('vivawallet')}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <div className="d-flex align-items-center">
              <input
                type="radio"
                id="viva-wallet"
                name="payment_method"
                checked={selectedPaymentMethod === 'vivawallet'}
                onChange={() => setSelectedPaymentMethod('vivawallet')}
                className="me-3"
              />
              <label htmlFor="viva-wallet" className="mb-0 d-flex align-items-center flex-grow-1" style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faCreditCard} className="me-3 text-primary" />
                <div>
                  <span className="fw-bold">Pay Now with Credit/Debit Card</span>
                  <small className="d-block text-muted">Secure payment via Viva Wallet</small>
                </div>
              </label>
              <img src="/img/payment/viva-wallet.png" alt="Viva Wallet" className="ms-auto" height="30" />
            </div>
          </div>
          
          {/* Bank Transfer option - only available for orders more than 7 days before delivery */}
          {!requiresImmediatePayment && (
            <div 
              className={`payment-option rounded border p-3 ${selectedPaymentMethod === 'banktransfer' ? 'border-primary shadow-sm' : ''}`}
              onClick={() => setSelectedPaymentMethod('banktransfer')}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  id="bank-transfer"
                  name="payment_method"
                  checked={selectedPaymentMethod === 'banktransfer'}
                  onChange={() => setSelectedPaymentMethod('banktransfer')}
                  className="me-3"
                />
                <label htmlFor="bank-transfer" className="mb-0 d-flex align-items-center flex-grow-1" style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faUniversity} className="me-3 text-primary" />
                  <div>
                    <span className="fw-bold">Pay Later by Bank Transfer</span>
                    {paymentDeadline && (
                      <small className="d-block text-muted">Payment required by {paymentDeadline}</small>
                    )}
                  </div>
                </label>
                <img src="/img/payment/bank-transfer.png" alt="Bank Transfer" className="ms-auto" height="30" />
              </div>
            </div>
          )}
          
          <p className="small text-muted mt-3 ms-2">
            {selectedPaymentMethod === 'vivawallet' ? 
              "You will be redirected to Viva Wallet's secure payment page to complete your payment." :
              "After confirming your order, you'll receive payment instructions with a QR code for easy bank transfer."
            }
          </p>
        </div>

        <div className="mb-4">
          <h5 className="mb-3 border-bottom pb-2">Review Order</h5>
          <p>Please review your information before completing your order:</p>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="rounded bg-light p-3 h-100">
                <h6 className="mb-2 text-muted">Personal Details</h6>
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
              </div>
            </div>
            
            <div className="col-md-6 mt-3 mt-md-0">
              <div className="rounded bg-light p-3 h-100">
                <h6 className="mb-2 text-muted">Delivery Details</h6>
                {billing.delivery_date && (
                  <div className="row mb-1">
                    <div className="col-4 fw-bold">Date:</div>
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
          </div>
        </div>

        <div className="step-navigation d-flex flex-column">
          <div className="form-check mb-3 align-self-center align-self-md-end d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input border-primary me-2"
              id="privacyConsent"
              name="privacyConsent"
              checked={billing.privacyConsent || false}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{ width: '1.2em', height: '1.2em' }}
            />
            <label className="form-check-label" htmlFor="privacyConsent">
              I agree with the <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-prim">privacy policy</Link>
            </label>
          </div>
          
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              Back <span className="d-none d-sm-inline">to Delivery Details</span>
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
        </div>
      </form>
    </div>
  );
};

export default PaymentStep;