import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryItem from "./CategoryItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './HomePageCategories.css'

const HomePageCategories = ({ categories }) => {
  
    const navigate = useNavigate();

    var desktopSettings = {
      infinite: true,
      speed: 300,
      slidesToShow: 6,   
      swipeToSlide: true,
    };

    var mobileSettings = {
      infinite: false,
      speed: 300,
      slidesToShow: 3.5, 
      swipeToSlide: true,
    };

    return (
      <>
        <div className="d-none d-sm-block col-sm-9 col-md-8 col-lg-7 mx-auto">
          <Slider {...desktopSettings}>
              {categories.map(category => (             
                <CategoryItem key={category.id} category={category} onClick={(id) => navigate("/groceries", { state: { categoryId: id } })} />
              ))}
          </Slider>
        </div>
        <div className="mobileHomePageCategories d-block d-sm-none mx-auto p-2">
          <Slider {...mobileSettings}>
              {categories.map(category => (             
                <CategoryItem key={category.id} category={category} onClick={(id) => navigate("/groceries", { state: { categoryId: id } })} />
              ))}
          </Slider>
        </div>
    </>
    );
};

export default HomePageCategories;     