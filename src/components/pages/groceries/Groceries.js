import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../all-pages/Breadcrumbs";
import CategoriesSidebar from "./CategoriesSidebar";
import MobileCategoriesSlider from "./MobileCategoriesSlider";
import MobileSubcategoriesSlider from "./MobileSubcategoriesSlider";
import ProductsGrid from "./ProductsGrid";
import ModalProduct from "./ModalProduct";
import Faq from "../all-pages/Faq";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";
import Pagination from "../all-pages/Pagination";
import ProductsGridSkeleton from './ProductsGridSkeleton';

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
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  const location = useLocation();
  const preselectedCategoryId = location.state?.categoryId;

  // Simple cache to prevent duplicate fetches
  const fetchCache = useRef({});

  const fetchProducts = useCallback((categoryId, isDirectClick = false) => {
    // Check if we already have this request in progress
    const cacheKey = `products_${categoryId}`;
    if (fetchCache.current[cacheKey]) {
      console.log("Skipping duplicate fetch for products", categoryId);
      return;
    }

    setIsLoadingProducts(true);
    fetchCache.current[cacheKey] = true;

    fetch(`${backendUrl}/wp-json/wc/v3/products?category=${categoryId}&per_page=100`, {
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
      .finally(() => {
        setIsLoadingProducts(false);
        // Clear cache entry after request is done
        delete fetchCache.current[cacheKey];
      });
  }, []);

  const fetchSubcategories = useCallback((categoryId) => {
    // Check if we already have this request in progress
    const cacheKey = `subcategories_${categoryId}`;
    if (fetchCache.current[cacheKey]) {
      console.log("Skipping duplicate fetch for subcategories", categoryId);
      return;
    }

    // Skip if we're already showing this category
    if (openCategory === categoryId) {
      return;
    }

    fetchCache.current[cacheKey] = true;

    fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${categoryId}`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.menu_order - b.menu_order);
        setSubcategories(prev => ({ ...prev, [categoryId]: sorted }));
        setOpenCategory(categoryId);
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (sorted.length > 0) {
          const firstSub = sorted[0];
          setActiveSubcategoryName(firstSub.name);
          fetchProducts(firstSub.id, true);
        } else {
          setActiveSubcategoryName("");
          fetchProducts(categoryId, true);
        }
      })
      .finally(() => {
        // Clear cache entry after request is done
        delete fetchCache.current[cacheKey];
      });
  }, [fetchProducts, openCategory]);

  useEffect(() => {
    const excluded = [17, 108, 206, 198, 202];

    // Check if we already have this request in progress
    const cacheKey = 'categories';
    if (fetchCache.current[cacheKey]) {
      return;
    }

    fetchCache.current[cacheKey] = true;

    fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=0&per_page=100`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        const filtered = data
          .filter(cat => !excluded.includes(cat.id))
          .sort((a, b) => a.menu_order - b.menu_order);
        setCategories(filtered);
      })
      .finally(() => {
        delete fetchCache.current[cacheKey];
      });
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !openCategory) {
      const initialId = preselectedCategoryId || categories[0].id;
      fetchSubcategories(initialId);
    }
  }, [categories, preselectedCategoryId, fetchSubcategories, openCategory]);

  const handleShowModal = (product) => {
    setSelectedProduct(product);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  // izračun broja stranica
  const totalPages = Math.ceil(products.length / productsPerPage);

  // odabir proizvoda za trenutnu stranicu
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); 
    }
  };

  // Dodajemo jednostavan lazy loading za komponente koje su dalje od prvog prikaza
  const [isVisible, setIsVisible] = useState({
    faq: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const faqSection = document.getElementById('Faq');
      if (faqSection) {
        const faqPosition = faqSection.getBoundingClientRect();
        // Ako je element 300px od donjeg ruba ekrana
        if (faqPosition.top < window.innerHeight + 300) {
          setIsVisible(prev => ({ ...prev, faq: true }));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Pokrenuti i odmah da provjerimo početno stanje
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="groceries-hero p-2 text-center" aria-label="Groceries hero section">
        <h1 className="display-5 fw-bold text-white position-relative z-2">Groceries</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4 text-white position-relative z-2">
          Find everything you need for your trip. Browse by category, search for your favorites, and add items with a single click. We'll deliver it all fresh to your boat.
          </p>
        </div>
        <link rel="preload" as="image" href="/images/groceries-hero.webp" type="image/webp" />
      </div>

      <Breadcrumbs items={[{ name: "Home", link: "/" }, { name: "Groceries" }]} />

      <MobileCategoriesSlider
        categories={categories}
        fetchSubcategories={fetchSubcategories}
        activeCategory={openCategory}
      />

      <MobileSubcategoriesSlider
        subcategories={subcategories}
        openCategory={openCategory}
        fetchProducts={fetchProducts}
        excludedSubcategories={[671, 669, 670]}
        setActiveSubcategoryName={setActiveSubcategoryName}
        setActiveSubcategory={setActiveSubcategory}
        activeSubcategory={activeSubcategory}
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
              setActiveSubcategory={setActiveSubcategory}
              activeSubcategory={activeSubcategory}
            />
          </div>

          <div className="col-sm-8 mx-auto px-3">
            {activeSubcategoryName && (
              <h2 className="mb-3">{activeSubcategoryName}</h2>
            )}

          {isLoadingProducts ? (
            <ProductsGridSkeleton count={16} />
          ) : (
            <>
              <ProductsGrid products={paginatedProducts} onShowModal={handleShowModal} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
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
        {isVisible.faq && <Faq topicId={195} topic="Groceries" />}
      </div>

      <ScrollToTopButton />
    </>
  );
};

export default Groceries;