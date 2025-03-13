import React, { useEffect, useState } from "react";

const CartPage = () => {
    const [cart, setCart] = useState([]);

    // Funkcija za dohvaćanje košarice iz localStorage
    const fetchCart = () => {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(localCart);
        return localCart.reduce((sum, item) => sum + item.quantity, 0);
    };

    // Prvi dohvat košarice + osluškivanje promjena u localStorage
    useEffect(() => {
        fetchCart();

        const handleStorageChange = () => fetchCart();
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Funkcija za računanje ukupne cijene
    const totalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Funkcija za uklanjanje proizvoda iz košarice
    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);

        // Emitiraj event koji ProductCard i header mogu uhvatiti
        window.dispatchEvent(new Event("cartUpdated"));
    };

    return (
        <>
        <div class="py-5 text-center" bis_skin_checked="1">
            <img class="d-block mx-auto mb-4" src="\img\logo\browser.png" alt="" width="72" height="57" />
            <h2>Cart</h2>
            <p class="lead">Below is an example form built entirely with Bootstrap’s form controls.</p>
        </div>
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8 col-lg-6 mx-auto">
                    {cart.length === 0 ? (
                        <p className="text-center">Košarica je prazna.</p>
                    ) : (
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-secondary">
                                <tr>
                                    <th scope="col">Proizvod</th>
                                    <th scope="col">Cijena</th>
                                    <th scope="col">Količina</th>
                                    <th scope="col">Akcija</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id}>
                                        <td className="fw-bold">{item.title}</td>
                                        <td>{item.price} €</td>
                                        <td>{item.quantity}</td>
                                        <td><button onClick={() => removeItem(item.id)} className="btn-close"></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {cart.length > 0 && (
                        <div className="text-center mt-3">
                            <h4>Ukupna cijena: {totalPrice()} €</h4>
                            <a href="/checkout" className="btn btn-primary">Idi na plaćanje</a>
                        </div>
                    )}

                </div>
            </div>
        </div>
        </>
    );
};

export default CartPage;
