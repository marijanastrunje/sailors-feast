import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const VivaSuccess = ({ isGuestCheckout, hasAccount, onShowRegistrationModal }) => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const orderIdFromStorage = localStorage.getItem("lastOrderId");

    if (!orderIdFromStorage) {
      setError("No order ID found.");
      setLoading(false);
      return;
    }

    setOrderId(orderIdFromStorage);

    const updateOrderStatus = async () => {
      try {
        const response = await fetch("https://backend.sailorsfeast.com/wp-json/sailorsfeast/v1/mark-paid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: orderIdFromStorage }),
        });

        if (!response.ok) throw new Error("Error updating order status.");

        // Također možemo dohvatiti detalje narudžbe ako je potrebno
        const orderResponse = await fetch(`https://backend.sailorsfeast.com/wp-json/wc/v3/orders/${orderIdFromStorage}?consumer_key=${process.env.REACT_APP_WC_KEY}&consumer_secret=${process.env.REACT_APP_WC_SECRET}`);
        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          setOrderDetails({
            email: orderData.billing.email,
            total: orderData.total
          });
        }

        localStorage.removeItem("cart");
        localStorage.removeItem("lastOrderId");
        window.dispatchEvent(new Event("cartUpdated"));

        setLoading(false);
      } catch (error) {
        console.error("Failed to update order:", error);
        setError("Error updating your order.");
        setLoading(false);
      }
    };

    updateOrderStatus();
  }, []);

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
        <h2>Thank you for your order!</h2>
        <p className="lead">Your payment has been successfully processed.</p>
        {orderDetails?.email && (
          <p>A confirmation email with all order details has been sent to <strong>{orderDetails.email}</strong></p>
        )}
      </div>

      {loading && (
        <div className="text-center">
          <p>Processing your order...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center">
          <strong>{error}</strong>
        </div>
      )}

      {!loading && !error && orderId && (
        <>
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
                  <p className="mb-2"><strong>Payment Method:</strong> Viva Wallet</p>
                  <p className="mb-2"><strong>Status:</strong> Payment Completed</p>
                  {orderDetails?.total && (
                    <p className="mb-0"><strong>Total:</strong> €{orderDetails.total}</p>
                  )}
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
        </>
      )}
    </div>
  );
};

export default VivaSuccess;