import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useBillingData from "./useBillingData";
import BillingForm from "./BillingForm";
import CartSummary from "./CartSummary";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Checkout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [userId, setUserId] = useState(null);
    const location = useLocation();
    const [paymentFailed, setPaymentFailed] = useState(false);

    useEffect(() => {
        if (!token) navigate("/login?redirect=/checkout");
    }, [navigate, token]);

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("payment") === "failed") {
            setPaymentFailed(true);
        }
    }, [location]);

    const [billing, setBilling] = useBillingData();
    const [cart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [totalPrice, setTotalPrice] = useState(0);

    const lineItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    const handleOrder = async () => {
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

    const handlePayment = async () => {
        const orderId = await handleOrder();
        if (!orderId) return;

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
        }
    };

    return (
        <div className="container pb-5">
            <div className="py-2 text-center">
                <h2>Checkout</h2>
                <p className="lead">
                    Please fill in your billing and shipping details to proceed with payment.
                </p>
            </div>

            {paymentFailed && (
                <div className="alert alert-danger text-center" role="alert">
                    <strong>Payment failed.</strong> Please try again.
                </div>
            )}

            <div className="row g-3">
                <div className="col-md-5 col-lg-4 order-md-last">
                    <CartSummary cart={cart} setTotalPrice={setTotalPrice} />
                </div>

                <div className="col-md-7 ms-lg-5">
                    <BillingForm
                        billing={billing}
                        setBilling={setBilling}
                        handlePayment={handlePayment}
                    />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
