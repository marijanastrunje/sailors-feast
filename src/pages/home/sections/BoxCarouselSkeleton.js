import React from "react";

// Skeleton styles (same as previous components)
const skeletonStyles = `
  .skeleton-img,
  .skeleton-title,
  .skeleton-text,
  .skeleton-price,
  .skeleton-button,
  .skeleton-icon,
  .skeleton-item,
  .skeleton-bullet {
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

const BoxCarouselSkeleton = () => {
  return (
    <div className="container">
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      <div className="row justify-content-center">
        {/* Skeleton title */}
        <div className="skeleton-title mx-auto mb-3" style={{ height: "32px", width: "120px" }} />

        <div className="box-carousel col-12 col-md-8 col-lg-6 p-0">
          {/* Skeleton for carousel */}
          <div className="position-relative" style={{ borderRadius: "8px", overflow: "hidden" }}>
            {/* Skeleton for carousel image */}
            <div 
              className="skeleton-img" 
              style={{ height: "350px", width: "100%", borderRadius: "8px" }}
            />
            
            {/* Skeleton for carousel text overlay */}
            <div className="mx-5 px-sm-3 position-absolute" style={{ bottom: "20px", left: "0", right: "0" }}>
              {/* Skeleton title */}
              <div className="skeleton-title mb-2" style={{ height: "28px", width: "70%" }} />
              
              {/* Skeleton description */}
              <div className="skeleton-text mb-1" style={{ height: "16px", width: "100%" }} />
              <div className="skeleton-text mb-1" style={{ height: "16px", width: "90%" }} />
              <div className="skeleton-text mb-3" style={{ height: "16px", width: "80%" }} />
              
              {/* Skeleton button */}
              <div className="skeleton-button mt-2" style={{ height: "38px", width: "120px" }} />
            </div>
          </div>
          
          {/* Skeleton carousel controls */}
          <div className="d-flex justify-content-between position-absolute" style={{ top: "50%", left: "0", right: "0" }}>
            <div className="skeleton-icon" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
            <div className="skeleton-icon" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
          </div>
        </div>

        {/* "Why choose Sailor's Feast" section */}
        <div className="why-us d-none d-lg-inline col-lg-3 bg-white pt-4">
          {/* Skeleton title */}
          <div className="skeleton-title mx-auto mb-3" style={{ height: "24px", width: "80%" }} />
          
          {/* Skeleton list items */}
          <ul className="ps-2" style={{ listStyleType: "none" }}>
            {[1, 2, 3, 4].map((item, index) => (
              <li key={index} className="d-flex align-items-center mb-3">
                {/* Skeleton bullet point */}
                <div className="skeleton-bullet mx-2" style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
                
                {/* Skeleton text */}
                <div className="skeleton-text" style={{ height: "16px", width: "80%" }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BoxCarouselSkeleton;