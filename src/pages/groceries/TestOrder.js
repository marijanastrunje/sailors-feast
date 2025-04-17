import React from "react";

const TestOrder = () => {
    
    const sendOrderData = async () => {
        const data = {
            amount: 1500,
            email: "kupac@email.com",
            fullName: "Ivan Horvat",
        };

        try {
            const response = await fetch("https://backend.sailorsfeast.com/wp-json/viva/v1/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Neuspjelo slanje podataka.");
            console.log("Podaci poslani. Sada dohvaćam orderCode...");
        } catch (error) {
            console.error("Greška pri slanju podataka:", error);
        }
    };

    const getOrderCode = async () => {
        try {
            const response = await fetch("https://backend.sailorsfeast.com/wp-json/viva/v1/order-code");
            if (!response.ok) throw new Error("Neuspješno dohvaćanje broja narudžbe.");
            
            const data = await response.json();
            console.log("Broj narudžbe:", data.orderCode);

            window.location.href = `https://www.vivapayments.com/web/checkout?ref=${data.orderCode}`;
        } catch (error) {
            console.error("Greška pri dohvaćanju broja narudžbe:", error);
        }
    };

    return (
        <>
            <h1>Test</h1>
            <button onClick={sendOrderData}>Pošalji podatke</button>
            <button onClick={getOrderCode}>Plati sada</button>
        </>
    );
};

export default TestOrder;
