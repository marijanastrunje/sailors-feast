import React from "react";

// Skeleton styles
const skeletonStyles = `
  .skeleton-map {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shine 1.5s infinite;
    border-radius: 4px;
    height: 400px;
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
  
  @media (max-width: 767px) {
    .skeleton-map {
      height: 250px !important;
    }
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
    <div style={{ position: "relative", width: "100%" }}>
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      {/* Skeleton map with pins */}
      <div
        className="skeleton-map position-relative"
        style={{
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
      </div>
    </div>
  );
};

export default DeliveryMapSkeleton;