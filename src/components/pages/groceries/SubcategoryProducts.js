import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './SubcategoryProducts.css'

const SubcategoryProducts = ({ subcategories, openCategory, subcategoryProducts, setActiveSubcategory, fetchProducts, onProductClick }) => {

  if (!openCategory || !subcategories[openCategory]) {
    return null; // Ako nema otvorene kategorije ili podkategorija, ne prikazuje se ništa
  }

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <>
      {subcategories[openCategory].map((subcategory) => (
        <div key={subcategory.id} className="mb-4">
          <h3 className="subcategory-title" onClick={() => { fetchProducts(subcategory.id, true); setActiveSubcategory(subcategory.id);}}>
            {subcategory.name}
          </h3>
          <Slider {...sliderSettings}>
            {subcategoryProducts[subcategory.id] && subcategoryProducts[subcategory.id].length > 0 ? (
              subcategoryProducts[subcategory.id].map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
              ))
            ) : (
              <p>Učitavanje proizvoda...</p>
            )}
          </Slider>
        </div>
      ))}
    </>
  );
};

export default SubcategoryProducts;
