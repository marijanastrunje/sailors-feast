import React from "react";

const CategoryItem = ({ category, onClick }) => (
  <div
    className="d-flex flex-column align-items-center text-center"
    onClick={() => onClick(category.id)}
  >
    <img src={category.image ? category.image.src : "https://placehold.co/20"} width={55} height={55} alt={category.name} />
    <h3 className="category-name">{category.name}</h3>
  </div>
);

export default CategoryItem;
