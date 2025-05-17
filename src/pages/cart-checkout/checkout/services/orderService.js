const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const createOrder = async (cart, billing, userId, selectedPaymentMethod, isGuestCheckout, checkDeliveryDateWarning) => {
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
      return null;
    }
  }

  // Create line items from cart
  const lineItems = cart.map(item => ({
    product_id: item.id,
    quantity: item.quantity
  }));

  // Set payment method to PayPal when creating order for PayPal payment
  const paymentMethod = selectedPaymentMethod === "paypal" ? "paypal" : selectedPaymentMethod;
  const paymentMethodTitle = selectedPaymentMethod === "vivawallet" 
    ? "Viva Wallet" 
    : selectedPaymentMethod === "cash"
      ? "Cash on Delivery"
      : selectedPaymentMethod === "paypal"
        ? "PayPal"
        : "Bank Transfer";

  // Prepare order data
  const orderData = {
    customer_id: userId || 0, // Use 0 for guest checkout
    payment_method: paymentMethod === "cash" ? "cod" : paymentMethod,
    payment_method_title: paymentMethodTitle,
    set_paid: false,
    status: selectedPaymentMethod === "banktransfer" ? "on-hold" : selectedPaymentMethod === "cash" ? "processing" : "pending", 
    billing: {
      first_name: billing.first_name,
      last_name: billing.last_name,
      email: billing.email,
      phone: billing.phone
    },
    shipping: {
      first_name: billing.first_name,
      last_name: billing.last_name
    },
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
    // Create order via WooCommerce API
    const response = await fetch(`${backendUrl}/wp-json/wc/v3/orders?consumer_key=${process.env.REACT_APP_WC_KEY}&consumer_secret=${process.env.REACT_APP_WC_SECRET}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order.");
    }

    const data = await response.json();
    if (!data.id) throw new Error("Missing order ID.");
    
    return data.id;
  } catch (error) {
    console.error("Order creation error:", error.message);
    alert("There was an error while creating the order: " + error.message);
    return null;
  }
};