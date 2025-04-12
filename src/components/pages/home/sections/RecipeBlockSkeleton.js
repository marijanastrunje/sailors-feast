import React from "react";

const RecipeBlockSkeleton = () => {
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-6">
          <div
            style={{
              width: "100px",
              height: "30px",
              backgroundColor: "#e0e0e0",
            }}
          ></div>
        </div>
        <div className="col-6 text-end">
          <div
            style={{
              width: "80px",
              height: "20px",
              backgroundColor: "#e0e0e0",
              float: "right",
            }}
          ></div>
        </div>
      </div>

      <div className="row mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="col-md-4 mb-4">
            <div
              style={{
                height: "300px",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeBlockSkeleton;
