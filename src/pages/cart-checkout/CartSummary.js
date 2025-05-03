import React, { useState, useEffect } from "react";

const CartSummary = ({ cart, setTotalPrice }) => {
    const [showCart, setShowCart] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => setShowCart(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const boxProducts = cart.filter(item => item.box);
    const groceriesProducts = cart.filter(item => !item.box);

    const totalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    useEffect(() => {
        setTotalPrice(totalPrice());
    }, [cart, totalPrice, setTotalPrice]);

    return (
        <>
            <h4 className="d-flex justify-content-center align-items-center mb-3">
                <span className="text-prim me-1">Your cart</span>
                <span className="badge rounded-pill me-2" style={{ backgroundColor: "var(--primary-color)", color: "white" }}>{cart.length}</span>
                <button className="btn btn-sm d-md-none" style={{ border: "1px solid var(--primary-color)", color: "var(--primary-color)", backgroundColor: "transparent" }} onClick={() => setShowCart(!showCart)}>
                    {showCart ? "▲" : "▼"}
                </button>
            </h4>

            {showCart && (
                <>
                    {/* Box Products Section */}
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

                    {/* Groceries Products Section */}
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
                <h4>Total: {totalPrice()} €</h4>
            </div>
        </>
    );
};

export default CartSummary;
