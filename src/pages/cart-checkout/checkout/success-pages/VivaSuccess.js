import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Success = ({ onShowRegistrationModal }) => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const isGuest = sessionStorage.getItem("guest_checkout") === "true";
  const userHasAccount = !!localStorage.getItem("token");

  useEffect(() => {
    const orderIdFromStorage = localStorage.getItem("lastOrderId");
    if (!orderIdFromStorage) {
      setError("No order ID found.");
      setLoading(false);
      return;
    }

    setOrderId(orderIdFromStorage);

    const fetchAndMarkOrder = async () => {
      try {
        const res = await fetch("https://backend.sailorsfeast.com/wp-json/sailorsfeast/v1/mark-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderIdFromStorage }),
        });
        if (!res.ok) throw new Error("Failed to mark order as paid.");

        const orderRes = await fetch(
          `https://backend.sailorsfeast.com/wp-json/wc/v3/orders/${orderIdFromStorage}?consumer_key=${process.env.REACT_APP_WC_KEY}&consumer_secret=${process.env.REACT_APP_WC_SECRET}`
        );
        if (orderRes.ok) {
          const data = await orderRes.json();
          setOrderDetails({
            email: data.billing.email,
            total: data.total,
          });
        }

        localStorage.removeItem("cart");
        localStorage.removeItem("lastOrderId");
        window.dispatchEvent(new Event("cartUpdated"));

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error finalizing your order.");
        setLoading(false);
      }
    };

    fetchAndMarkOrder();
  }, []);

  return (
    <div className="container pb-5 pt-4">
      <div className="text-center mb-4">
        <h2>Thank you for your order!</h2>
        <p className="lead">Your payment was successful.</p>
        {orderDetails?.email && (
          <p>A confirmation email has been sent to <strong>{orderDetails.email}</strong>.</p>
        )}
      </div>

      {loading && <p className="text-center">Processing your order...</p>}
      {error && (
        <div className="alert alert-danger text-center">
          <strong>{error}</strong>
        </div>
      )}

      {!loading && !error && orderId && (
        <div className="text-center">
          <h5 className="mb-3">Order ID: <strong>{orderId}</strong></h5>
          {orderDetails?.total && (
            <p className="mb-3">Total: <strong>€{orderDetails.total}</strong></p>
          )}

          {isGuest ? (
            userHasAccount ? (
              <>
                <p className="text-success mb-3">Your account has been created and you're now logged in.</p>
                <button className="btn btn-prim me-2" onClick={() => navigate("/user")}>
                  View Your Orders
                </button>
              </>
            ) : (
              <>
                <p className="mb-3">Want to track your order and save time next time?</p>
                <button
                  className="btn btn-prim me-2"
                  onClick={() => {
                    if (onShowRegistrationModal) {
                      onShowRegistrationModal();
                    } else {
                      navigate("/register", {
                        state: {
                          email: orderDetails?.email,
                          fromOrder: true,
                        },
                      });
                    }
                  }}
                >
                  Create Account
                </button>
              </>
            )
          ) : (
            <button className="btn btn-prim me-2" onClick={() => navigate("/user")}>
              View Your Orders
            </button>
          )}

          <button className="btn btn-outline-secondary ms-2" onClick={() => navigate("/")}>
            Back to Homepage
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;
