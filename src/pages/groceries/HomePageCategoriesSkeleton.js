import React from "react";
import './HomePageCategories.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Skeleton styles
const skeletonStyles = `
  .skeleton-img,
  .skeleton-title,
  .skeleton-text,
  .skeleton-price,
  .skeleton-button,
  .skeleton-icon,
  .skeleton-category {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shine 1.5s infinite;
    border-radius: 4px;
  }
  
  @keyframes shine {
    to {
      background-position: -200% 0;
    }
  }
  
  .skeleton-category-item {
    display: inline-block;
    width: 100%;
    padding: 0 8px;
    text-align: center;
  }
`;

// Skeleton version of the CategoryItem component
const CategoryItemSkeleton = () => (
  <div className="skeleton-category-item">
    <div 
      className="skeleton-category mx-auto mb-2"
      style={{
        width: "60px",
        height: "60px",
        borderRadius: "50%"
      }}
    />
    <div 
      className="skeleton-title mx-auto"
      style={{
        width: "80%",
        height: "14px"
      }}
    />
  </div>
);

const HomePageCategoriesSkeleton = () => {
  // Create arrays for desktop and mobile sliders
  const desktopItems = Array(6).fill(0);
  const mobileItems = Array(4).fill(0);

  // Settings to match the original component
  const desktopSettings = {
    infinite: false,
    speed: 200,
    slidesToShow: 6,
    swipeToSlide: true,
    accessibility: true,
    arrows: false,
    dots: false
  };

  const mobileSettings = {
    infinite: false,
    speed: 300,
    slidesToShow: 3.5,
    swipeToSlide: true,
    accessibility: true,
    arrows: false,
    dots: false
  };

  return (
    <>
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      {/* Desktop slider skeleton */}
      <div
        className="d-none d-sm-block col-sm-9 col-md-8 col-lg-7 mx-auto"
        role="region"
        aria-label="Homepage category skeleton for desktop"
      >
        <Slider {...desktopSettings}>
          {desktopItems.map((_, index) => (
            <CategoryItemSkeleton key={index} />
          ))}
        </Slider>
      </div>

      {/* Mobile slider skeleton */}
      <div
        className="mobileHomePageCategories d-block d-sm-none mx-auto p-2"
        role="region"
        aria-label="Homepage category skeleton for mobile"
      >
        <Slider {...mobileSettings}>
          {mobileItems.map((_, index) => (
            <CategoryItemSkeleton key={index} />
          ))}
        </Slider>
      </div>
    </>
  );
};

export default HomePageCategoriesSkeleton;