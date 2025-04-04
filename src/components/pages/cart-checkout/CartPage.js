import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [listName, setListName] = useState("");
    const [, setSavedLists] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchCart = () => {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(localCart);
    };

    useEffect(() => {
        fetchCart();
        const handleStorageChange = () => fetchCart();
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const totalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const clearCart = () => {
        localStorage.removeItem("cart");
        setCart([]);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    useEffect(() => {
        if (!token) return;

        fetch(`${backendUrl}/wp-json/wp/v2/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.meta?.saved_lists) {
                    setSavedLists(JSON.parse(data.meta.saved_lists));
                }
            })
            .catch((err) => console.error("Error loading saved lists:", err));
    }, [token]);

    const saveToBackend = async () => {
        if (!token) {
            navigate("/login?redirect=/cart");
            return;
        }

        if (!listName.trim()) {
            alert("Please enter a list name before saving.");
            return;
        }

        try {
            const res = await fetch(
                `${backendUrl}/wp-json/wp/v2/users/me?nocache=` + Date.now(),
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = await res.json();

            let currentLists = {};
            try {
                const parsed = JSON.parse(data.meta?.saved_lists || "{}");
                if (typeof parsed === "object" && parsed !== null) {
                    currentLists = parsed;
                }
            } catch (err) {
                console.warn("⚠️ Failed parsing saved_lists:", err);
            }

            const updatedLists = { ...currentLists, [listName]: cart };

            const saveRes = await fetch(`${backendUrl}/wp-json/wp/v2/users/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    meta: {
                        saved_lists: JSON.stringify(updatedLists)
                    }
                })
            });

            const saveData = await saveRes.json();
            console.log("✅ Saved lists:", updatedLists);
            console.log("📦 Backend response:", saveData);

            setSavedLists(updatedLists);
            alert(`List "${listName}" has been successfully saved!`);
        } catch (err) {
            alert("Unable to save the list.");
        }
    };

    const boxProducts = cart.filter((item) => item.box);
    const groceriesProducts = cart.filter((item) => !item.box);

    return (
        <>
            <div className="py-5 text-center">
                <img
                    className="d-block mx-auto mb-4"
                    src="/img/logo/browser.png"
                    alt="Sailor's Feast logo"
                    width="72"
                    height="57"
                />
                <h2>Cart</h2>
                <p className="lead">Here is your order summary.</p>
            </div>

            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-10 col-lg-8 mx-auto">
                        {cart.length === 0 ? (
                            <p className="text-center">Your cart is currently empty.</p>
                        ) : (
                            <>
                                {boxProducts.length > 0 && (
                                    <>
                                        <h3 className="text-center text-success mb-3">From Box</h3>
                                        <table className="table table-bordered table-hover text-center">
                                            <thead className="table-secondary">
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Product</th>
                                                    <th>Qty</th>
                                                    <th>Total</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {boxProducts.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="p-0">
                                                            <img
                                                                src={
                                                                    item.image?.length > 0
                                                                        ? item.image[0].src
                                                                        : "https://placehold.co/70"
                                                                }
                                                                alt={item.title}
                                                                width="50"
                                                            />
                                                        </td>
                                                        <td>
                                                            {item.title} <br /> {item.price} €
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="plus-button">-</button>
                                                                <span className="mx-2">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="plus-button">+</button>
                                                            </div>
                                                        </td>
                                                        <td>{(item.price * item.quantity).toFixed(2)} €</td>
                                                        <td>
                                                            <button onClick={() => removeItem(item.id)} className="btn-close" aria-label="Remove item"></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                {groceriesProducts.length > 0 && (
                                    <>
                                        <h3 className="text-center text-primary mt-4 mb-3">From Groceries</h3>
                                        <table className="table table-bordered table-hover text-center">
                                            <thead className="table-secondary">
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Product</th>
                                                    <th>Qty</th>
                                                    <th>Total</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {groceriesProducts.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="p-0">
                                                            <img
                                                                src={
                                                                    item.image?.length > 0
                                                                        ? item.image[0].src
                                                                        : "https://placehold.co/70"
                                                                }
                                                                alt={item.title}
                                                                width="50"
                                                            />
                                                        </td>
                                                        <td>
                                                            {item.title} <br /> {item.price} €
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="plus-button">-</button>
                                                                <span className="mx-2">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="plus-button">+</button>
                                                            </div>
                                                        </td>
                                                        <td>{(item.price * item.quantity).toFixed(2)} €</td>
                                                        <td>
                                                            <button onClick={() => removeItem(item.id)} className="btn-close" aria-label="Remove item"></button>
                                                        </td>
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
                                <h4>Total: {totalPrice()} €</h4>
                                <button onClick={clearCart} className="btn btn-danger me-2">Clear Cart</button>
                                <input
                                    type="text"
                                    placeholder="Enter list name"
                                    value={listName}
                                    onChange={(e) => setListName(e.target.value)}
                                    className="me-2"
                                />
                                <button onClick={saveToBackend} className="btn btn-secondary me-2">
                                    Save as List
                                </button>
                                <Link to="/checkout" className="btn btn-primary">
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
