import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryItem from "./CategoryItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './HomePageCategories.css';

const HomePageCategories = ({ categories }) => {
  const navigate = useNavigate();

  const [desktopSlide, setDesktopSlide] = useState(0);
  const [mobileSlide, setMobileSlide] = useState(0);

  const desktopSettings = {
    infinite: false,
    speed: 200,
    slidesToShow: 6,
    swipeToSlide: true,
    accessibility: true,
    beforeChange: (_, next) => setDesktopSlide(next),
  };

  const mobileSettings = {
    infinite: false,
    speed: 300,
    slidesToShow: 3.5,
    swipeToSlide: true,
    accessibility: true,
    beforeChange: (_, next) => setMobileSlide(next),
  };

  return (
    <>
      {/* Desktop slider */}
      <div
        className="d-none d-sm-block col-sm-9 col-md-8 col-lg-7 mx-auto"
        role="region"
        aria-label="Homepage category slider for desktop"
        title="Desktop category slider"
      >
        <Slider {...desktopSettings}>
          {categories.map((category, index) => (
            <CategoryItem
              key={category.id}
              category={category}
              onClick={(id) => navigate("/groceries", { state: { categoryId: id } })}
              isVisible={index >= desktopSlide && index < desktopSlide + 6}
            />
          ))}
        </Slider>
      </div>

      {/* Mobile slider */}
      <div
        className="mobileHomePageCategories d-block d-sm-none mx-auto p-2"
        role="region"
        aria-label="Homepage category slider for mobile"
        title="Mobile category slider"
      >
        <Slider {...mobileSettings}>
          {categories.map((category, index) => (
            <CategoryItem
              key={category.id}
              category={category}
              onClick={(id) => navigate("/groceries", { state: { categoryId: id } })}
              isVisible={index >= mobileSlide && index < mobileSlide + 4}
            />
          ))}
        </Slider>
      </div>
    </>
  );
};

export default HomePageCategories;
