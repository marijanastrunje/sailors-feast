import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useBillingData from "./useBillingData";
import CartSummary from "./CartSummary";
import CheckoutProgressBar from "./CheckoutProgressBar";
import PersonalDetailsStep from "./checkout-steps/PersonalDetailsStep";
import DeliveryDetailsStep from "./checkout-steps/DeliveryDetailsStep";
import PaymentStep from "./checkout-steps/PaymentStep";
import QRCodePayment from "./QRCodePayment";
import "./CheckoutSteps.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isGuestCheckout = sessionStorage.getItem("guest_checkout") === "true";
  
  const [userId, setUserId] = useState(null);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("vivawallet");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [showDeliveryWarning, setShowDeliveryWarning] = useState(false);
  const [hasCheckedDeliveryDate, setHasCheckedDeliveryDate] = useState(false);

  const [billing, setBilling] = useBillingData();
  const [cart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  // Check if user is logged in for non-guest checkout
  useEffect(() => {
    if (!isGuestCheckout && !token) {
      navigate("/login?redirect=/checkout");
    }
  }, [navigate, token, isGuestCheckout]);

  // Fetch user ID if logged in
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

  // Calculate if delivery warning should be shown (if delivery date is less than 7 days away)
  const checkDeliveryDateWarning = useCallback((deliveryDate) => {
    if (!deliveryDate) return false;
    
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const differenceInTime = delivery.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    
    return differenceInDays < 7;
  }, []);

  // Update delivery warning when delivery date changes
  useEffect(() => {
    if (billing.delivery_date && !hasCheckedDeliveryDate) {
      const needsWarning = checkDeliveryDateWarning(billing.delivery_date);
      setShowDeliveryWarning(needsWarning);
      setHasCheckedDeliveryDate(true);
    }
  }, [billing.delivery_date, checkDeliveryDateWarning, hasCheckedDeliveryDate]);

  // Validate step before proceeding to next
  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!billing.first_name) errors.first_name = "First name is required";
      if (!billing.last_name) errors.last_name = "Last name is required";
      if (!billing.email) errors.email = "Email is required";
      if (!billing.phone) errors.phone = "Phone is required";
    }
    
    // Validate delivery details if delivery date is less than 7 days away
    if (step === 2 && showDeliveryWarning) {
      if (!billing.marina) errors.marina = "Marina is required";
      if (!billing.charter) errors.charter = "Charter is required";
      if (!billing.boat) errors.boat = "Boat is required";
      if (!billing.gate) errors.gate = "Gate/pier is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      // If delivery date is set in step 2 and we haven't checked it yet
      if (currentStep === 2 && billing.delivery_date && !hasCheckedDeliveryDate) {
        const needsWarning = checkDeliveryDateWarning(billing.delivery_date);
        setShowDeliveryWarning(needsWarning);
        setHasCheckedDeliveryDate(true);
        
        // If warning is needed and we don't have all required fields, stop progression
        if (needsWarning && (!billing.marina || !billing.charter || !billing.boat || !billing.gate)) {
          setValidationErrors({
            marina: !billing.marina ? "Marina is required" : undefined,
            charter: !billing.charter ? "Charter is required" : undefined,
            boat: !billing.boat ? "Boat is required" : undefined,
            gate: !billing.gate ? "Gate/pier is required" : undefined
          });
          return;
        }
      }
      
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
      return null;
    }

    // Check if delivery date is less than 7 days away and delivery details are missing
    if (billing.delivery_date) {
      const needsDeliveryDetails = checkDeliveryDateWarning(billing.delivery_date);
      
      if (needsDeliveryDetails && (!billing.marina || !billing.charter || !billing.boat || !billing.gate)) {
        alert("Delivery details are required for orders with delivery date less than 7 days away.");
        setCurrentStep(2); // Go back to delivery details step
        return null;
      }
    }

    // Prepare order data
    const orderData = {
      customer_id: userId || 0, // Use 0 for guest checkout
      payment_method: selectedPaymentMethod,
      payment_method_title: selectedPaymentMethod === "vivawallet" ? "Viva Wallet" : "Bank Transfer",
      set_paid: false,
      status: selectedPaymentMethod === "banktransfer" ? "on-hold" : "pending",
      billing,
      shipping: billing,
      line_items: lineItems,
      meta_data: [
        ...Object.entries(billing).map(([key, value]) => ({
          key: `billing_${key}`,
          value
        })),
        {
          key: "is_guest_checkout",
          value: isGuestCheckout ? "yes" : "no"
        },
        {
          key: "payment_deadline",
          value: billing.delivery_date ? new Date(new Date(billing.delivery_date).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : ""
        }
      ],
    };

    try {
      // For guest checkout, we need to create a customer first
      let authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`${backendUrl}/wp-json/wc/v3/orders`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...authHeader
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!data.id) throw new Error("Missing order ID.");
      
      setOrderId(data.id);
      setOrderCreated(true);
      return data.id;
    } catch (error) {
      console.error("Order creation error:", error.message);
      alert("There was an error while creating the order.");
      return null;
    }
  };

  // Handle bank transfer payment
  const handleBankTransfer = async () => {
    setIsSubmitting(true);
    const orderId = await createOrder();
    if (!orderId) {
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem("lastOrderId", orderId);

    try {
      // Generate QR code data
      const qrData = {
        orderId,
        customerName: `${billing.first_name} ${billing.last_name}`,
        amount: totalPrice,
        email: billing.email,
        reference: `ORDER-${orderId}`,
        paymentDeadline: billing.delivery_date
          ? new Date(new Date(billing.delivery_date).getTime() - 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : ""
      };
      

      // Save QR code data to order
      const qrResponse = await fetch(`${backendUrl}/wp-json/sailorsfeast/v1/save-qr-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qrData)
      });
      
      const qrResult = await qrResponse.json();
      
      if (!qrResponse.ok || !qrResult.success) {
        console.error("QR save failed:", qrResult.message);
        alert("There was an error saving QR code data: " + (qrResult.message || "Unknown error"));
        setIsSubmitting(false);
        return;
      }
      

      setQrCodeData(qrData);
      setIsSubmitting(false);
      
      // Clear cart after successful order
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      
    } catch (error) {
      console.error("Payment processing error:", error.message);
      alert("There was an error while processing the payment.");
      setIsSubmitting(false);
    }
  };

  // Process payment via Viva Wallet
  const handlePayment = async () => {
    setIsSubmitting(true);
    const orderId = await createOrder();
    if (!orderId) {
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem("lastOrderId", orderId);

    try {
      // First part: Send order details to Viva API
      const response = await fetch(`${backendUrl}/wp-json/viva/v1/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100), // Ensure amount is in cents and properly rounded
          email: billing.email,
          fullName: `${billing.first_name} ${billing.last_name}`,
          orderId, // Pass orderId properly
        })
      });

      if (!response.ok) {
        console.error("Failed to initiate payment, response status:", response.status);
        throw new Error("Failed to initiate payment.");
      }

      // Second part: Get the order code
      const orderCodeResponse = await fetch(`${backendUrl}/wp-json/viva/v1/order-code`);
      
      if (!orderCodeResponse.ok) {
        console.error("Failed to get order code, response status:", orderCodeResponse.status);
        throw new Error("Failed to get order code.");
      }
      
      const orderCodeData = await orderCodeResponse.json();
      
      if (!orderCodeData.orderCode) {
        console.error("Order code not returned in response:", orderCodeData);
        throw new Error("Order code not returned.");
      }

      // Clear cart before redirecting to payment page
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      // Redirect to payment page with the order code
      window.location.href = `https://www.vivapayments.com/web/checkout?ref=${orderCodeData.orderCode}`;
    } catch (error) {
      console.error("Payment processing error:", error.message);
      alert("There was an error while processing the payment.");
      setIsSubmitting(false);
    }
  };

  // Process the selected payment method
  const processPayment = () => {
    if (selectedPaymentMethod === "banktransfer") {
      handleBankTransfer();
    } else {
      handlePayment();
    }
  };

  // Render current step
  const renderStep = () => {
    // If we've already created the order and selected bank transfer, show QR code
    if (orderCreated && selectedPaymentMethod === "banktransfer" && qrCodeData) {
      return <QRCodePayment qrData={qrCodeData} orderId={orderId} />;
    }

    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep 
            billing={billing} 
            setBilling={setBilling} 
            errors={validationErrors}
            nextStep={nextStep}
            isSubmitting={isSubmitting}
            isGuestCheckout={isGuestCheckout}
          />
        );
      case 2:
        return (
          <DeliveryDetailsStep 
            billing={billing} 
            setBilling={setBilling}
            errors={validationErrors}
            showWarning={showDeliveryWarning} 
            nextStep={nextStep}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
            setShowDeliveryWarning={setShowDeliveryWarning}
            checkDeliveryDateWarning={checkDeliveryDateWarning}
            setHasCheckedDeliveryDate={setHasCheckedDeliveryDate}
          />
        );
      case 3:
        return (
          <PaymentStep 
            billing={billing}
            setBilling={setBilling}
            handlePayment={processPayment}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            showDeliveryWarning={showDeliveryWarning}
            deliveryDate={billing.delivery_date}
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