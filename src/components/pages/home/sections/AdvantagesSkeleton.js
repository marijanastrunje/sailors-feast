import React from "react";

const skeletonStyles = `
  .skeleton-img,
  .skeleton-title,
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

  @media (max-width: 768px) {
    .skeleton-title,
    .skeleton-text {
      width: 100% !important;
      margin-left: 0 !important;
    }

    .advantage-image {
      justify-content: center !important;
    }
  }
`;

const AdvantagesSkeleton = () => {
  const skeletonItems = [0, 1, 2];

  return (
    <div className="container mt-4 mt-sm-5">
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
                {/* Skeleton image */}
                <div className={`advantage-image col-6 col-md-12 ${imageCol} ${imageOrder} text-center mb-3`}>
                  <div
                    className="skeleton-img mx-auto"
                    style={{
                      width: "100%",
                      maxWidth: "180px",
                      height: "130px",
                    }}
                  />
                </div>

                {/* Skeleton text */}
                <div className={`col-6 col-md-12 ${textCol} ${textOrder} ${textAlign} p-0`}>
                  <div
                    className="skeleton-title advantage-label mb-2"
                    style={{
                      height: "24px",
                      width: "80%",
                      maxWidth: "260px",
                      marginLeft: "auto",
                      marginRight: textAlign.includes("end") ? "0" : "auto",
                    }}
                  />

                  <div
                    className="skeleton-text mb-1"
                    style={{
                      height: "16px",
                      width: "100%",
                      maxWidth: "300px",
                      marginLeft: "auto",
                      marginRight: textAlign.includes("end") ? "0" : "auto",
                    }}
                  />
                  <div
                    className="skeleton-text"
                    style={{
                      height: "16px",
                      width: "80%",
                      maxWidth: "240px",
                      marginLeft: "auto",
                      marginRight: textAlign.includes("end") ? "0" : "auto",
                    }}
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
