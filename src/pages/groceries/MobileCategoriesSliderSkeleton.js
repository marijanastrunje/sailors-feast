import React from "react";
import './MobileCategoriesSlider.css';

// Skeleton styles
const skeletonStyles = `
  .skeleton-category {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shine 1.5s infinite;
    border-radius: 50%;
  }
  
  .skeleton-text {
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
    text-align: center;
    padding: 0 5px;
    cursor: default;
  }
`;

const MobileCategoriesSliderSkeleton = ({ itemCount = 5 }) => {
  return (
    <div
      className="mobile-categories-slider d-block d-sm-none pt-2"
      role="region"
      aria-label="Loading mobile categories"
    >
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      {/* Fake slider with skeleton items */}
      <div style={{ display: "flex", overflowX: "hidden" }}>
        {[...Array(itemCount)].map((_, index) => (
          <div key={index} className="skeleton-category-item" style={{ flex: "0 0 28%" }}>
            <div 
              className="skeleton-category mx-auto mb-2" 
              style={{ 
                width: "60px", 
                height: "60px" 
              }}
            />
            <div 
              className="skeleton-text mx-auto" 
              style={{ 
                height: "14px", 
                width: "80%" 
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCategoriesSliderSkeleton;