import React from "react";
import RecipeCard from "../../recipes/recipe-card/RecipeCard"

const SavedRecipes = ({ savedRecipeData, setSavedRecipeData }) => {
  if (!savedRecipeData || savedRecipeData.length === 0) {
    return <p className="text-center">You have no saved recipes.</p>;
  }

  return (
    <div className="col-md-10 mx-auto">
      <div className="row" role="list">
        {savedRecipeData.map((recipe) => (
          <div key={recipe.id} className="col-12 col-md-6 col-lg-3 mb-3" role="listitem">
            <RecipeCard
              recipe={recipe}
              onUnsave={(id) =>
                setSavedRecipeData((prev) => prev.filter((r) => r.id !== id))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedRecipes;
