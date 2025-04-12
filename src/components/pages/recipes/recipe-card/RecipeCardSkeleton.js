import React from 'react';
import './RecipeCardSkeleton.css';

const RecipeCardSkeleton = () => {
  return (
    <div className="card skeleton-card">
      <div className="recipe-img skeleton-img">
        <div className="skeleton-img-placeholder animate-pulse"></div>
        <div className="skeleton-bookmark animate-pulse"></div>
      </div>
      
      <div className="card-body p-1 pt-0">
        <div className="recipe-meta py-1 p-sm-1 pb-0 pb-sm-0">
          <div className="row">
            <div className="col-7 d-flex align-items-center">
              <span className="skeleton-icon animate-pulse"></span>
              <div className="skeleton-time animate-pulse"></div>
            </div>
            <div className="col-5 d-flex justify-content-end align-items-center">
              <div className="skeleton-icon animate-pulse me-1"></div>
              <div className="skeleton-icon animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="skeleton-title animate-pulse mx-auto my-1"></div>
        <div className="skeleton-description animate-pulse mx-auto"></div>
      </div>
      
      <div className="skeleton-author animate-pulse ms-1"></div>
    </div>
  );
};

export default RecipeCardSkeleton;