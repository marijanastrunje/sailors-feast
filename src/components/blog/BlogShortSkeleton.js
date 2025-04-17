import React from "react";
import "./BlogShortSkeleton.css";

const BlogShortSkeleton = () => {
  return (
    <div className="container d-flex align-items-center blog-home mb-4">
      <div className="row w-100">
        <div className="blog-img col-sm-5 col-md-4 col-lg-4 mb-2 mb-lg-0">
          <div className="skeleton skeleton-img" />
        </div>
        <div className="col-12 col-sm-7 col-md-8 col-lg-8">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-meta" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
};

export default BlogShortSkeleton;
