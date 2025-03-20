import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Dohvaća orderId iz localStorage
        const orderIdFromStorage = localStorage.getItem("lastOrderId");

        if (!orderIdFromStorage) {
            setError("Nema spremljenog broja narudžbe.");
            setLoading(false);
            return;
        }

        setOrderId(orderIdFromStorage);

        // Ažuriramo WooCommerce da je narudžba plaćena
        const updateOrderStatus = async () => {
            try {
                const response = await fetch(`https://backend.sailorsfeast.com/wp-json/wc/v3/orders/${orderIdFromStorage}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af"),
                    },
                    body: JSON.stringify({ status: "processing" }),
                });

                if (!response.ok) throw new Error("Greška pri ažuriranju statusa narudžbe.");
                setLoading(false);
            } catch (error) {
                console.error("Neuspjelo ažuriranje narudžbe:", error);
                setError("Greška pri ažuriranju narudžbe.");
                setLoading(false);
            }
        };

        updateOrderStatus();
    }, []);


    return (
        <div className="container">
            <div className="py-5 text-center">
                <h2>Hvala na narudžbi!</h2>
                <p className="lead">Vaša narudžba je uspješno plaćena.</p>
            </div>

            {loading && <p className="text-center">Obrađujemo vašu narudžbu...</p>}

            {error && (
                <div className="alert alert-danger text-center">
                    <strong>{error}</strong>
                </div>
            )}

            {!loading && !error && (
                <div className="text-center">
                    <h4>Broj narudžbe: <strong>{orderId}</strong></h4>
                    <p>Potvrdu ćete uskoro dobiti na e-mail.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/")}>Natrag na početnu</button>
                </div>
            )}
        </div>
    );
};

export default Success;
