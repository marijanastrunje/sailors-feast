import React from "react";
import './HomePageCategories.css';

// Skeleton styles (same as previous components)
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
  
  .skeleton-slider {
    height: 150px;
    display: flex;
    align-items: center;
  }
  
  .skeleton-category-item {
    display: inline-block;
    width: 100%;
    max-width: 100px;
    margin: 0 10px;
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

  return (
    <>
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      {/* Desktop slider skeleton */}
      <div
        className="skeleton-slider d-none d-sm-block col-sm-9 col-md-8 col-lg-7 mx-auto"
        style={{ 
          display: "flex", 
          justifyContent: "space-between",
          maxHeight: "150px"
        }}
      >
        {desktopItems.map((_, index) => (
          <CategoryItemSkeleton key={index} />
        ))}
      </div>

      {/* Mobile slider skeleton */}
      <div
        className="skeleton-slider mobileHomePageCategories d-block d-sm-none mx-auto p-2"
        style={{ 
          display: "flex", 
          justifyContent: "flex-start",
          maxHeight: "150px"
        }}
      >
        {mobileItems.map((_, index) => (
          <CategoryItemSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

export default HomePageCategoriesSkeleton;