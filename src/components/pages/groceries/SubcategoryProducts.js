import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './SubcategoryProducts.css';

const SubcategoryProducts = ({ subcategories, openCategory, subcategoryProducts, setActiveSubcategory, fetchProducts, onShowModal }) => {

  if (!openCategory || !subcategories[openCategory]) {
    return null; // Ako nema otvorene kategorije ili podkategorija, ne prikazuje se ništa
  }

  return (
    <>
      {subcategories[openCategory].map((subcategory) => {
        const products = subcategoryProducts[subcategory.id] || []; // Dohvaćamo proizvode za podkategoriju

        // Ako nema proizvoda, prikaži poruku
        if (products.length === 0) {
          return (
            <div key={subcategory.id} className="mb-4">
              <h3 className="subcategory-title" onClick={() => { fetchProducts(subcategory.id, true); setActiveSubcategory(subcategory.id); }}>
                {subcategory.name}
              </h3>
              <p>Nema dostupnih proizvoda.</p>
            </div>
          );
        }

        // Dinamički određujemo broj slajdova i razmak
        const slidesToShow = Math.min(products.length, 4);
        const slidesToScroll = Math.min(products.length, 2);
        const hasEnoughProducts = products.length >= slidesToShow;
        
        // Dodajemo CSS klasu za razmak
        const productClass = hasEnoughProducts ? "has-many-products" : "has-few-products";

        const sliderSettings = {
          dots: false,
          arrows: true,
          infinite: false,
          speed: 500,
          slidesToShow: slidesToShow,
          slidesToScroll: slidesToScroll,
          responsive: [
            {
              breakpoint: 1000,
              settings: {
                slidesToShow: Math.min(products.length, 3),
                slidesToScroll: Math.min(products.length, 1),
                centerPadding: hasEnoughProducts ? "15px" : "5px",
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: Math.min(products.length, 2.6),
                slidesToScroll: Math.min(products.length, 1),
                arrows: false,
                centerPadding: hasEnoughProducts ? "10px" : "3px",
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: Math.min(products.length, 1.6),
                slidesToScroll: Math.min(products.length, 1),
                centerPadding: hasEnoughProducts ? "10px" : "3px",
              },
            },
          ],
        };

        return (
          <div key={subcategory.id} className="mb-4">
            <div className="d-flex">
              <h3 className="subcategory-title" onClick={() => { fetchProducts(subcategory.id, true); setActiveSubcategory(subcategory.id); }}>
                {subcategory.name}
              </h3>
              <p className="subcategory-show-all ms-auto me-0"onClick={() => { fetchProducts(subcategory.id, true); setActiveSubcategory(subcategory.id); }}>Prikaži sve</p>
            </div>
            <Slider {...sliderSettings}>
              {products.map((product) => (
                <div key={product.id} className={`slick-slide ${productClass}`}> {/* Dinamički dodajemo klasu */}
                  <ProductCard product={product} onShowModal={onShowModal} />
                </div>
              ))}
            </Slider>
          </div>
        );
      })}
    </>
  );
};

export default SubcategoryProducts;
