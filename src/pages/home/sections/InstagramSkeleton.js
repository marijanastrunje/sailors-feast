import React from "react";

const InstagramSkeleton = () => {
  return (
    <div className="py-4">
      <div
        style={{
          width: "150px",
          height: "30px",
          backgroundColor: "#e0e0e0",
          marginBottom: "20px",
        }}
      ></div>
      <div className="row">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-6 mb-2">
            <div
              style={{
                height: "100px",
                backgroundColor: "#f0f0f0",
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramSkeleton;
