import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './ProductCard.css';

const ProductCard = ({ product, onProductClick }) => {
    const [quantity, setQuantity] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);

    // Dohvati postojeću količinu proizvoda iz košarice prilikom mountanja
    useEffect(() => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productInCart = cart.find((item) => item.id === product.id);
        if (productInCart) {
            setQuantity(productInCart.quantity);
        }
    }, [product.id]);

    const updateCart = (newQuantity) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (newQuantity === '' || newQuantity <= 0) {
            cart = cart.filter(item => item.id !== product.id);
        } else {
            const productInCart = cart.find(item => item.id === product.id);
            if (productInCart) {
                productInCart.quantity = newQuantity;
            } else {
                cart.push({
                    id: product.id,
                    image: product.images,
                    title: product.name,
                    price: product.price,
                    quantity: newQuantity
                });
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated")); 

        // Postavi obavijest da je proizvod dodan
        if (newQuantity > 0) {
            setAddedToCart(true);
            setTimeout(() => {
                setAddedToCart(false);
            }, 700);
        }
    };

    const handleIncrease = () => {
        const newQuantity = (quantity || 0) + 1;
        setQuantity(newQuantity);
        updateCart(newQuantity);
    };

    const handleDecrease = () => {
        const newQuantity = (quantity > 1 ? quantity - 1 : '');
        setQuantity(newQuantity);
        updateCart(newQuantity);
    };

    const handleInputChange = (e) => {
        let value = e.target.value;
        if (value === '') {
            setQuantity('');
            updateCart('');
        } else {
            let newQuantity = parseInt(value, 10);
            if (!isNaN(newQuantity) && newQuantity >= 0) {
                setQuantity(newQuantity);
                updateCart(newQuantity);
            }
        }
    };

    useEffect(() => {
        const handleCartUpdate = () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const productInCart = cart.find((item) => item.id === product.id);
            setQuantity(productInCart ? productInCart.quantity : '');
        };
        
        window.addEventListener("cartUpdated", handleCartUpdate);
    
        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, [product.id]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "cart") {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const productInCart = cart.find((item) => item.id === product.id);
                setQuantity(productInCart ? productInCart.quantity : '');
            }
        };

        window.addEventListener("storage", handleStorageChange);
    
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [product.id]);
    
    return (
        <div className="products card flex-column justify-content-between p-3" key={product.id}>
            <img src={product.images.length > 0 ? product.images[0].src : "https://placehold.co/160"} width={70} height={100} className="card-img-top" alt={product.name} />
            <div className="product-description-3">
                <h6 data-bs-toggle="modal" data-bs-target="#productModal" onClick={onProductClick}>{product.name}</h6>
                <p className="mb-1">{product.price} €</p>
            </div>
            <div className="d-flex align-items-center justify-content-center mt-auto">
                <button onClick={handleDecrease} className="quantity-btn btn btn-secondary btn-l">-</button>
                <input type="number" className="quantity-input mx-1" value={quantity} onChange={handleInputChange} min="0" />
                <button onClick={handleIncrease} className="quantity-btn btn btn-secondary btn-l">+</button>
            </div>

            {/* Prikaz obavijesti o dodavanju u košaricu */}
            {addedToCart && (
                <div className="cart-notification">
                    ✅ Proizvod je dodan u košaricu! <Link to="/cart">Pogledaj košaricu</Link>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
