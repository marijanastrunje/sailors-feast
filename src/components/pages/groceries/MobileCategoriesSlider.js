import React from "react";
import CategoryItem from "./CategoryItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MobileCategoriesSlider.css';

const MobileCategoriesSlider = ({ categories, fetchSubcategories, activeCategory }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 3.5,
    swipeToSlide: true,
    focusOnSelect: true,
    accessibility: true,
  };

  return (
    <div
      className="mobile-categories-slider d-block d-sm-none pt-2"
      role="region"
      aria-label="Mobile categories carousel"
      title="Browse categories"
    >
      <Slider {...settings}>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onClick={fetchSubcategories}
            isActive={category.id === activeCategory}
          />
        ))}
      </Slider>
    </div>
  );
};

export default MobileCategoriesSlider;
