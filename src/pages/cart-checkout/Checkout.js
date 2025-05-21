// Checkout.js
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useBillingData from "./checkout/useBillingData";
import CartSummary from "./checkout/CartSummary";
import CheckoutProgressBar from "./checkout/CheckoutProgressBar";
import PersonalDetailsStep from "./checkout/checkout-steps/PersonalDetailsStep";
import DeliveryDetailsStep from "./checkout/checkout-steps/DeliveryDetailsStep";
import PaymentStep from "./checkout/checkout-steps/PaymentStep";
import QRCodePayment from "./checkout/success-pages/QRCodeSuccess";
import PayPalSuccess from "./checkout/success-pages/PayPalSuccess";
import CashPaymentSuccess from "./checkout/success-pages/CashPaymentSuccess";
import GuestRegistrationModal from "./checkout/checkout-steps/GuestRegistrationModal";
import { createOrder } from "./checkout/services/orderService";
import { 
  handleBankTransfer, 
  handleCashPayment, 
  handleVivaPayment, 
  handlePaypalPayment 
} from "./checkout/services/paymentService";
import { handleGuestRegistration } from "./checkout/services/userService";
import { checkDeliveryDateWarning, validateStep } from "./checkout/utilities/checkoutUtils";
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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

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
    if (!token || isGuestCheckout) return;
    
    fetch(`${backendUrl}/wp-json/wp/v2/users/me?no_cache=${Date.now()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setUserId(data.id))
      .catch((err) => console.error("Error fetching user:", err));
  }, [token, isGuestCheckout]);

  // Check for payment failure from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Provjeri za neuspjelo plaćanje
    if (params.get("payment") === "failed") {
      setPaymentFailed(true);
      setCurrentStep(1); 
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Provjeri je li korisnik vratio s PayPal-a nakon uspješne uplate
    if (params.get("paypal") === "success") {
      const pathParts = location.pathname.split('/');
      const orderId = pathParts[pathParts.length - 1];
      
      if (orderId) {
        setOrderId(orderId);
        setOrderCreated(true);
        setSelectedPaymentMethod("paypal");
      }
    }
  }, [location]);

  useEffect(() => {
    if (orderCreated) {
      window.scrollTo(0, 0);
    }
  }, [orderCreated]);

  // Koristi checkDeliveryDateWarning kao callback
  const checkDeliveryDateWarningCallback = useCallback(checkDeliveryDateWarning, []);

  // Update delivery warning when delivery date changes
  useEffect(() => {
    if (billing.delivery_date && !hasCheckedDeliveryDate) {
      const needsWarning = checkDeliveryDateWarningCallback(billing.delivery_date);
      setShowDeliveryWarning(needsWarning);
      setHasCheckedDeliveryDate(true);
    }
  }, [billing.delivery_date, checkDeliveryDateWarningCallback, hasCheckedDeliveryDate]);

  // Validate step before proceeding to next
  const validateCurrentStep = (step) => {
    const { errors, isValid } = validateStep(step, billing, showDeliveryWarning);
    setValidationErrors(errors);
    return isValid;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateCurrentStep(currentStep)) {
      // If delivery date is set in step 2 and we haven't checked it yet
      if (currentStep === 2 && billing.delivery_date && !hasCheckedDeliveryDate) {
        const needsWarning = checkDeliveryDateWarningCallback(billing.delivery_date);
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

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    // Reset payment failed message when user selects a new payment method
    if (paymentFailed) {
      setPaymentFailed(false);
    }
  };

  // Handle guest registration after successful order
  const handleGuestRegistrationClick = async (password, userType) => {
    setIsSubmitting(true);
    try {
      const newUserId = await handleGuestRegistration(billing, password, userType, orderId);
      if (newUserId) {
        setUserId(newUserId);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setIsSubmitting(false);
      setShowRegistrationModal(false);
    }
  };

  // Process the selected payment method
  const processPayment = async () => {
    setIsSubmitting(true);
    try {
      let newOrderId;

      if (selectedPaymentMethod === "banktransfer") {
        // Create order and handle bank transfer
        newOrderId = await createOrder(cart, billing, userId, selectedPaymentMethod, isGuestCheckout, checkDeliveryDateWarningCallback);
        if (!newOrderId) {
          setIsSubmitting(false);
          return;
        }
        
        setOrderId(newOrderId);
        localStorage.setItem("lastOrderId", newOrderId);
        
        const qrData = await handleBankTransfer(newOrderId, billing, totalPrice);
        if (qrData) {
          setQrCodeData(qrData);
          setOrderCreated(true);
          
          // Clear cart after successful order
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));
          
          // If it was a guest checkout, offer registration after successful order
          if (isGuestCheckout) {
            setShowRegistrationModal(true);
          }
        }
      } else if (selectedPaymentMethod === "cash") {
        // Create order and handle cash payment
        newOrderId = await createOrder(cart, billing, userId, selectedPaymentMethod, isGuestCheckout, checkDeliveryDateWarningCallback);
        if (!newOrderId) {
          setIsSubmitting(false);
          return;
        }
        
        setOrderId(newOrderId);
        localStorage.setItem("lastOrderId", newOrderId);
        
        const success = await handleCashPayment(newOrderId);
        if (success) {
          // Clear cart after successful order
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));
          
          // If it was a guest checkout, offer registration
          if (isGuestCheckout) {
            setShowRegistrationModal(true);
          }
          
          // Redirect to order success page
          navigate(`/cash-payment-success/${newOrderId}`);
        }
      } else if (selectedPaymentMethod === "paypal") {
        // Create order and handle PayPal payment
        newOrderId = await createOrder(cart, billing, userId, selectedPaymentMethod, isGuestCheckout, checkDeliveryDateWarningCallback);
        if (!newOrderId) {
          setIsSubmitting(false);
          return;
        }
        
        setOrderId(newOrderId);
        localStorage.setItem("lastOrderId", newOrderId);
        
        sessionStorage.setItem("guest_checkout", isGuestCheckout ? "true" : "false");
        
        const approvalUrl = await handlePaypalPayment(newOrderId, totalPrice, isGuestCheckout);
        if (approvalUrl) {
          window.location.href = approvalUrl;
        }
      } else {
        // Create order and handle Viva payment
        newOrderId = await createOrder(cart, billing, userId, selectedPaymentMethod, isGuestCheckout, checkDeliveryDateWarningCallback);
        if (!newOrderId) {
          setIsSubmitting(false);
          return;
        }
        
        setOrderId(newOrderId);
        localStorage.setItem("lastOrderId", newOrderId);
        
        const paymentUrl = await handleVivaPayment(newOrderId, billing, totalPrice);
        if (paymentUrl) {
          // Ovdje NE brišemo cart, jer ćemo to raditi nakon povratka sa Vive
          sessionStorage.setItem("guest_checkout", isGuestCheckout ? "true" : "false");
          localStorage.setItem("lastOrderId", newOrderId);
          
          window.location.href = paymentUrl;
        }
      }
    } catch (error) {
      console.error("Payment processing error:", error.message);
      alert("There was an error while processing the payment.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render current step
  const renderStep = () => {
    const params = new URLSearchParams(location.search);
    const isPayPalSuccess = params.get("paypal") === "success";
    const isCashSuccess = location.pathname.includes("/cash-payment-success/");

    if (isPayPalSuccess && orderCreated) {
      return (
        <PayPalSuccess
          orderId={orderId}
          isGuestCheckout={isGuestCheckout}
          hasAccount={!!token}
          onShowRegistrationModal={() => setShowRegistrationModal(true)}
          showRegistrationModal={showRegistrationModal}
        />
      );
    }

    // Cash Success
    if (isCashSuccess) {
      return (
        <CashPaymentSuccess
          isGuestCheckout={isGuestCheckout}
          hasAccount={!!token}
          onShowRegistrationModal={() => setShowRegistrationModal(true)}
        />
      );
    }

    // Ako je bank transfer
    if (orderCreated && selectedPaymentMethod === "banktransfer" && qrCodeData) {
      return (
        <QRCodePayment 
          qrData={qrCodeData}
          orderId={orderId}
          isGuestCheckout={isGuestCheckout}
          hasAccount={!!token}
          onShowRegistrationModal={() => setShowRegistrationModal(true)}
        />
      );
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
            setValidationErrors={setValidationErrors}
            showWarning={showDeliveryWarning} 
            nextStep={nextStep}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
            setShowDeliveryWarning={setShowDeliveryWarning}
            checkDeliveryDateWarning={checkDeliveryDateWarningCallback}
            setHasCheckedDeliveryDate={setHasCheckedDeliveryDate}
          />
        );
      case 3:
        return (
          <PaymentStep 
            billing={billing}
            setBilling={setBilling}
            handlePayment={processPayment}
            handlePaypalPayment={processPayment}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={handlePaymentMethodChange}
            showDeliveryWarning={showDeliveryWarning}
            deliveryDate={billing.delivery_date}
            orderId={orderId}
            totalPrice={totalPrice}
            isGuestCheckout={isGuestCheckout}
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

      {/* Guest registration modal */}
      {showRegistrationModal && (
        <GuestRegistrationModal 
          show={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          onRegister={handleGuestRegistrationClick}
          userInfo={{
            email: billing.email,
            firstName: billing.first_name,
            lastName: billing.last_name
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default Checkout;