import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import './CategoriesSidebar.css';

const CategoriesSidebar = ({
  categories,
  openCategory,
  subcategories,
  setActiveSubcategory,
  fetchSubcategories,
  fetchProducts,
  setActiveSubcategoryName
}) => {
  return (
    <ul className="categories-list list-group" aria-label="Main categories list">
      {categories.map((category) => (
        <li key={category.id} className="list-group-item">
        <div
          className="d-flex align-items-center"
          onClick={() => fetchSubcategories(category.id)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fetchSubcategories(category.id)}
          role="button"
          tabIndex="0"
          aria-expanded={openCategory === category.id}
          aria-label={`Open subcategories for ${category.name}`}
          title={`Open subcategories for ${category.name}`}
        >
          <img
            src={category.image ? category.image.src : "https://placehold.co/20"}
            width="35"
            height="35"
            className="me-2"
            alt={`${category.name} icon`}
            title={category.name}
          />
          {category.name}
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`ms-auto text-muted transition ${openCategory === category.id ? "rotate-icon" : ""}`}
            aria-hidden="true"
          />
        </div>      

          {openCategory === category.id && subcategories[category.id] && (
            <ul className="subcategories-list list-group ms-4" aria-label={`Subcategories of ${category.name}`}>
              {subcategories[category.id].map((subcategory) => (
                <li
                  key={subcategory.id}
                  className="list-group-item small text-muted"
                  onClick={() => {
                    fetchProducts(subcategory.id, true);
                    setActiveSubcategory(subcategory.id);
                    setActiveSubcategoryName(subcategory.name);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      fetchProducts(subcategory.id, true);
                      setActiveSubcategory(subcategory.id);
                      setActiveSubcategoryName(subcategory.name); 
                    }
                  }}
                  role="button"
                  tabIndex="0"
                  aria-label={`Select subcategory ${subcategory.name}`}
                  title={`View products in ${subcategory.name}`}
                >
                  {subcategory.name}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CategoriesSidebar;
