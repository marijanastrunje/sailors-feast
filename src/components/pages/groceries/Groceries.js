import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../all-pages/Breadcrumbs";
import CategoriesSidebar from "./CategoriesSidebar";
import MobileCategoriesSlider from "./MobileCategoriesSlider";
import MobileSubcategoriesSlider from "./MobileSubcategoriesSlider";
import SubcategoryProducts from "./SubcategoryProducts";
import ProductsGrid from "./ProductsGrid";
import ModalProduct from "./ModalProduct";
import Faq from "../all-pages/Faq";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

import './Groceries.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const wcKey = process.env.REACT_APP_WC_KEY;
const wcSecret = process.env.REACT_APP_WC_SECRET;
const authHeader = "Basic " + btoa(`${wcKey}:${wcSecret}`);

const Groceries = () => {
    const [categories, setCategories] = useState([]);
    const [openCategory, setOpenCategory] = useState(null); 
    const [subcategories, setSubcategories] = useState({});
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [subcategoryProducts, setSubcategoryProducts] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);

    const location = useLocation();
    const preselectedCategoryId = location.state?.categoryId;

    const fetchProducts = useCallback((categoryId, isDirectClick = false) => {
        fetch(`${backendUrl}/wp-json/wc/v3/products?category=${categoryId}`, {
            headers: {
                Authorization: authHeader
            }
        })
        .then(response => response.json())
        .then(data => {
            setSubcategoryProducts(prev => ({ ...prev, [categoryId]: data }));
            if (isDirectClick) {
                setProducts(data);
            }
        })
        .catch(error => {
            console.error(`Error fetching products for category ${categoryId}:`, error);
        });  
    }, []);

    const fetchSubcategories = useCallback((categoryId) => {
        fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${categoryId}`, {
            headers: {
                Authorization: authHeader
            }
        })
        .then(response => response.json())
        .then(data => {
            const sortedData = data.sort((a, b) => a.menu_order - b.menu_order);
            setSubcategories(prev => ({ ...prev, [categoryId]: sortedData }));
            setActiveSubcategory(null);
            setOpenCategory(categoryId);

            if (data.length === 0) {
                fetchProducts(categoryId, true);
            } else {
                setProducts([]);
                data.forEach(subcategory => fetchProducts(subcategory.id));
            }
        });
    }, [fetchProducts]);

    useEffect(() => {
        const excludedCategories = [17, 108, 206, 198, 202];

        fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=0&per_page=100`, {
            headers: {
                Authorization: authHeader
            }
        })
        .then(response => response.json())
        .then(data => {
            const filtered = data
                .filter(category => !excludedCategories.includes(category.id))
                .sort((a, b) => a.menu_order - b.menu_order);
            setCategories(filtered); 
        });
    }, []);

    useEffect(() => {
        if (!preselectedCategoryId && categories.length > 0) {
            const firstCategoryId = categories[0].id;
            Promise.all([
                fetchSubcategories(firstCategoryId),
                fetchProducts(firstCategoryId, true)
            ]);
        }

        if (preselectedCategoryId) {
            Promise.all([
                fetchSubcategories(preselectedCategoryId),
                fetchProducts(preselectedCategoryId, true)
            ]);
        }
    }, [categories, preselectedCategoryId, fetchSubcategories, fetchProducts]);

    const handleShowModal = (product) => {
        setSelectedProduct(product);
    };

    return (
        <>
            <div className="groceries-hero p-2 text-center" aria-label="Groceries hero section">
                <h1 className="display-5 fw-bold text-white position-relative z-2">Groceries</h1>
                <div className="col-lg-6 mx-auto">
                    <p
                        className="lead mb-4 text-white position-relative z-2"
                        title="Bootstrap description"
                    >
                        Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit.
                    </p>
                </div>
            </div>

            <Breadcrumbs items={[{ name: "Home", link: "/" }, { name: "Groceries" }]} />

            <MobileCategoriesSlider
                categories={categories}
                fetchSubcategories={fetchSubcategories}
            />

            <MobileSubcategoriesSlider
                subcategories={subcategories}
                setActiveSubcategory={setActiveSubcategory}
                openCategory={openCategory}
                fetchProducts={fetchProducts}
                excludedSubcategories={[671, 669, 670]}
            />

            <div className="container-fluid mx-auto" aria-label="Groceries product section">
                <div className="row">
                    <div className="col-sm-4 col-md-3 desktop-scroll d-none d-sm-block">
                        <h5 title="Category list heading">Categories</h5>
                        <CategoriesSidebar
                            categories={categories}
                            openCategory={openCategory}
                            subcategories={subcategories}
                            setActiveSubcategory={setActiveSubcategory}
                            fetchSubcategories={fetchSubcategories}
                            fetchProducts={(id) => fetchProducts(id, true)}
                        />
                    </div> 

                    <div className="col-sm-8 mx-auto px-3">
                        {activeSubcategory ? (
                            <ProductsGrid products={products} onShowModal={handleShowModal} />
                        ) : openCategory && subcategories[openCategory] && subcategories[openCategory].length > 0 ? (
                            <SubcategoryProducts
                                subcategories={subcategories}
                                setActiveSubcategory={setActiveSubcategory}
                                openCategory={openCategory}
                                subcategoryProducts={subcategoryProducts}
                                fetchProducts={(id) => fetchProducts(id, true)}
                                onShowModal={handleShowModal} 
                            />
                        ) : (
                            <ProductsGrid products={products} onShowModal={handleShowModal} />
                        )}
                    </div>   
                </div>

                {selectedProduct && (
                    <ModalProduct
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </div>

            <div id="Faq" aria-label="FAQ section">
                <Faq topicId={195} topic="Groceries" />
            </div>

            <ScrollToTopButton />
        </>
    );
};

export default Groceries;
