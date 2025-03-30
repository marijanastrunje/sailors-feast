import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './SubcategoryProducts.css';

const SubcategoryProducts = ({ subcategories, openCategory, subcategoryProducts, setActiveSubcategory, fetchProducts, onShowModal }) => {
  if (!openCategory || !subcategories[openCategory]) return null;

  return (
    <>
      {subcategories[openCategory].map((subcategory) => {
        const products = subcategoryProducts[subcategory.id] || [];

        if (products.length === 0) {
          return (
            <div key={subcategory.id} className="mb-4" role="region" aria-labelledby={`subcategory-${subcategory.id}`}>
              <h3
                id={`subcategory-${subcategory.id}`}
                className="subcategory-title"
                onClick={() => { fetchProducts(subcategory.id, true); setActiveSubcategory(subcategory.id); }}
                role="button"
                tabIndex="0"
                aria-label={`View all products in ${subcategory.name}`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fetchProducts(subcategory.id, true)}
              >
                {subcategory.name}
              </h3>
              <p>No products available.</p>
            </div>
          );
        }

        const slidesToShow = Math.min(products.length, 4);
        const slidesToScroll = Math.min(products.length, 2);
        const hasEnoughProducts = products.length >= slidesToShow;

        const productClass = hasEnoughProducts ? "has-many-products" : "has-few-products";

        const sliderSettings = {
          dots: false,
          arrows: true,
          infinite: false,
          speed: 500,
          slidesToShow,
          slidesToScroll,
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
          <div key={subcategory.id} className="mb-4" role="region" aria-labelledby={`subcategory-${subcategory.id}`}>
            <div className="d-flex align-items-center">
              <h3
                id={`subcategory-${subcategory.id}`}
                className="subcategory-title"
                onClick={() => { fetchProducts(subcategory.id, true); setActiveSubcategory(subcategory.id); }}
                role="button"
                tabIndex="0"
                aria-label={`View all products in ${subcategory.name}`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fetchProducts(subcategory.id, true)}
              >
                {subcategory.name}
              </h3>
              <p
                className="subcategory-show-all ms-auto me-0"
                onClick={() => { fetchProducts(subcategory.id, true); setActiveSubcategory(subcategory.id); }}
                role="button"
                tabIndex="0"
                aria-label={`Show all ${subcategory.name}`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fetchProducts(subcategory.id, true)}
              >
                Show all
              </p>
            </div>

            <Slider {...sliderSettings}>
              {products.map((product) => (
                <div key={product.id} className={`slick-slide ${productClass}`}>
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
