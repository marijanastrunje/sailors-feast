import React from "react";

// Skeleton styles (same as HeroSkeleton)
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

const AdvantagesSkeleton = () => {
  // Create an array of 3 items to match your advantages layout
  const skeletonItems = [0, 1, 2];

  return (
    <div className="container mt-4 mt-sm-5">
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      <div className="row">
        {skeletonItems.map((index) => {
          let imageCol = "col-xl-6";
          let imageOrder = "order-1 order-md-1";
          let textCol = "col-xl-6";
          let textOrder = "order-2 order-md-2";
          let textAlign = "text-start text-md-center text-xl-start";
          
          if (index === 1) {
            imageCol = "col-xl-5";
            imageOrder = "order-2 order-md-1";
            textOrder = "order-1 order-md-2";
            textAlign = "text-end text-md-center text-xl-start";
          } else if (index === 2) {
            imageCol = "col-xl-5";
            imageOrder = "order-first order-md-first";
            textOrder = "order-2 order-md-2";
            textAlign = "text-start text-md-center text-xl-start";
          }
          
          return (
            <div key={index} className="col-md-4 advantage-item mb-4 mb-md-0">
              <div className="row px-2 align-items-center justify-content-center">
                <div className={`advantage-image col-6 col-md-12 ${imageCol} ${imageOrder} text-center`}>
                  {/* Skeleton image */}
                  <div
                    className="skeleton-img mb-2 mx-auto"
                    style={{ width: "180px", height: "130px" }}
                  />
                </div>
                <div className={`col-6 col-md-12 ${textCol} ${textOrder} ${textAlign} p-0`}>
                  {/* Skeleton title */}
                  <div 
                    className="skeleton-title advantage-label mb-2"
                    style={{ height: "24px", width: "80%" }}
                  />
                  
                  {/* Skeleton description */}
                  <div
                    className="skeleton-text mb-1"
                    style={{ height: "16px", width: "100%" }}
                  />
                  <div
                    className="skeleton-text"
                    style={{ height: "16px", width: "80%" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdvantagesSkeleton;