import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import './ProductCard.css';

const ProductCard = ({ product, onShowModal }) => {
    const [quantity, setQuantity] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [toastMessage, setToastMessage] = useState('✅ Added to cart!');
    const updateCartTimeoutRef = useRef(null);

    // Učitaj inicijalno stanje iz košarice
    useEffect(() => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productInCart = cart.find((item) => item.id === product.id);
        if (productInCart) {
            setQuantity(productInCart.quantity);
            setShowControls(productInCart.quantity > 0);
        }
    }, [product.id]);

    // Optimizirana updateCart funkcija s debounce-om
    const updateCart = useCallback((newQuantity) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (newQuantity === '' || newQuantity <= 0) {
            cart = cart.filter(item => item.id !== product.id);
            if (!isEditing) {
                setShowControls(false);
            }
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

        clearTimeout(updateCartTimeoutRef.current);
        updateCartTimeoutRef.current = setTimeout(() => {
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event("cartUpdated"));
        }, 300);
    }, [product.id, product.images, product.name, product.price, isEditing]);

    const handleIncrease = useCallback(() => {
        const newQuantity = (quantity || 0) + 1;
        setQuantity(newQuantity);
        setShowControls(true);
        updateCart(newQuantity);
        setToastMessage('✅ Added to cart!');
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
        }, 1000);
    }, [quantity, updateCart]);

    const handleDecrease = useCallback(() => {
        const newQuantity = quantity > 1 ? quantity - 1 : '';
        setQuantity(newQuantity);
        updateCart(newQuantity);
        
        setToastMessage('Removed from cart');
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
        }, 1000);
    }, [quantity, updateCart]);

    const handleInputFocus = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        if (quantity === '' || quantity <= 0) {
            setShowControls(false);
            setQuantity('');
            updateCart('');
        }
        setIsEditing(false);
    }, [quantity, updateCart]);

    const handleInputChange = useCallback((e) => {
        let value = e.target.value;
        if (value === '') {
            setQuantity('');
            // Ne sakrivamo kontrole odmah, samo ažuriramo vrijednost
            // Kontrole će se sakriti tek kad korisnik završi uređivanje (izgubi fokus)
            if (!isEditing) {
                updateCart('');
            }
        } else {
            let newQuantity = parseInt(value, 10);
            if (!isNaN(newQuantity) && newQuantity >= 0) {
                setQuantity(newQuantity);
                updateCart(newQuantity);
            }
        }
    }, [updateCart, isEditing]);

    // Sync localStorage i cartUpdated u jednom efektu
    useEffect(() => {
        const updateFromStorage = () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const productInCart = cart.find((item) => item.id === product.id);
            setQuantity(productInCart ? productInCart.quantity : '');
            setShowControls(productInCart?.quantity > 0);
        };

        window.addEventListener("cartUpdated", updateFromStorage, { passive: true });
        window.addEventListener("storage", updateFromStorage, { passive: true });

        return () => {
            window.removeEventListener("cartUpdated", updateFromStorage);
            window.removeEventListener("storage", updateFromStorage);
        };
    }, [product.id]);

    const handleProductClick = useCallback(() => {
        onShowModal(product);
    }, [onShowModal, product]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" || e.key === " ") {
            onShowModal(product);
        }
    }, [onShowModal, product]);

    const imageSrc = product.images?.[0]?.src || "https://placehold.co/160";

    return (
        <div className="products card flex-column justify-content-between p-2">
            <img
                onClick={handleProductClick}
                src={imageSrc}
                width={70}
                height={100}
                className="card-img-top"
                alt={product.name || "Product image"}
                title={product.name}
                role="button"
                tabIndex="0"
                onKeyDown={handleKeyDown}
                aria-label={`View details for ${product.name}`}
                loading="lazy"
                decoding="async"
            />
            <div className="product-footer px-2">
                <div className="product-description-3">
                    <h6
                        onClick={handleProductClick}
                        role="button"
                        tabIndex="0"
                        onKeyDown={handleKeyDown}
                        aria-label={`Open product details for ${product.name}`}
                        title={product.name}
                    >
                        {product.name}
                    </h6>
                    <p className="mb-1" aria-label={`Price: ${product.price} euros`}>
                        {product.price} €
                    </p>
                </div>

                <div className="d-flex align-items-center justify-content-center mt-auto">
                    {showControls ? (
                        <>
                            <button
                                onClick={handleDecrease}
                                className="quantity-btn btn btn-secondary btn-l"
                                aria-label="Decrease quantity"
                            >-</button>
                            <input
                                type="number"
                                className="quantity-input mx-1"
                                value={quantity}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                min="0"
                                aria-label="Quantity"
                            />
                            <button
                                onClick={handleIncrease}
                                className="quantity-btn btn btn-secondary btn-l"
                                aria-label="Increase quantity"
                            >+</button>
                        </>
                    ) : (
                        <button
                            onClick={handleIncrease}
                            className="quantity-btn-front btn btn-prim p-0 w-75"
                            aria-label={`Add ${product.name} to cart`}
                        >+</button>
                    )}
                </div>
            </div>

            {/* Added to cart toast */}
            <div
                className={`toast align-items-center text-white ${toastMessage.includes('Added') ? 'bg-success' : 'bg-warning'} p-0 ${addedToCart ? "show" : "hide"}`}
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                <div className="d-flex">
                    <div className="toast-body p-2">{toastMessage}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);