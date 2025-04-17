import React from "react";

const CategoryItem = ({ category, onClick, isActive, isVisible = true }) => (
  <div
    className="d-flex flex-column align-items-center text-center"
    onClick={isVisible ? () => onClick(category.id) : undefined}
    onKeyDown={isVisible ? (e) => {
      if (e.key === "Enter" || e.key === " ") {
        onClick(category.id);
      }
    } : undefined}
    role="button"
    tabIndex={isVisible ? 0 : -1}
    aria-label={isVisible ? `Select category ${category.name}` : undefined}
    aria-hidden={!isVisible}
    title={category.name}
  >
    <img
      src={category.image ? category.image.src : "https://placehold.co/20"}
      width={55}
      height={55}
      alt={`${category.name} icon`}
      title={category.name}
    />
    <h3 className={`category-name ${isActive ? 'active-mobile-category' : ''}`}>
      {category.name}
    </h3>
  </div>
);

export default CategoryItem;
