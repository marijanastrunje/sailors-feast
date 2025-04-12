import React from "react";
import "./BlogShortSkeleton.css";

const BlogShortSkeleton = () => {
  return (
    <div className="container d-flex align-items-center blog-home">
      <div className="row">
        <div className="blog-img col-sm-5 col-md-4 col-lg-4 mb-2 mb-lg-0">
          <div className="skeleton-img-container animate-pulse"></div>
        </div>
        <div className="col-12 col-sm-7 col-md-8 col-lg-8">
          <div className="skeleton-title animate-pulse mb-3"></div>
          <div className="d-flex mb-2">
            <div className="skeleton-date animate-pulse me-2"></div>
            <div className="skeleton-category animate-pulse"></div>
          </div>
          <div className="skeleton-text animate-pulse mb-1"></div>
          <div className="skeleton-text animate-pulse mb-1"></div>
          <div className="skeleton-text animate-pulse" style={{ width: '75%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BlogShortSkeleton;