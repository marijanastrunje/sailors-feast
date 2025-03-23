import React from "react";
import "./RecipeTags.css";

const taxonomyMap = {
  recipe_type: "type",
  recipe_diet: "diet",
  recipe_main_ingredient: "ingredient",
  recipe_difficulty: "difficulty",
};

const RecipeTags = ({ recipe }) => {
  const terms = recipe?._embedded?.["wp:term"] || [];

  return (
    <div className="recipe-tags pb-1 d-flex justify-content-center flex-wrap">
      {terms.map((termGroup) =>
        termGroup.map((term) => {
          const className = taxonomyMap[term.taxonomy];
          if (!className) return null;

          return (
            <span key={term.id} className={`${className} me-1`}>
              {term.name}
            </span>
          );
        })
      )}
    </div>
  );
};

export default RecipeTags;
