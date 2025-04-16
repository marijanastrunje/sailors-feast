import React from "react";

const skeletonStyles = `
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shine 1.2s infinite;
    border-radius: 4px;
  }

  @keyframes shine {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .skeleton-img {
    width: 100%;
    height: 160px;
    border-radius: 4px;
  }

  .skeleton-title {
    height: 24px;
    width: 80%;
    margin-bottom: 10px;
  }

  .skeleton-meta {
    height: 14px;
    width: 50%;
    margin-bottom: 8px;
  }

  .skeleton-text {
    height: 14px;
    width: 100%;
    margin-bottom: 6px;
  }

  @media (max-width: 575.98px) {
    .skeleton-img {
      height: 160px;
    }

    .skeleton-title {
      width: 90%;
    }

    .skeleton-meta {
      width: 70%;
    }

    .skeleton-text {
      width: 100%;
    }
  }
`;

const BlogShortSkeleton = () => {
  return (
    <div className="container d-flex align-items-center blog-home mb-4">
      <style>{skeletonStyles}</style>
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
