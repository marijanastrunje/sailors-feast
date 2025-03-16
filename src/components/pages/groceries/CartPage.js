import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [listName, setListName] = useState(""); // Naziv liste za spremanje
    const [savedLists, setSavedLists] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Dohvati košaricu iz localStorage
    const fetchCart = () => {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(localCart);
    };

    // Prvi dohvat košarice + osluškivanje promjena
    useEffect(() => {
        fetchCart();
        const handleStorageChange = () => fetchCart();
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Računanje ukupne cijene
    const totalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Uklanjanje proizvoda iz košarice
    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    // Ažuriranje količine proizvoda
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return; // Sprječava negativne količine

        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    // Očisti cijelu košaricu
    const clearCart = () => {
        localStorage.removeItem("cart");
        setCart([]);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    // Dohvati spremljene liste s backenda
    useEffect(() => {
        if (!token) return;

        fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.meta && data.meta.saved_lists) {
                setSavedLists(JSON.parse(data.meta.saved_lists));
            }
        })
        .catch(err => console.error("Greška pri dohvaćanju lista:", err));
    }, [token]);

    // Spremi trenutnu košaricu na backend
    const saveToBackend = () => {
        if (!token) {
            navigate("/login?redirect=/cart");
            return;
        }

        if (!listName.trim()) {
            alert("Unesite naziv liste prije spremanja.");
            return;
        }

        fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ meta: { saved_lists: JSON.stringify({ ...savedLists, [listName]: cart }) } })
        })
        .then(res => res.json())
        .then(() => {
            setSavedLists(prevLists => ({ ...prevLists, [listName]: cart }));
            alert(`Lista "${listName}" je uspješno spremljena!`);
            navigate("/user");
        })
        .catch(err => {
            console.error("Greška pri spremanju liste:", err);
            alert("Nije moguće spremiti listu.");
        });
    };

    // Razdvajanje proizvoda u Box i Groceries sekcije
    const boxProducts = cart.filter((item) => item.box);
    const groceriesProducts = cart.filter((item) => !item.box);

    return (
        <>
        <div className="py-5 text-center">
            <img className="d-block mx-auto mb-4" src="/img/logo/browser.png" alt="" width="72" height="57" />
            <h2>Cart</h2>
            <p className="lead">Here is your order summary.</p>
        </div>

        <div className="container mt-4">
            <div className="row">
                <div className="col-md-10 col-lg-8 mx-auto">
                    
                    {cart.length === 0 ? (
                        <p className="text-center">Košarica je prazna.</p>
                    ) : (
                        <>
                            {/* Sekcija za Box proizvode */}
                            {boxProducts.length > 0 && (
                                <>
                                    <h3 className="text-center text-success mb-3">From Box</h3>
                                    <table className="table table-bordered table-hover text-center">
                                        <thead className="table-secondary">
                                            <tr>
                                                <th>Slika</th>
                                                <th>Proizvod</th>
                                                <th>Quan</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {boxProducts.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="p-0">
                                                        <img 
                                                            src={item.image?.length > 0 ? item.image[0].src : "https://placehold.co/70"} 
                                                            alt={item.title} 
                                                            width="50" 
                                                        />
                                                    </td>
                                                    <td>{item.title} <br /> {item.price} €</td>
                                                    <td>
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <button className="plus-button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                            <span className="mx-2">{item.quantity}</span>
                                                            <button className="plus-button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                        </div>
                                                    </td>
                                                    <td>{(item.price * item.quantity).toFixed(2)} €</td>
                                                    <td><button onClick={() => removeItem(item.id)} className="btn-close"></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            {/* Sekcija za Groceries proizvode */}
                            {groceriesProducts.length > 0 && (
                                <>
                                    <h3 className="text-center text-primary mt-4 mb-3">From Groceries</h3>
                                    <table className="table table-bordered table-hover text-center">
                                        <thead className="table-secondary">
                                            <tr>
                                                <th>Slika</th>
                                                <th>Proizvod</th>
                                                <th>Količina</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groceriesProducts.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="p-0">
                                                        <img 
                                                            src={item.image?.length > 0 ? item.image[0].src : "https://placehold.co/70"} 
                                                            alt={item.title} 
                                                            width="50" 
                                                        />
                                                    </td>
                                                    <td>{item.title} <br /> {item.price} €</td>
                                                    <td>
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <button className="plus-button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                            <span className="mx-2">{item.quantity}</span>
                                                            <button className="plus-button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                        </div>
                                                    </td>
                                                    <td>{(item.price * item.quantity).toFixed(2)} €</td>
                                                    <td><button onClick={() => removeItem(item.id)} className="btn-close"></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </>
                    )}

                    {cart.length > 0 && (
                        <div className="text-center mt-3">
                            <h4>Ukupna cijena: {totalPrice()} €</h4>
                            <button onClick={clearCart} className="btn btn-danger me-2">Očisti košaricu</button>
                            <input 
                                type="text" 
                                placeholder="Unesite naziv liste" 
                                value={listName} 
                                onChange={(e) => setListName(e.target.value)}
                                className="me-2"
                            />
                            <button onClick={saveToBackend} className="btn btn-secondary">Spremi u listu</button>
                            <Link to="/checkout" className="btn btn-primary">Idi na plaćanje</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default CartPage;
