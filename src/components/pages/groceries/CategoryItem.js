import React from "react";

const CategoryItem = ({ category, onClick, isActive }) => (
  <div
    className="d-flex flex-column align-items-center text-center"
    onClick={() => onClick(category.id)}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick(category.id)}
    role="button"
    tabIndex="0"
    aria-label={`Select category ${category.name}`}
    title={`Select category ${category.name}`}
  >
    <img
      src={category.image ? category.image.src : "https://placehold.co/20"}
      width={55}
      height={55}
      alt={`${category.name} icon`}
      title={category.name}
    />
    <h3 className={`category-name ${isActive ? 'active-mobile-category' : ''}`}>{category.name}</h3>
  </div>
);

export default CategoryItem;
