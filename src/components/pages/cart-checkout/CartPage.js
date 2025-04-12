import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './CartPage.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [listName, setListName] = useState("");
  const [, setSavedLists] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
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
    const updatedCart = cart.map((item) => item.id === id ? { ...item, quantity: newQuantity } : item);
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
    fetch(`${backendUrl}/wp-json/wp/v2/users/me`, { headers: { Authorization: `Bearer ${token}` } })
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
      const res = await fetch(`${backendUrl}/wp-json/wp/v2/users/me?nocache=` + Date.now(), { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();

      let currentLists = {};
      try {
        const parsed = JSON.parse(data.meta?.saved_lists || "{}");
        if (typeof parsed === "object" && parsed !== null) {
          currentLists = parsed;
        }
      } catch (err) {
        console.warn(" Failed parsing saved_lists:", err);
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
      console.log(" Saved lists:", updatedLists);
      console.log(" Backend response:", saveData);

      setSavedLists(updatedLists);
      alert(`List "${listName}" has been successfully saved!`);
    } catch (err) {
      alert("Unable to save the list.");
    }
    setShowSaveModal(false);
  };

  const boxProducts = cart.filter((item) => item.box);
  const groceriesProducts = cart.filter((item) => !item.box);

  return (
    <>
      <div className="pt-2 text-center">
        <h1 className="mb-0">Cart</h1>
        <img className="d-block mx-auto my-2" src="/img/groceries/shopping-cart.png" alt="Cart" width="100" height="100" />
        <p className="lead m-0">Here is your order summary.</p>
      </div>

      <div className="container">
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
                          <th style={{ width: "80px" }}>Image</th>
                          <th style={{ width: "30%" }}>Product</th>
                          <th style={{ width: "20%" }}>Qty</th>
                          <th style={{ width: "25%" }}>Total</th>
                          <th style={{ width: "30px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {boxProducts.map((item) => (
                          <tr key={item.id}>
                            <td className="p-0">
                              <img src={item.image?.length > 0 ? item.image[0].src : "https://placehold.co/70"} alt={item.title} width="80" />
                            </td>
                            <td>
                              <div className="small">{item.title}</div>
                              <div className="small text-muted">{item.price} €</div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center align-items-center">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="plus-button">-</button>
                                <span className="mx-2">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="plus-button">+</button>
                              </div>
                            </td>
                            <td className="small">{(item.price * item.quantity).toFixed(2)} €</td>
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
                          <th style={{ width: "80px" }}>Image</th>
                          <th style={{ width: "30%" }}>Product</th>
                          <th style={{ width: "20%" }}>Qty</th>
                          <th style={{ width: "25%" }}>Total</th>
                          <th style={{ width: "30px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {groceriesProducts.map((item) => (
                          <tr key={item.id}>
                            <td className="p-0">
                              <img src={item.image?.length > 0 ? item.image[0].src : "https://placehold.co/70"} alt={item.title} width="50" />
                            </td>
                            <td>
                              <div className="small">{item.title}</div>
                              <div className="small text-muted">{item.price} €</div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center align-items-center">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="plus-button">-</button>
                                <span className="mx-2">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="plus-button">+</button>
                              </div>
                            </td>
                            <td className="small">{(item.price * item.quantity).toFixed(2)} €</td>
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
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-2 mb-md-0">Total: {totalPrice()} €</h4>
                  <div>
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => {
                      if (!token) {
                        navigate("/login?redirect=/cart");
                      } else {
                        setShowSaveModal(true);
                      }
                    }}>Save as List</button>
                    <button onClick={clearCart} className="btn btn-sm btn-outline-secondary">Clear Cart</button>
                  </div>
                </div>
                <div className="text-center">
                  <Link to="/checkout" className="btn btn-prim w-100 my-3 mb-5">Proceed to Checkout</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSaveModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Save Your List</h5>
                <button type="button" className="btn-close" onClick={() => setShowSaveModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control" placeholder="Enter list name" value={listName} onChange={(e) => setListName(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowSaveModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveToBackend}>Save List</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;