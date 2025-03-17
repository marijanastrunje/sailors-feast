import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const Checkout = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login?redirect=/checkout"); 
        }
    }, [navigate, token]);

    const [cart, setCart] = useState([]);
    const [billing, setBilling] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        number_of_guests: "",
        marina: "",
        charter: "",
        boat: "",
        gate: "",
        delivery_date: "",
        delivery_time: "",
        order_notes: ""
    });

    const [showCart, setShowCart] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setShowCart(window.innerWidth >= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const toggleCart = () => {
        setShowCart(!showCart);
    };

    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(localCart);
    }, []);

    const lineItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    // Razdvajanje proizvoda
    const boxProducts = cart.filter(item => item.box);
    const groceriesProducts = cart.filter(item => !item.box);

    const totalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleOrder = async () => {
        if (cart.length === 0) {
            alert("Košarica je prazna. Dodajte proizvode prije narudžbe.");
            return;
        }
    
        // Kreiranje podataka za WooCommerce narudžbu
        const orderData = {
            payment_method: "vivawallet",
            payment_method_title: "Viva Wallet",
            set_paid: false, // Ne označavamo kao plaćeno jer čekamo potvrdu plaćanja
            status: "pending", // Ovdje postavljamo status narudžbe kao "pending_payment"
            billing,
            shipping: billing,
            line_items: lineItems,
            meta_data: [
                { key: "billing_number_of_guests", value: billing.number_of_guests },
                { key: "billing_marina", value: billing.marina },
                { key: "billing_charter", value: billing.charter },
                { key: "billing_boat", value: billing.boat },
                { key: "billing_gate", value: billing.gate },
                { key: "billing_delivery_date", value: billing.delivery_date },
                { key: "billing_delivery_time", value: billing.delivery_time },
                { key: "billing_order_notes", value: billing.order_notes }
            ],
        };
    
        try {
            // Slanje narudžbe u WooCommerce
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
    
            console.log("WooCommerce narudžba kreirana:", data.id);
    
            // Vraćamo `order_id` kako bismo ga koristili u `handlePayment`
            return data.id;
    
        } catch (error) {
            console.error("Greška pri kreiranju WooCommerce narudžbe:", error.message);
            alert("Došlo je do greške pri kreiranju narudžbe.");
        }
    };

    const handlePayment = async () => {
        if (cart.length === 0) {
            alert("Košarica je prazna. Dodajte proizvode prije narudžbe.");
            return;
        }

         // Prvo kreiramo narudžbu u WooCommerce i dobijemo `order_id`
         const orderId = await handleOrder();
         if (!orderId) throw new Error("Nije moguće kreirati narudžbu.");   
    
        // Priprema podataka za slanje na backend
        const data = {
            amount: totalPrice() * 100,  // Viva Payments traži iznos u centima
            email: billing.email,
            fullName: `${billing.first_name} ${billing.last_name}`,
            orderId: orderId,
        };
    
        try {
            // Slanje podataka na backend
            const response = await fetch("https://backend.sailorsfeast.com/wp-json/viva/v1/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) throw new Error("Neuspješno slanje podataka.");
            console.log("Podaci poslani. Sada dohvaćam orderCode...");
    
            // Sada posebno dohvaćamo orderCode iz GET endpointa
            const orderCodeResponse = await fetch("https://backend.sailorsfeast.com/wp-json/viva/v1/order-code");
            if (!orderCodeResponse.ok) throw new Error("Neuspješno dohvaćanje orderCode-a.");
    
            const orderCodeData = await orderCodeResponse.json();
            if (!orderCodeData.orderCode) throw new Error("Order Code nije vraćen.");
    
            console.log("Viva orderCode:", orderCodeData.orderCode);
    
            // Preusmjeri korisnika na Viva Payments Checkout
            window.location.href = `https://www.vivapayments.com/web/checkout?ref=${orderCodeData.orderCode}`;
            
        } catch (error) {
            console.error("Greška pri obradi plaćanja:", error.message);
            alert("Došlo je do greške pri obradi plaćanja.");
        }
    };

    const autofillCheckoutData = () => {
        if (!token) {
            alert("Morate biti prijavljeni da biste popunili podatke.");
            return;
        }

        fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                setBilling({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    phone: data.phone || "",
                    marina: data.marina || "",
                    charter: data.charter || "",
                    boat: data.boat || "",
                    gate: data.gate || "",
                    delivery_date: billing.delivery_date,  // Ostavlja korisnikov unos ako ga ima
                    delivery_time: billing.delivery_time,
                    order_notes: billing.order_notes
                });
                alert("Podaci su uspješno popunjeni!");
            } else {
                alert("Greška pri dohvaćanju podataka korisnika.");
            }
        })
        .catch(error => {
            console.error("Greška pri dohvaćanju podataka korisnika:", error);
            alert("Nije moguće dohvatiti korisničke podatke.");
        });
    };  

    return (
        <div className="container pb-5">
            <div className="py-5 text-center">
                <img className="d-block mx-auto mb-4" src="/img/logo.png" alt="Logo" width="72" height="57" />
                <h2>Checkout form</h2>
                <p className="lead">Ispunite podatke za dostavu i plaćanje.</p>
                <button type="button" className="btn btn-secondary" onClick={autofillCheckoutData}>
                    Popuni podatke iz usera
                </button>
            </div>

            <div className="row g-5">
                <div className="col-md-5 col-lg-4 order-md-last">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-primary">Vaša košarica</span>
                        <span className="badge bg-primary rounded-pill">{cart.length}</span>
                        <button className="btn btn-outline-primary d-md-none" onClick={toggleCart}>
                            {showCart ? "▲" : "▼"}
                        </button>
                    </h4>
                    {showCart && (
                        <>
                            {/* Sekcija za Box proizvode */}
                            {boxProducts.length > 0 && (
                                <>
                                    <h5 className="text-success">From Box</h5>
                                    <ul className="list-group mb-3">
                                        {boxProducts.map((item) => (
                                            <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                                                <div>
                                                    <h6 className="my-0">{item.title}</h6>
                                                    <small className="text-muted">x{item.quantity}</small>
                                                </div>
                                                <span className="text-muted">{item.price} €</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {/* Sekcija za Groceries proizvode */}
                            {groceriesProducts.length > 0 && (
                                <>
                                    <h5 className="text-primary">From Groceries</h5>
                                    <ul className="list-group mb-3">
                                        {groceriesProducts.map((item) => (
                                            <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                                                <div>
                                                    <h6 className="my-0">{item.title}</h6>
                                                    <small className="text-muted">x{item.quantity}</small>
                                                </div>
                                                <span className="text-muted">{item.price} €</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </>
                    )}
                    <div className="text-center">
                        <h4>Ukupna cijena: {totalPrice()} €</h4>
                    </div>
                </div>

                <div className="col-md-7 col-lg-8">
                    <h4 className="mb-3">Billing details</h4>
                    <form className="needs-validation">
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label className="form-label">First name</label>
                                <input type="text" className="form-control" value={billing.first_name} onChange={e => setBilling({ ...billing, first_name: e.target.value })} required />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">Last name</label>
                                <input type="text" className="form-control" value={billing.last_name} onChange={e => setBilling({ ...billing, last_name: e.target.value })} required />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" value={billing.email} onChange={e => setBilling({ ...billing, email: e.target.value })} required />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Phone</label>
                                <input type="text" className="form-control" value={billing.phone} onChange={e => setBilling({ ...billing, phone: e.target.value })} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Number of guests</label>
                                <input type="number" className="form-control" value={billing.number_of_guests} onChange={e => setBilling({ ...billing, number_of_guests: e.target.value })} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Marina</label>
                                <input type="text" className="form-control" value={billing.marina} onChange={e => setBilling({ ...billing, marina: e.target.value })} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Charter</label>
                                <input type="text" className="form-control" value={billing.charter} onChange={e => setBilling({ ...billing, charter: e.target.value })} required />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Boat</label>
                                <input type="text" className="form-control" value={billing.boat} onChange={e => setBilling({ ...billing, boat: e.target.value })} required />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Gate</label>
                                <input type="text" className="form-control" value={billing.gate} onChange={e => setBilling({ ...billing, gate: e.target.value })} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Preferred delivery date</label>
                                <input type="date" className="form-control" value={billing.delivery_date} onChange={e => setBilling({ ...billing, delivery_date: e.target.value })} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Preferred delivery time</label>
                                <input type="time" className="form-control" value={billing.delivery_time} onChange={e => setBilling({ ...billing, delivery_time: e.target.value })} required />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Order notes</label>
                                <textarea className="form-control" value={billing.order_notes} onChange={e => setBilling({ ...billing, order_notes: e.target.value })}></textarea>
                            </div>
                        </div>

                        <hr className="my-4" />
                        <button className="w-100 btn btn-primary btn-lg" type="button" onClick={handlePayment}>Plati s Viva Wallet</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;