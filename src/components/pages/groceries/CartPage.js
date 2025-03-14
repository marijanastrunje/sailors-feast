import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [listName, setListName] = useState(""); // Naziv liste za spremanje
    const navigate = useNavigate();

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

    // Spremi trenutnu košaricu u korisničku listu
    const saveToList = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login?redirect=/cart"); // Ako korisnik nije prijavljen, preusmjeri ga
            return;
        }

        if (!listName.trim()) {
            alert("Unesite naziv liste prije spremanja.");
            return;
        }

        const savedLists = JSON.parse(localStorage.getItem("savedLists")) || {};
        savedLists[listName] = cart;

        localStorage.setItem("savedLists", JSON.stringify(savedLists));
        alert(`Lista "${listName}" je uspješno spremljena!`);
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
                            <button onClick={saveToList} className="btn btn-secondary">Spremi u listu</button>
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
