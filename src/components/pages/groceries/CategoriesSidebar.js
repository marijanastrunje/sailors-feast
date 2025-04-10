import React, { useCallback } from "react";
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
  setActiveSubcategoryName,
  activeSubcategory
}) => {
  // Optimizacija: Memorizirajte funkcije handlera
  const handleCategoryClick = useCallback((categoryId) => {
    fetchSubcategories(categoryId);
  }, [fetchSubcategories]);

  const handleSubcategoryClick = useCallback((subcategoryId, name) => {
    fetchProducts(subcategoryId, true);
    setActiveSubcategory(subcategoryId);
    setActiveSubcategoryName(name);
  }, [fetchProducts, setActiveSubcategory, setActiveSubcategoryName]);

  return (
    <ul className="categories-list list-group" aria-label="Main categories list">
      {categories.map((category) => (
        <li key={category.id} className={`list-group-item ${openCategory === category.id ? 'active-category' : ''}`}>
          <div
            className="d-flex align-items-center"
            onClick={() => handleCategoryClick(category.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCategoryClick(category.id)}
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
              loading="lazy"
              decoding="async"
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
                  className={`list-group-item small ${activeSubcategory === subcategory.id ? "active-subcategory" : "text-muted"}`}
                  onClick={() => handleSubcategoryClick(subcategory.id, subcategory.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSubcategoryClick(subcategory.id, subcategory.name);
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

export default React.memo(CategoriesSidebar);