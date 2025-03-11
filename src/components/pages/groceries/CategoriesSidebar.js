import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import './CategoriesSidebar.css'

const CategoriesSidebar = ({ categories, openCategory, subcategories, setActiveSubcategory, fetchSubcategories, fetchProducts }) => {

    return (
        <ul className="categories-list list-group">
            {categories.map((category) => (
            <li key={category.id} className="list-group-item">
                <div className="d-flex align-items-center" onClick={() => fetchSubcategories(category.id)}>
                <img src={category.image ? category.image.src : "https://placehold.co/20"} width="35" height="35" className="me-2" alt={category.name} />
                {category.name}
                <FontAwesomeIcon icon={faChevronRight} className={`ms-auto text-muted transition ${openCategory === category.id ? "rotate-icon" : ""}`} />
                </div>
        
                {openCategory === category.id && subcategories[category.id] && (
                <ul className="subcategories-list list-group ms-4">
                    {subcategories[category.id].map((subcategory) => (
                    <li key={subcategory.id} className="list-group-item small text-muted" onClick={() => { fetchProducts(subcategory.id, true); setActiveSubcategory(subcategory.id);}}>
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
