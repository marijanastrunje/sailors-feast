import React, { useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";

const CashPaymentSuccess = ({ isGuestCheckout, hasAccount, onShowRegistrationModal }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Funkcija za kopiranje broja narudžbe
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="payment-confirmation py-4">
      <div className="text-center mb-4">
        <div className="icon-container mb-3">
          <i className="fas fa-check-circle text-success" style={{ fontSize: '48px' }}></i>
        </div>
        <h2>Your Order Has Been Placed!</h2>
        <p className="lead">Thank you for your order.</p>
        <p>Your order is being processed and will be delivered as scheduled.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-sec text-white">
              <h3 className="card-title h5 mb-0">Order Details</h3>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <strong>Order Number:</strong> {orderId}
                </div>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleCopyOrderId}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="mb-2"><strong>Payment Method:</strong> Cash on Delivery</p>
              <p className="mb-2"><strong>Status:</strong> Processing</p>
              <div className="alert alert-info mt-3">
                <i className="fas fa-info-circle me-2"></i> Please have the exact amount ready on delivery.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        {isGuestCheckout ? (
          hasAccount ? (
            <>
              <p className="text-success mb-3">Your account has been created and you're now logged in.</p>
              <button onClick={() => navigate("/user")} className="btn btn-prim me-2">
                View Your Orders
              </button>
            </>
          ) : (
            <>
              <p className="mb-3">Want to track your order and save time on future purchases?</p>
              <button
                onClick={onShowRegistrationModal}
                className="btn btn-prim me-2"
              >
                Create Account
              </button>
            </>
          )
        ) : (
          <button onClick={() => navigate("/user")} className="btn btn-prim me-2">
            View Your Orders
          </button>
        )}
        <Link to="/all-boxes" className="btn btn-outline-secondary ms-2">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CashPaymentSuccess;