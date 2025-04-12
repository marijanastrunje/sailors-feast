import React from "react";
import './CategoriesSidebar.css';

// Skeleton styles (same as previous components)
const skeletonStyles = `
  .skeleton-item,
  .skeleton-img,
  .skeleton-title,
  .skeleton-text,
  .skeleton-icon {
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
  
  .skeleton-category {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .skeleton-subcategory {
    padding: 0.5rem 1.25rem;
    margin-left: 1.5rem;
  }
`;

const CategoriesSidebarSkeleton = ({ showSubcategories = true, categoryCount = 6, subcategoryCount = 4 }) => {
  // Create arrays for categories and subcategories
  const categories = Array(categoryCount).fill(0);
  const subcategories = Array(subcategoryCount).fill(0);

  return (
    <>
      {/* Include custom styles */}
      <style>{skeletonStyles}</style>
      
      <ul className="categories-list list-group" aria-label="Loading categories">
        {categories.map((_, index) => (
          <li key={index} className="list-group-item">
            <div className="skeleton-category">
              {/* Category icon */}
              <div 
                className="skeleton-img me-2"
                style={{ width: "35px", height: "35px", borderRadius: "4px" }}
              />
              
              {/* Category name */}
              <div 
                className="skeleton-title"
                style={{ height: "18px", width: `${Math.random() * 30 + 60}%`, flexGrow: 1 }}
              />
              
              {/* Chevron icon */}
              <div 
                className="skeleton-icon ms-auto"
                style={{ width: "12px", height: "12px" }}
              />
            </div>
            
            {/* Show subcategories for the first category only if showSubcategories is true */}
            {showSubcategories && index === 0 && (
              <ul className="subcategories-list list-group ms-4">
                {subcategories.map((_, subIndex) => (
                  <li key={subIndex} className="list-group-item small">
                    <div className="skeleton-subcategory">
                      {/* Subcategory name */}
                      <div 
                        className="skeleton-title"
                        style={{ height: "14px", width: `${Math.random() * 30 + 40}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default CategoriesSidebarSkeleton;