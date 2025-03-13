import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../all-pages/Breadcrumbs";
import CategoriesSidebar from "./CategoriesSidebar";
import MobileCategoriesSlider from "./MobileCategoriesSlider";
import MobileSubcategoriesSlider from "./MobileSubcategoriesSlider";
import SubcategoryProducts from "./SubcategoryProducts";
import ProductsGrid from "./ProductsGrid";

import './Groceries.css'

const Groceries = () => {

    const [categories, setCategories] = useState([]);
    const excludedCategories = [16, 668, 672];

    useEffect(() => {
        fetch("https://backend.sailorsfeast.com/wp-json/wc/v3/products/categories?parent=0&per_page=100", {
            headers: {
                Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af")
            }
        })
        .then(response => response.json())
        .then(data =>{ const filterCategories = data
                .filter(category => !excludedCategories.includes(category.id))
                .sort((a, b) => a.menu_order - b.menu_order);
            setCategories(filterCategories); 
        })
    }, []);

    const location = useLocation();
    const preselectedCategoryId = location.state?.categoryId;

      // Otvaranje proslijeđene kategorije s Home pagea
    useEffect(() => {
        if (categories.length > 0 && preselectedCategoryId) {
        fetchSubcategories(preselectedCategoryId);
        }
    }, [categories, preselectedCategoryId]);

    // Ako nema proslijeđene, otvori prvu dostupnu
    useEffect(() => {
        if (categories.length > 0 && !preselectedCategoryId) {
        fetchSubcategories(categories[0].id);
        }
    }, [categories, preselectedCategoryId]);
      

    const [openCategory, setOpenCategory] = useState(null); 
    const [subcategories, setSubcategories] = useState({});
    const [activeSubcategory, setActiveSubcategory] = useState(null);

    const fetchSubcategories = (categoryId) => {
      
        fetch(`https://backend.sailorsfeast.com/wp-json/wc/v3/products/categories?parent=${categoryId}`, {
            headers: {
                Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af")
            }
        })
        .then(response => response.json())
        .then(data => {
            setSubcategories(prev => ({ ...prev, [categoryId]: data }));
            setActiveSubcategory(null);
            setOpenCategory(categoryId);

            if (data.length === 0) {
                fetchProducts(categoryId, true); // Ako nema podkategorija, prikaži proizvode
            } else {
                setProducts([]); // Očisti proizvode ako će ih prikazivati podkategorije
                data.forEach(subcategory => fetchProducts(subcategory.id));
            }
        });
    };

    const [products, setProducts] = useState([]);
    const [subcategoryProducts, setSubcategoryProducts] = useState({});

    const fetchProducts = (categoryId, isDirectClick = false) => {
        fetch(`https://backend.sailorsfeast.com/wp-json/wc/v3/products?category=${categoryId}`, {
            headers: {
                Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af")
            }
        })
        .then(response => response.json())
        .then(data => {
            setSubcategoryProducts(prev => ({ ...prev, [categoryId]: data }));
            if (isDirectClick) {
                setProducts(data); // Prikaži proizvode u gridu
            }
        })
        .catch(error => {
            console.error(`Greška pri dohvaćanju proizvoda za kategoriju ${categoryId}:`, error);
        });  
    };

    return(
    <>
        <div className="groceries-hero p-2 text-center">
            <h1 className="display-5 fw-bold text-white position-relative z-2">Groceries</h1>
            <div className="col-lg-6 mx-auto">
                <p className="lead mb-4 text-white position-relative z-2">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variab  open source toolkit, featuring Sass variab</p>
            </div>
        </div>

        <Breadcrumbs items={[{ name: "Home", link: "/" }, { name: "Groceries" }]} />

        <MobileCategoriesSlider categories={categories} fetchSubcategories={fetchSubcategories} />
        <MobileSubcategoriesSlider subcategories={subcategories} setActiveSubcategory={setActiveSubcategory} openCategory={openCategory} fetchProducts={fetchProducts} excludedSubcategories={[671, 669, 670]} />

        <div className="container-fluid mx-auto">
            <div className="row">
                <div className="col-sm-4 col-md-3 desktop-scroll d-none d-sm-block">
                    <h5>Kategorije</h5>
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
                    <ProductsGrid products={products} />
                    ) : openCategory && subcategories[openCategory] && subcategories[openCategory].length > 0 ? (
                    <SubcategoryProducts
                        subcategories={subcategories}
                        setActiveSubcategory={setActiveSubcategory}
                        openCategory={openCategory}
                        subcategoryProducts={subcategoryProducts}
                        fetchProducts={(id) => fetchProducts(id, true)}
                    />
                    ) : (
                    <ProductsGrid products={products} />
                    )}
                </div>   
            </div>
        </div>

        


    </>
    )
};

export default Groceries;
