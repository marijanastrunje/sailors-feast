import React, { useState, useEffect } from "react";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("https://sailorsfeast.com/wp-json/wc/v3/products", {
            headers: {
                "Authorization": "Basic " + btoa("ck_971b783339775575928ecdba150f83870eb118b1:cs_eaa4759ea0dd6465903fea8879f9f711fe496949")
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setProducts(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p>Greška: {error}</p>;

    return (
        <div>
            <h2>WooCommerce Proizvodi</h2>
            <div class="row row-cols-2 row-cols-md-4 g-5">
                {products.map(product => (
                    <div class="col" key={product.id}>
                        <img src={product.images[0]?.src} alt={product.name} width="160" />
                        <h3>{product.name}</h3>
                        <p>Cijena: {product.price} €</p>     
                    </div>
                ))}    
            </div>
        </div>
    );
};

export default Products;
