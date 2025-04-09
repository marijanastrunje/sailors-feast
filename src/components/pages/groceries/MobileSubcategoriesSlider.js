import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MobileSubcategoriesSlider.css';

const MobileSubcategoriesSlider = ({
  subcategories,
  openCategory,
  fetchProducts,
  setActiveSubcategory,
  excludedSubcategories = [],
  setActiveSubcategoryName
}) => {
  if (!openCategory || !subcategories[openCategory]) {
    return null; // No category opened or no subcategories available
  }

  const filteredSubcategories = subcategories[openCategory].filter(
    (subcategory) => !excludedSubcategories.includes(subcategory.id)
  );

  if (filteredSubcategories.length === 0) {
    return null; // All subcategories are excluded
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
    accessibility: true,
  };

  return (
    <div
      className="mobile-subcategories-slider d-block d-sm-none py-2 mb-3"
      role="region"
      aria-label="Mobile subcategories carousel"
      title="Choose a subcategory"
    >
      <Slider {...settings}>
        {filteredSubcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            onClick={() => {
              fetchProducts(subcategory.id, true);
              setActiveSubcategory(subcategory.id);
              setActiveSubcategoryName(subcategory.name);
            }}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              (() => {
                fetchProducts(subcategory.id, true);
                setActiveSubcategory(subcategory.id);
                setActiveSubcategoryName(subcategory.name);
              })()
            }
            className="subcategory-slide-item px-2"
            role="button"
            tabIndex="0"
            aria-label={`Select subcategory ${subcategory.name}`}
            title={`Select subcategory ${subcategory.name}`}
          >
            <h4 className="subcategory-name">{subcategory.name}</h4>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MobileSubcategoriesSlider;
