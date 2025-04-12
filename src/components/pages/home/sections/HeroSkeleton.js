import React from "react";

// Poboljšane shimmer boje i optimizacija performansi
const skeletonStyles = `
  .skeleton-img,
  .skeleton-title,
  .skeleton-text,
  .skeleton-price,
  .skeleton-button,
  .skeleton-icon {
    background: linear-gradient(90deg, #f5f5f5 25%, #e8e8e8 50%, #f5f5f5 75%);
    background-size: 200% 100%;
    animation: shine 1.5s infinite;
    border-radius: 4px;
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
    will-change: background-position;
  }

  @keyframes shine {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const HeroSkeleton = () => {
  return (
    <section
      id="hero"
      className="align-items-md-center justify-content-md-start mb-0 position-relative"
      style={{
        overflow: "hidden",
        backgroundColor: "#fafafa", // dodatno smiruje pozadinu
      }}
    >
      {/* Uključi poboljšane stilove */}
      <style>{skeletonStyles}</style>

      {/* Suptilna animirana pozadina */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background: "linear-gradient(90deg, #f5f5f5 25%, #e8e8e8 50%, #f5f5f5 75%)",
          backgroundSize: "200% 100%",
          animation: "shine 1.5s infinite",
          backfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)",
          willChange: "background-position",
          zIndex: 0,
        }}
      />

      <div className="hero-text ps-md-5 ms-md-5 position-relative" style={{ zIndex: 1 }}>
        {/* Logo skeleton */}
        <div className="skeleton-icon me-2 mt-2" style={{ width: "70px", height: "80px" }} />

        <div>
          {/* Naslov */}
          <div className="skeleton-title mb-3" style={{ width: "300px", height: "40px" }} />

          {/* Paragrafi */}
          <div className="skeleton-text mb-2" style={{ width: "100%", maxWidth: "500px", height: "16px" }} />
          <div className="skeleton-text mb-2" style={{ width: "90%", maxWidth: "450px", height: "16px" }} />
          <div className="skeleton-text mb-4" style={{ width: "80%", maxWidth: "400px", height: "16px" }} />

          {/* Gumb */}
          <div className="skeleton-button" style={{ width: "120px", height: "38px" }} />
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
