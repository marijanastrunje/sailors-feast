import React, { useState, useEffect } from "react";
import './ProductCard.css';

const ProductCard = ({ product, onShowModal }) => {
    const [quantity, setQuantity] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);
    const [showControls, setShowControls] = useState(false); // Novo: kontrolira prikaz inputa i "-" gumba

    // Dohvati postojeću količinu proizvoda iz košarice prilikom mountanja
    useEffect(() => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productInCart = cart.find((item) => item.id === product.id);
        if (productInCart) {
            setQuantity(productInCart.quantity);
            setShowControls(productInCart.quantity > 0); // Prikaži kontrole ako proizvod postoji
        }
    }, [product.id]);

    const updateCart = (newQuantity) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (newQuantity === '' || newQuantity <= 0) {
            cart = cart.filter(item => item.id !== product.id);
            setShowControls(false); // Sakrij input i "-" ako količina padne na 0
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
            }, 1000);
        }
    };

    const handleIncrease = () => {
        const newQuantity = (quantity || 0) + 1;
        setQuantity(newQuantity);
        setShowControls(true);
        updateCart(newQuantity);
    };

    const handleDecrease = () => {
        const newQuantity = quantity > 1 ? quantity - 1 : '';
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
            <img onClick={() => onShowModal(product)} src={product.images.length > 0 ? product.images[0].src : "https://placehold.co/160"} width={70} height={100} className="card-img-top" alt={product.name} />
            <div className="product-description-3">
                <h6 onClick={() => onShowModal(product)}>{product.name}</h6>
                <p className="mb-1">{product.price} €</p>
            </div>
            <div className="d-flex align-items-center justify-content-center mt-auto">
                {showControls ? (
                    <>
                        <button onClick={handleDecrease} className="quantity-btn btn btn-secondary btn-l">-</button>
                        <input 
                            type="number" 
                            className="quantity-input mx-1" 
                            value={quantity} 
                            onChange={handleInputChange} 
                            min="0" 
                        />
                        <button onClick={handleIncrease} className="quantity-btn btn btn-secondary btn-l">+</button>
                    </>
                ) : (
                    <button onClick={handleIncrease} className="quantity-btn-front btn p-0 w-50">+</button>
                )}
            </div>

            {/* Prikaz obavijesti o dodavanju u košaricu */}
            <div 
                className={`toast align-items-center text-white bg-success p-0 ${addedToCart ? "show" : "hide"}`} 
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="d-flex">
                    <div className="toast-body p-2">
                        ✅ Added to cart!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
