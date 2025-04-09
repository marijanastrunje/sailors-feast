import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../all-pages/Breadcrumbs";
import CategoriesSidebar from "./CategoriesSidebar";
import MobileCategoriesSlider from "./MobileCategoriesSlider";
import MobileSubcategoriesSlider from "./MobileSubcategoriesSlider";
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
  const [activeSubcategoryName, setActiveSubcategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const location = useLocation();
  const preselectedCategoryId = location.state?.categoryId;

  const fetchProducts = useCallback((categoryId, isDirectClick = false) => {
    setIsLoadingProducts(true);
    fetch(`${backendUrl}/wp-json/wc/v3/products?category=${categoryId}`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        if (isDirectClick) {
          setProducts(data);
        }
      })
      .catch(error => {
        console.error(`Error fetching products for category ${categoryId}:`, error);
      })
      .finally(() => setIsLoadingProducts(false));
  }, []);

  const fetchSubcategories = useCallback((categoryId) => {
    fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${categoryId}`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.menu_order - b.menu_order);
        setSubcategories(prev => ({ ...prev, [categoryId]: sorted }));
        setOpenCategory(categoryId);

        if (sorted.length > 0) {
          const firstSub = sorted[0];
          setActiveSubcategoryName(firstSub.name);
          fetchProducts(firstSub.id, true);
        } else {
          setActiveSubcategoryName("");
          fetchProducts(categoryId, true);
        }
      });
  }, [fetchProducts]);

  useEffect(() => {
    const excluded = [17, 108, 206, 198, 202];

    fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=0&per_page=100`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        const filtered = data
          .filter(cat => !excluded.includes(cat.id))
          .sort((a, b) => a.menu_order - b.menu_order);
        setCategories(filtered);
      });
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const initialId = preselectedCategoryId || categories[0].id;
      fetchSubcategories(initialId);
    }
  }, [categories, preselectedCategoryId, fetchSubcategories]);

  const handleShowModal = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <div className="groceries-hero p-2 text-center" aria-label="Groceries hero section">
        <h1 className="display-5 fw-bold text-white position-relative z-2">Groceries</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4 text-white position-relative z-2">
            Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit.
          </p>
        </div>
        <link rel="preload" as="image" href="/images/groceries-hero.webp" type="image/webp" />
      </div>

      <Breadcrumbs items={[{ name: "Home", link: "/" }, { name: "Groceries" }]} />

      <MobileCategoriesSlider
        categories={categories}
        fetchSubcategories={fetchSubcategories}
      />

      <MobileSubcategoriesSlider
        subcategories={subcategories}
        openCategory={openCategory}
        fetchProducts={fetchProducts}
        excludedSubcategories={[671, 669, 670]}
        setActiveSubcategoryName={setActiveSubcategoryName}
        setActiveSubcategory={() => {}}
      />

      <div className="container-fluid mx-auto" aria-label="Groceries product section">
        <div className="row">
          <div className="col-sm-4 col-md-3 desktop-scroll d-none d-sm-block">
            <h5 title="Category list heading">Categories</h5>
            <CategoriesSidebar
              categories={categories}
              openCategory={openCategory}
              subcategories={subcategories}
              fetchSubcategories={fetchSubcategories}
              fetchProducts={(id) => fetchProducts(id, true)}
              setActiveSubcategoryName={setActiveSubcategoryName}
              setActiveSubcategory={() => {}}
            />
          </div>

          <div className="col-sm-8 mx-auto px-3">
            {activeSubcategoryName && (
              <h2 className="mb-3">{activeSubcategoryName}</h2>
            )}

            {isLoadingProducts ? (
              <p className="text-muted text-center my-4" aria-live="polite">Loading products...</p>
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