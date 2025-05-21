// Updated PaymentStep component with PayPal message inside the payment option
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faExclamationTriangle, faCreditCard, faUniversity, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";

const PaymentStep = ({ 
  billing, 
  setBilling, 
  handlePayment, 
  prevStep, 
  isSubmitting,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  showDeliveryWarning,
  deliveryDate,
  error,
  isGuestCheckout,
  handlePaypalPayment, 
  orderId, 
  totalPrice
}) => {

  const userType = localStorage.getItem("user_type");

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
  
  // Get appropriate button text based on payment method
  const getButtonText = () => {
    if (isSubmitting) {
      return (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Processing...
        </>
      );
    } else if (selectedPaymentMethod === 'vivawallet') {
      return "Pay now";
    } else if (selectedPaymentMethod === 'paypal') {
      return "Pay now";
    } else if (selectedPaymentMethod === 'cash') {
      return "Complete order";
    } else {
      return "Complete order";
    }
  };
  
  return (
    <div className="checkout-step">
      <h4 className="mb-3 pb-2 border-bottom">Payment</h4>
      
      {/* Show error message if any */}
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}
      
      <form className="needs-validation">
        {/* Payment notice for early bookings */}
        {deliveryDate && !requiresImmediatePayment && (
          <div className="alert alert-info mb-4 d-flex align-items-start">
            <FontAwesomeIcon icon={faInfoCircle} className="me-3 mt-1" />
            <div>
              <p className="mb-0 fw-bold">Early booking notice:</p>
              <p className="mb-0">
                Since your delivery date is more than 7 days away, you can:
              </p>
              <ul className="mb-0 mt-2 ps-3" style={{ listStyleType: "disc" }}>
                <li>Pay now using credit/debit card via Viva Wallet</li>
                <li className="d-none">Pay now using PayPal</li>
                <li>Pay later by bank transfer (before the deadline)</li>
                {userType === "crew" && <li>Pay in cash on delivery (crew members only)</li>}
              </ul>
              {paymentDeadline && (
                <p className="mt-2 mb-0 fw-bold">Payment deadline: {paymentDeadline}</p>
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
                <strong>Important:</strong> Since your delivery date is less than 7 days away, payment is required to process your order.
                {userType === "crew" && " However, as a crew member, you can still pay in cash on delivery."}
              </p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h5 className="mb-3 border-bottom pb-2">Select payment method</h5>
          
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
                  <span className="fw-bold">Pay now with Credit/Debit Card</span>
                  <small className="d-block text-muted">Secure payment via Viva Wallet</small>
                </div>
              </label>
              <img src="/img/logo/payments-logo/viva-logo.jpeg" alt="Viva Wallet" className="ms-auto" height="30" />
            </div>
            {selectedPaymentMethod === 'vivawallet' && (
              <p className="small text-muted mt-2 ms-4 ps-3">
                You will be redirected to Viva Wallet's secure payment page to complete your payment.
              </p>
            )}
          </div>

          {/* PayPal option */}
          <div 
            className={`d-none payment-option rounded border p-3 mb-3 ${selectedPaymentMethod === 'paypal' ? 'border-primary shadow-sm' : ''}`}
            onClick={() => setSelectedPaymentMethod('paypal')}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <div className="d-flex align-items-center">
              <input
                type="radio"
                id="paypal"
                name="payment_method"
                checked={selectedPaymentMethod === 'paypal'}
                onChange={() => setSelectedPaymentMethod('paypal')}
                className="me-3"
              />
              <label htmlFor="paypal" className="mb-0 d-flex align-items-center flex-grow-1" style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faPaypal} className="me-3 text-primary" />
                <div>
                  <span className="fw-bold">Pay now with PayPal</span>
                  <small className="d-block text-muted">Fast and secure payment</small>
                </div>
              </label>
              <img src="/img/logo/payments-logo/paypal-logo.jpeg" alt="PayPal" className="ms-auto" height="30" />
            </div>
            {selectedPaymentMethod === 'paypal' && (
              <p className="small text-muted mt-2 ms-4 ps-3">
                You will be redirected to PayPal's secure payment page to complete your payment.
              </p>
            )}
          </div>
          
          {/* Bank Transfer option - only available for orders more than 7 days before delivery */}
          {!requiresImmediatePayment && (
            <div 
              className={`payment-option rounded border p-3 mb-3 ${selectedPaymentMethod === 'banktransfer' ? 'border-primary shadow-sm' : ''}`}
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
                    <span className="fw-bold">Pay later by Bank transfer</span>
                    {paymentDeadline && (
                      <small className="d-block text-muted">Payment required by {paymentDeadline}</small>
                    )}
                  </div>
                </label>
              </div>
              {selectedPaymentMethod === 'banktransfer' && (
                <p className="small text-muted mt-2 ms-4 ps-3">
                  After confirming your order, you'll receive payment instructions with a QR code for easy bank transfer.
                </p>
              )}
            </div>
          )}

          {/* Cash option - only available for crew members */}
          {!isGuestCheckout && userType === "crew" && (
            <div
              className={`payment-option rounded border p-3 mt-3 ${selectedPaymentMethod === 'cash' ? 'border-primary shadow-sm' : ''}`}
              onClick={() => setSelectedPaymentMethod('cash')}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  id="cash-on-delivery"
                  name="payment_method"
                  checked={selectedPaymentMethod === 'cash'}
                  onChange={() => setSelectedPaymentMethod('cash')}
                  className="me-3"
                />
                <label htmlFor="cash-on-delivery" className="mb-0 d-flex align-items-center flex-grow-1" style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faMoneyBillWave} className="me-3 text-primary" />
                  <div>
                    <span className="fw-bold">Pay in Cash on delivery</span>
                    <small className="d-block text-muted">Available only for crew members</small>
                  </div>
                </label>
              </div>
              {selectedPaymentMethod === 'cash' && (
                <p className="small text-muted mt-2 ms-4 ps-3">
                  You'll pay the full amount in cash upon delivery to our staff member.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <h5 className="mb-3 border-bottom pb-2">Review order</h5>
          <p>Please review your information before completing your order:</p>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="rounded bg-light p-3 h-100">
                <h6 className="mb-2 text-muted">Personal details</h6>
                <div className="row mb-1">
                  <div className="col-3 fw-bold">Name:</div>
                  <div className="col-9 p-0">{billing.first_name} {billing.last_name}</div>
                </div>
                <div className="row mb-1">
                  <div className="col-3 fw-bold">Email:</div>
                  <div className="col-9 p-0">{billing.email}</div>
                </div>
                <div className="row mb-1">
                  <div className="col-3 fw-bold">Phone:</div>
                  <div className="col-9 p-0">{billing.phone}</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mt-3 mt-md-0">
              <div className="rounded bg-light p-3 h-100">
                <h6 className="mb-2 text-muted">Delivery details</h6>
                {billing.delivery_date && (
                  <div className="row mb-1">
                    <div className="col-3 fw-bold">Date:</div>
                    <div className="col-9 p-0">
                      {new Date(billing.delivery_date).toLocaleDateString()}
                      {billing.delivery_time && ` at ${billing.delivery_time}`}
                    </div>
                  </div>
                )}
                
                {billing.marina && (
                  <div className="row mb-1">
                    <div className="col-3 fw-bold">Marina:</div>
                    <div className="col-9 p-0">{billing.marina}</div>
                  </div>
                )}
                
                {billing.charter && (
                  <div className="row mb-1">
                    <div className="col-3 fw-bold">Charter:</div>
                    <div className="col-9 p-0">{billing.charter}</div>
                  </div>
                )}
                
                {billing.boat && (
                  <div className="row mb-1">
                    <div className="col-3 fw-bold">Boat:</div>
                    <div className="col-9 p-0">{billing.boat}</div>
                  </div>
                )}
                
                {billing.gate && (
                  <div className="row mb-1">
                    <div className="col-3 fw-bold">Gate:</div>
                    <div className="col-9 p-0">{billing.gate}</div>
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
              Back <span className="d-none d-sm-inline">to delivery details</span>
            </button>
            <button
              type="button"
              className="btn btn-prim"
              onClick={handlePayment}
              disabled={isSubmitting || !billing.privacyConsent || !selectedPaymentMethod}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentStep;