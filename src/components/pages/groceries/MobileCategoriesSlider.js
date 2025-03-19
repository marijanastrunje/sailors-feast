import React from "react";
import CategoryItem from "./CategoryItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MobileCategoriesSlider.css'

const MobileCategoriesSlider = ({ categories, fetchSubcategories }) => {
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: true,
  };

  return (
    <div className="mobile-categories-slider d-block d-sm-none pt-2">
      <Slider {...settings}>
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} onClick={fetchSubcategories} />
        ))}
      </Slider>
    </div>
  );
};

export default MobileCategoriesSlider;
