import React from "react";

// Skeleton styles (same as previous components)
const skeletonStyles = `
  .skeleton-img,
  .skeleton-title,
  .skeleton-text,
  .skeleton-price,
  .skeleton-button,
  .skeleton-icon,
  .skeleton-map {
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
  
  .map-pin {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shine 1.5s infinite;
  }
`;

const DeliveryMapSkeleton = () => {
  // Create an array of pins positions for the map
  const pins = [
    { top: "30%", left: "20%" },
    { top: "45%", left: "35%" },
    { top: "25%", left: "50%" },
    { top: "60%", left: "65%" },
    { top: "40%", left: "80%" },
  ];

  return (
    <div className="container my-5">
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      <div className="row justify-content-center">
        {/* Skeleton title */}
        <div 
          className="skeleton-title mx-auto mb-4"
          style={{ height: "32px", width: "300px" }}
        />
        
        <div className="col-md-10">
          {/* Skeleton map with pins */}
          <div 
            className="skeleton-map position-relative"
            style={{ 
              height: "400px", 
              width: "100%", 
              borderRadius: "8px" 
            }}
          >
            {/* Map location pins */}
            {pins.map((pin, index) => (
              <div 
                key={index}
                className="map-pin"
                style={{ 
                  top: pin.top, 
                  left: pin.left 
                }}
              />
            ))}
            
            {/* Skeleton zoom controls */}
            <div 
              className="position-absolute d-flex flex-column"
              style={{ 
                right: "20px", 
                top: "20px" 
              }}
            >
              <div 
                className="skeleton-button mb-1"
                style={{ 
                  height: "28px", 
                  width: "28px" 
                }}
              />
              <div 
                className="skeleton-button"
                style={{ 
                  height: "28px", 
                  width: "28px" 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMapSkeleton;