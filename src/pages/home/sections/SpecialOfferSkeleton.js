import React from "react";

// Skeleton styles (same as previous components)
const skeletonStyles = `
  .skeleton-img,
  .skeleton-title,
  .skeleton-text,
  .skeleton-price,
  .skeleton-button,
  .skeleton-icon {
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
`;

// Import a skeleton version of WeatherCard if needed
const WeatherCardSkeleton = () => (
  <div className="weather-card">
    <div 
      className="skeleton-img" 
      style={{ height: "180px", width: "100%", borderRadius: "8px" }}
    />
  </div>
);

const SpecialOfferSkeleton = () => {
  return (
    <div className="container me-md-3">
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      <div className="row justify-content-center justify-content-lg-end">
        <div className="col-md-6 text-center pb-2">
          <div className="d-flex align-items-center justify-content-center mb-2">
            {/* Skeleton for icon */}
            <div
              className="skeleton-icon me-2"
              style={{ width: "60px", height: "60px", borderRadius: "8px" }}
            />
            
            {/* Skeleton for title */}
            <div 
              className="skeleton-title mb-0"
              style={{ height: "32px", width: "200px" }}
            />
          </div>
          
          {/* Skeleton for content */}
          <div className="mb-3">
            <div
              className="skeleton-text mx-auto mb-2"
              style={{ height: "16px", width: "90%" }}
            />
            <div
              className="skeleton-text mx-auto mb-2"
              style={{ height: "16px", width: "80%" }}
            />
            <div
              className="skeleton-text mx-auto"
              style={{ height: "16px", width: "60%" }}
            />
          </div>
          
          {/* Skeleton for button */}
          <div
            className="skeleton-button mx-auto"
            style={{ height: "38px", width: "150px" }}
          />
        </div>
        
        <div className="d-none d-md-block col-md-4 col-lg-3 offset-lg-1">
          <WeatherCardSkeleton />
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferSkeleton;