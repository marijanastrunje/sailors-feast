import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import './ProductCard.css';

const ProductCard = ({ product, onShowModal, allProducts }) => {
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

    // Cold bag toast funkcija
    const showColdBagToast = useCallback((message) => {
        console.log('Cold bag toast:', message);
        const existing = document.querySelector("#coldBagToast");
        if (existing) existing.remove();
        const toast = document.createElement("div");
        toast.id = "coldBagToast";
        toast.className = "coldbag-toast";
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add("show"), 100);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, []);

    // Funkcija za pronalaženje proizvoda po ID-u iz allProducts ili cache-a
    const findProductById = useCallback((productId) => {
        // Prvo probaj iz allProducts
        if (allProducts && allProducts.length > 0) {
            return allProducts.find(p => p.id === productId);
        }
        
        // Ako nema allProducts, probaj iz session storage cache-a
        try {
            const cachedProducts = JSON.parse(sessionStorage.getItem('allProductsCache') || '[]');
            if (cachedProducts.length > 0) {
                return cachedProducts.find(p => p.id === productId);
            }
        } catch (error) {
            console.error('Error reading from allProductsCache:', error);
        }
        
        // Ako ništa od toga ne radi, vrati null
        return null;
    }, [allProducts]);

    // Funkcija za osvežavanje kategorija postojećih proizvoda u košarici
    const refreshCartItemCategories = useCallback((cart) => {
        return cart.map(item => {
            // Ako item već ima categories array, ostavi ga
            if (item.categories && Array.isArray(item.categories) && item.categories.length > 0) {
                return item;
            }
            
            // Inače, pokušaj da nađeš proizvod i ažuriraš kategorije
            const foundProduct = findProductById(item.id);
            if (foundProduct) {
                const categoriesArray = foundProduct.categories 
                    ? foundProduct.categories.map(category => {
                        if (category && typeof category === 'object' && category.id) {
                            return category.id;
                        }
                        return category;
                    })
                    : [];
                
                return {
                    ...item,
                    categories: categoriesArray
                };
            }
            
            return item;
        });
    }, [findProductById]);

    // Cold bag logika
    const handleColdBagLogic = useCallback((cart) => {
        console.log('HandleColdBagLogic pozvan:', {
            cartLength: cart.length,
            allProductsLength: allProducts ? allProducts.length : 'undefined'
        });
        
        const frozenCategoryId = 51;
        const coldBagProduct = findProductById(2728);
        
        console.log('Cold bag product:', coldBagProduct);
        
        if (!coldBagProduct) {
            console.log('Cold bag product (ID 2728) not found, trying to fetch from API...');
            // Pokušaj da učitaš proizvod direktno iz API-ja ako nije dostupan
            return cart; // Za sada vraćamo originalni cart
        }

        // Prvo osveži kategorije postojećih proizvoda u košarici
        const refreshedCart = refreshCartItemCategories(cart);
        
        // Broji sve zamrznute proizvode u košarici
        const frozenCount = refreshedCart.reduce((sum, item) => {
            // Dobijamo categories iz trenutnog item-a u košarici
            const itemCategories = item.categories || [];
            
            console.log(`Item ${item.id} categories:`, itemCategories);
            
            // Proveravamo da li je proizvod u kategoriji 51 (frozen)
            const isFrozen = itemCategories.includes(frozenCategoryId);
            console.log(`Item ${item.id} (${item.title}) is frozen:`, isFrozen);
            
            return isFrozen ? sum + Number(item.quantity || 0) : sum;
        }, 0);
        
        console.log('Total frozen count:', frozenCount);
        const requiredColdBags = Math.ceil(frozenCount / 5);
        console.log('Required cold bags:', requiredColdBags);
        const existingIndex = refreshedCart.findIndex(item => item.id === 2728);
        
        if (requiredColdBags > 0) {
            if (existingIndex !== -1) {
                if (refreshedCart[existingIndex].quantity !== requiredColdBags) {
                    console.log('Updating existing cold bag quantity');
                    refreshedCart[existingIndex].quantity = requiredColdBags;
                    showColdBagToast(`Updated to ${requiredColdBags} cold bag(s) due to frozen items in your cart`);
                }
            } else {
                console.log('Adding new cold bag to cart');
                refreshedCart.push({
                    id: coldBagProduct.id,
                    title: coldBagProduct.name,
                    image: coldBagProduct.images,
                    price: coldBagProduct.price,
                    quantity: requiredColdBags,
                    categories: coldBagProduct.categories ? coldBagProduct.categories.map(c => c.id || c) : [],
                    slug: coldBagProduct.slug,
                    isAutoAdded: true,
                });
                showColdBagToast(`Added ${requiredColdBags} cold bag(s) due to frozen items in your cart`);
            }
        } else if (existingIndex !== -1) {
            console.log('Removing cold bag from cart');
            refreshedCart.splice(existingIndex, 1);
            showColdBagToast(`Cold bags removed as there are no more frozen items`);
        }
        
        console.log('Final cart after cold bag logic:', refreshedCart);
        return refreshedCart;
    }, [findProductById, refreshCartItemCategories, showColdBagToast, allProducts]);

    // Optimizirana updateCart funkcija s debounce-om i cold bag logikom
    const updateCart = useCallback((newQuantity) => {
        console.log('UpdateCart pozvan sa:', {
            newQuantity,
            productId: product.id,
            productName: product.name,
            productCategories: product.categories
        });
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Current cart:', cart);

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
                // Ključno: kada dodajemo proizvod u košaricu, морamo правилно извући ID-jeve kategorija
                const categoriesArray = product.categories 
                    ? product.categories.map(category => {
                        // Ako je category objekat sa id svojstvom, uzmi id
                        if (category && typeof category === 'object' && category.id) {
                            return category.id;
                        }
                        // Inače, uzmi direktno vrednost (možda je već broj)
                        return category;
                    })
                    : [];
                
                console.log('Product categories processed:', {
                    original: product.categories,
                    processed: categoriesArray
                });
                
                cart.push({
                    id: product.id,
                    image: product.images,
                    title: product.name,
                    price: product.price,
                    quantity: newQuantity,
                    categories: categoriesArray, // Dodajemo obrađene kategorije
                    slug: product.slug
                });
            }
        }

        // Primijeni cold bag logiku
        cart = handleColdBagLogic(cart);

        clearTimeout(updateCartTimeoutRef.current);
        updateCartTimeoutRef.current = setTimeout(() => {
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event("cartUpdated"));
        }, 300);
    }, [product.id, product.images, product.name, product.price, product.categories, product.slug, isEditing, handleColdBagLogic]);

    const handleIncrease = useCallback(() => {
        const newQuantity = (quantity || 0) + 1;
        setQuantity(newQuantity);
        setShowControls(true);
        updateCart(newQuantity);
        setToastMessage('Added to cart!');
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
                    <p className="mb-0" aria-label={`Price: ${product.price} euros`}>
                        {product.price} €
                    </p>
                    <small className="text-muted" style={{ fontSize: '12px' }}>VAT is included</small>
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