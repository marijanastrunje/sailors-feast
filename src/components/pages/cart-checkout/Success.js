import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        localStorage.removeItem("cart");
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

  return (
    <div className="container">
      <div className="pb-3 pt-5 text-center">
        <h2>Thank you for your order!</h2>
        <p className="lead">Your order has been successfully paid.</p>
      </div>

      {loading && <p className="text-center">Processing your order...</p>}

      {error && (
        <div className="alert alert-danger text-center">
          <strong>{error}</strong>
        </div>
      )}

      {!loading && !error && (
        <div className="text-center">
          <h4>Order ID: <strong>{orderId}</strong></h4>
          <p>You will receive confirmation by email shortly.</p>
          <button
            className="btn btn-prim mb-5"
            aria-label="Back to homepage"
            onClick={() => navigate("/")}
          >
            Back to homepage
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;
