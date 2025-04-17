import React from "react";

const HomePageBlogSkeleton = () => {
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
        {[1, 2].map((i) => (
          <div key={i} className="col-md-6 mb-4">
            <div
              style={{
                height: "200px",
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

export default HomePageBlogSkeleton;
