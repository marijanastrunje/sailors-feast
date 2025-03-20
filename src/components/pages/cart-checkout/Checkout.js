import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import useBillingData from "./useBillingData";
import BillingForm from "./BillingForm";
import CartSummary from "./CartSummary";

const Checkout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) navigate("/login?redirect=/checkout");
    }, [navigate, token]);

    const [billing, setBilling] = useBillingData();
    const [cart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [totalPrice, setTotalPrice] = useState(0);

    const lineItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    const handleOrder = async () => {
        if (cart.length === 0) {
            alert("Košarica je prazna. Dodajte proizvode prije narudžbe.");
            return null;
        }

        const orderData = {
            payment_method: "vivawallet",
            payment_method_title: "Viva Wallet",
            set_paid: false,
            status: "pending",
            billing,
            shipping: billing,
            line_items: lineItems,
            meta_data: Object.entries(billing).map(([key, value]) => ({ key: `billing_${key}`, value })),
        };

        try {
            const response = await fetch("https://backend.sailorsfeast.com/wp-json/wc/v3/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af")
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            if (!data.id) throw new Error("Greška: Nema `order_id`.");
            
            return data.id;
        } catch (error) {
            console.error("Greška pri kreiranju narudžbe:", error.message);
            alert("Došlo je do greške pri kreiranju narudžbe.");
            return null;
        }
    };

    const handlePayment = async () => {
        const orderId = await handleOrder();
        if (!orderId) return;

        try {
            const response = await fetch("https://backend.sailorsfeast.com/wp-json/viva/v1/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: totalPrice * 100,
                    email: billing.email,
                    fullName: `${billing.first_name} ${billing.last_name}`,
                    orderId,
                })
            });

            if (!response.ok) throw new Error("Neuspješno slanje podataka.");

            const orderCodeResponse = await fetch("https://backend.sailorsfeast.com/wp-json/viva/v1/order-code");
            const orderCodeData = await orderCodeResponse.json();
            if (!orderCodeData.orderCode) throw new Error("Order Code nije vraćen.");

            window.location.href = `https://www.vivapayments.com/web/checkout?ref=${orderCodeData.orderCode}`;
        } catch (error) {
            console.error("Greška pri obradi plaćanja:", error.message);
            alert("Došlo je do greške pri obradi plaćanja.");
        }
    };

    return (
        <div className="container pb-5">
            <div className="py-5 text-center">
                <img className="d-block mx-auto mb-4" src="/img/logo.png" alt="Logo" width="72" height="57" />
                <h2>Checkout form</h2>
                <p className="lead">Ispunite podatke za dostavu i plaćanje.</p>
            </div>

            <div className="row g-3">
                <div className="col-md-5 col-lg-4 order-md-last">
                    <CartSummary cart={cart} setTotalPrice={setTotalPrice} />
                </div>

                <div className="col-md-7 ms-lg-5">
                    <BillingForm billing={billing} setBilling={setBilling} handlePayment={handlePayment} />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
