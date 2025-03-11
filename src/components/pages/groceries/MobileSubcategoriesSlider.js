import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MobileSubcategoriesSlider.css'

const MobileSubcategoriesSlider = ({ subcategories, openCategory, fetchProducts, setActiveSubcategory, excludedSubcategories = [] }) => {
  
  if (!openCategory || !subcategories[openCategory]) {
    return null; // Ako nema otvorene kategorije ili nema podkategorija, ne prikazujemo ništa
  }

  const filteredSubcategories = subcategories[openCategory].filter(
    (subcategory) => !excludedSubcategories.includes(subcategory.id)
  );

  if (filteredSubcategories.length === 0) {
    return null; // Ako su sve podkategorije isključene, ne prikazujemo ništa
  }

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 300,
    slidesToShow: 2,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
  };

  return (
    <div className="mobile-subcategories-slider d-block d-sm-none py-2 mb-3">
      <Slider {...settings}>
        {filteredSubcategories.map((subcategory) => (
          <div key={subcategory.id} onClick={() => { fetchProducts(subcategory.id, true); setActiveSubcategory(subcategory.id);}} className="subcategory-slide-item px-2">
            <h4 className="subcategory-name">{subcategory.name}</h4>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MobileSubcategoriesSlider;
