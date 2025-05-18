import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './CartPage.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [listName, setListName] = useState("");
  const [, setSavedLists] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
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

  useEffect(() => {
    if (token) {
      fetch(`${backendUrl}/wp-json/wp/v2/users/me?no_cache=${Date.now()}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => {
          if (data.meta?.saved_lists) {
            setSavedLists(JSON.parse(data.meta.saved_lists));
          }
        })
        .catch((err) => console.error("Error loading saved lists:", err));
    }
  }, [token]);

  const totalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Izračun PDV-a (PDV stopa 25% u Hrvatskoj)
  const getTaxAmount = () => {
    const totalWithTax = parseFloat(totalPrice());
    const taxRate = 0.25; // 25% PDV
    const taxAmount = totalWithTax - (totalWithTax / (1 + taxRate));
    return taxAmount.toFixed(2);
  };

  // Izračun iznosa bez PDV-a
  const getPriceWithoutTax = () => {
    const totalWithTax = parseFloat(totalPrice());
    const taxRate = 0.25; // 25% PDV
    const priceWithoutTax = totalWithTax / (1 + taxRate);
    return priceWithoutTax.toFixed(2);
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
        console.warn("Failed parsing saved_lists:", err);
      }

      const updatedLists = { ...currentLists, [listName]: cart };

      const saveRes = await fetch(`${backendUrl}/wp-json/wp/v2/users/me?no_cache=${Date.now()}`, {
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
      console.log("Saved lists:", updatedLists);
      console.log("Backend response:", saveData);

      setSavedLists(updatedLists);
      alert(`List "${listName}" has been successfully saved!`);
      navigate("/user");
    } catch (err) {
      alert("Unable to save the list.");
    }
    setShowSaveModal(false);
  };

  const boxProducts = cart.filter((item) => item.box);
  const groceriesProducts = cart.filter((item) => !item.box);
  
  const proceedToCheckout = (asGuest = false) => {
    if (asGuest) {
      // Set a flag in session storage to indicate guest checkout
      sessionStorage.setItem("guest_checkout", "true");
      navigate("/checkout");
    } else {
      // If user is logged in, proceed directly to checkout
      if (token) {
        sessionStorage.removeItem("guest_checkout"); // Clear any previous guest checkout flag
        navigate("/checkout");
      } else {
        // Otherwise redirect to login with return URL
        navigate("/login?redirect=/checkout");
      }
    }
    setShowCheckoutModal(false);
  };

  // Determine if checkoutModal should show both options or just proceed
  const handleCheckoutClick = () => {
    if (token) {
      // User is logged in, proceed directly to checkout
      proceedToCheckout(false);
    } else {
      // User is not logged in, show modal with options
      setShowCheckoutModal(true);
    }
  };

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
                    <table className="table table-bordered table-hover align-middle-cart text-center mb-1">
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
                    <table className="table table-bordered table-hover text-center align-middle-cart mb-1">
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

                    {!token && (
                      <small className="text-muted text-end d-block">
                        Want to save your list? <Link to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} className="text-prim">Login here</Link>
                      </small>
                    )}
                    
                  </>
                )}
              </>
            )}

            {cart.length > 0 && (
              <div>
                <div className="d-flex justify-content-between align-items-start mt-2">
                  <div className="me-2" style={{ minWidth: "240px" }}>
                    <div className="d-flex justify-content-between">
                      <span>Subtotal (without VAT):</span>
                      <strong>{getPriceWithoutTax()} €</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>VAT (25%):</span>
                      <strong>{getTaxAmount()} €</strong>
                    </div>
                    <hr className="my-1" />
                    <div className="d-flex justify-content-between">
                      <span>Total (with VAT):</span>
                      <strong>{totalPrice()} €</strong>
                    </div>
                  </div>
                  <div>
                    {token && (
                      <button className="btn btn-sm btn-secondary me-sm-2 ms-2 ms-md-0 mt-2" onClick={() => setShowSaveModal(true)}>
                        Save list
                      </button>
                    )}
                    <button onClick={clearCart} className="btn btn-sm btn-outline-secondary mt-2">Clear Cart</button>
                  </div>
                </div>

                <button 
                  onClick={handleCheckoutClick} 
                  className="btn btn-prim w-100 my-3 mb-5"
                >
                  Continue to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for saving list */}
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
                <button className="btn btn-sm btn-secondary" onClick={() => setShowSaveModal(false)}>Cancel</button>
                <button className="btn btn-sm btn-prim" onClick={saveToBackend}>Save List</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout options modal - only shown if user is not logged in */}
      {showCheckoutModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Checkout Options</h5>
                <button type="button" className="btn-close" onClick={() => setShowCheckoutModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12 text-center text-md-start">
                      <button onClick={() => proceedToCheckout(false)} className="btn btn-prim w-100 py-3">
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Login & Checkout
                      </button>
                      <small className="text-muted ms-md-2 mt-2">
                        Login to track your order or save your information for future orders
                      </small>
                    </div>
                  
                  <div className="col-12 text-center text-md-start">
                    <div className="d-grid">
                      <button onClick={() => proceedToCheckout(true)} className="btn btn-outline-secondary py-3">
                        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                        Checkout as Guest
                      </button>
                      <small className="text-muted ms-md-2 mt-2">
                        No account needed, quick checkout process
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;