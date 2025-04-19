import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useBillingData from "./useBillingData";
import CartSummary from "./CartSummary";
import CheckoutProgressBar from "./CheckoutProgressBar";
import PersonalDetailsStep from "./checkout-steps/PersonalDetailsStep";
import DeliveryDetailsStep from "./checkout-steps/DeliveryDetailsStep";
import PaymentStep from "./checkout-steps/PaymentStep";
import "./CheckoutSteps.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const [billing, setBilling] = useBillingData();
  const [cart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  // Check if user is logged in
  useEffect(() => {
    if (!token) navigate("/login?redirect=/checkout");
  }, [navigate, token]);

  // Fetch user ID
  useEffect(() => {
    if (!token) return;
    fetch(`${backendUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setUserId(data.id))
      .catch((err) => console.error("Error fetching user:", err));
  }, [token]);

  // Check for payment failure from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("payment") === "failed") {
      setPaymentFailed(true);
      setCurrentStep(3); // Go directly to payment step
    }
  }, [location]);

  // Create line items from cart
  const lineItems = cart.map(item => ({
    product_id: item.id,
    quantity: item.quantity
  }));

  // Validate step before proceeding to next
  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!billing.first_name) errors.first_name = "First name is required";
      if (!billing.last_name) errors.last_name = "Last name is required";
      if (!billing.email) errors.email = "Email is required";
      if (!billing.phone) errors.phone = "Phone is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo(0, 0);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  // Create order in WooCommerce
  const createOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add products before placing an order.");
      return null;
    }
    if (!billing.privacyConsent) {
      alert("Please accept the privacy policy before proceeding.");
      return;
    }

    const orderData = {
      customer_id: userId,
      payment_method: "vivawallet",
      payment_method_title: "Viva Wallet",
      set_paid: false,
      status: "pending",
      billing,
      shipping: billing,
      line_items: lineItems,
      meta_data: Object.entries(billing).map(([key, value]) => ({
        key: `billing_${key}`,
        value
      })),
    };

    try {
      const response = await fetch(`${backendUrl}/wp-json/wc/v3/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!data.id) throw new Error("Missing order ID.");
      return data.id;
    } catch (error) {
      console.error("Order creation error:", error.message);
      alert("There was an error while creating the order.");
      return null;
    }
  };

  // Process payment
  const handlePayment = async () => {
    setIsSubmitting(true);
    const orderId = await createOrder();
    if (!orderId) {
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem("lastOrderId", orderId);

    try {
      const response = await fetch(`${backendUrl}/wp-json/viva/v1/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice * 100,
          email: billing.email,
          fullName: `${billing.first_name} ${billing.last_name}`,
          orderId,
        })
      });

      if (!response.ok) throw new Error("Failed to initiate payment.");

      const orderCodeResponse = await fetch(`${backendUrl}/wp-json/viva/v1/order-code`);
      const orderCodeData = await orderCodeResponse.json();
      if (!orderCodeData.orderCode) throw new Error("Order code not returned.");

      window.location.href = `https://www.vivapayments.com/web/checkout?ref=${orderCodeData.orderCode}`;
    } catch (error) {
      console.error("Payment processing error:", error.message);
      alert("There was an error while processing the payment.");
      setIsSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep 
            billing={billing} 
            setBilling={setBilling} 
            errors={validationErrors}
            nextStep={nextStep}
            isSubmitting={isSubmitting}
          />
        );
      case 2:
        return (
          <DeliveryDetailsStep 
            billing={billing} 
            setBilling={setBilling} 
            nextStep={nextStep}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return (
          <PaymentStep 
            billing={billing}
            setBilling={setBilling}
            handlePayment={handlePayment}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <PersonalDetailsStep billing={billing} setBilling={setBilling} nextStep={nextStep} />;
    }
  };

  return (
    <div className="container pb-5">
      <div className="py-2 text-center">
        <h2>Checkout</h2>
        <p className="lead">Complete your order in a few steps</p>
      </div>

      {paymentFailed && (
        <div className="alert alert-danger text-center" role="alert">
          <strong>Payment failed.</strong> Please try again.
        </div>
      )}

      <CheckoutProgressBar currentStep={currentStep} />

      <div className="row g-3">
        <div className="col-md-5 col-lg-4 order-md-last">
          <CartSummary cart={cart} setTotalPrice={setTotalPrice} />
        </div>

        <div className="col-md-7 col-lg-7 ms-lg-5">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Checkout;