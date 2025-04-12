import React from "react";
import './MobileSubcategoriesSlider.css';

// Skeleton styles
const skeletonStyles = `
  .skeleton-subcategory {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shine 1.5s infinite;
    border-radius: 20px;
    height: 30px;
    width: 120px;
    margin: 0 8px;
    display: inline-block;
  }
  
  @keyframes shine {
    to {
      background-position: -200% 0;
    }
  }
  
  .subcategory-skeleton-container {
    white-space: nowrap;
    overflow-x: hidden;
    padding: 10px 0;
  }
`;

const MobileSubcategoriesSliderSkeleton = ({ itemCount = 4 }) => {
  return (
    <div
      className="mobile-subcategories-slider d-block d-sm-none py-2 mb-3"
      role="region"
      aria-label="Loading subcategories"
    >
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      {/* Fake slider with skeleton items */}
      <div className="subcategory-skeleton-container">
        {[...Array(itemCount)].map((_, index) => (
          <div
            key={index}
            className="skeleton-subcategory"
          />
        ))}
      </div>
    </div>
  );
};

export default MobileSubcategoriesSliderSkeleton;