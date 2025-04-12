import React from "react";

const FaqSkeleton = () => {
  return (
    <div className="container py-4">
      <div
        style={{
          width: "100px",
          height: "30px",
          backgroundColor: "#e0e0e0",
          marginBottom: "20px",
        }}
      ></div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: "60px",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        ></div>
      ))}
    </div>
  );
};

export default FaqSkeleton;
