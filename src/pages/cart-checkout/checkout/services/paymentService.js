const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const handleBankTransfer = async (orderId, billing, totalPrice) => {
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
      return null;
    }
    
    return qrData;
  } catch (error) {
    console.error("Payment processing error:", error.message);
    alert("There was an error while processing the payment.");
    return null;
  }
};

export const handleCashPayment = async (orderId) => {
  try {
    // Update order status to "processing"
    const updateResponse = await fetch(`${backendUrl}/wp-json/wc/v3/orders/${orderId}?consumer_key=${process.env.REACT_APP_WC_KEY}&consumer_secret=${process.env.REACT_APP_WC_SECRET}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "processing" })
    });

    if (!updateResponse.ok) {
      throw new Error("Failed to update order status");
    }
    
    return true;
  } catch (error) {
    console.error("Error processing cash payment:", error.message);
    alert("There was an error while processing your order.");
    return false;
  }
};

export const handleVivaPayment = async (orderId, billing, totalPrice) => {
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

    // Return the payment URL
    return `https://www.vivapayments.com/web/checkout?ref=${orderCodeData.orderCode}`;
  } catch (error) {
    console.error("Payment processing error:", error.message);
    alert("There was an error while processing the payment.");
    return null;
  }
};

export const handlePaypalPayment = async (orderId, totalPrice, isGuestCheckout) => {
  try {
    const response = await fetch(`${backendUrl}/wp-json/paypal/v1/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalPrice,
        orderId: orderId,
        returnUrl: `${window.location.origin}/order-success/${orderId}?paypal=success`,
        cancelUrl: `${window.location.origin}/checkout?payment=failed`
      })
    });

    if (!response.ok) {
      throw new Error("Failed to create PayPal order");
    }

    const data = await response.json();
    
    if (data.approvalUrl) {
      return data.approvalUrl;
    } else {
      throw new Error("No approval URL received from PayPal");
    }
  } catch (error) {
    console.error("PayPal payment error:", error.message);
    alert("There was an error initiating PayPal payment.");
    return null;
  }
};