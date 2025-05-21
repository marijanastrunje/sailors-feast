import React, { useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";

const CashPaymentSuccess = ({ isGuestCheckout, hasAccount, onShowRegistrationModal }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Fallback provjere ako propovi nisu prosljeđeni
  const isGuest = isGuestCheckout ?? (sessionStorage.getItem("guest_checkout") === "true");
  const userHasAccount = hasAccount ?? !!localStorage.getItem("token");

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

      <div className="container">
        <div className="card mb-4 mx-auto" style={{ maxWidth: "720px" }}>
          <div className="card-header bg-sec text-white">
            <h3 className="card-title h5 mb-0">Order Details</h3>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
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
            
            <div className="row">
              <div className="col-md-6 mb-2">
                <strong>Payment Method:</strong>
                <br />
                <span className="text-muted">Cash on Delivery</span>
              </div>
              <div className="col-md-6 mb-2">
                <strong>Status:</strong>
                <br />
                <span className="badge bg-warning text-dark">Processing</span>
              </div>
            </div>
            
            <div className="alert alert-info mt-3 d-flex align-items-start">
              <i className="fas fa-info-circle me-2 mt-1"></i>
              <div>
                <strong>Important:</strong> Please have the exact amount ready on delivery. 
                Our delivery team will bring your order to the specified location and collect payment in cash.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        {isGuest ? (
          userHasAccount ? (
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
                onClick={() => {
                  if (onShowRegistrationModal) {
                    onShowRegistrationModal();
                  } else {
                    // Fallback ako modal funkcija nije dostupna
                    navigate("/register", {
                      state: {
                        fromOrder: true
                      }
                    });
                  }
                }}
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
        <Link to="/groceries" className="btn btn-outline-secondary ms-2">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CashPaymentSuccess;