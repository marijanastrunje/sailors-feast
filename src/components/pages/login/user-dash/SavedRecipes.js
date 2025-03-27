import React from "react";
import RecipeCard from "../../recipes/RecipeCard";

const SavedRecipes = ({ savedRecipeData, setSavedRecipeData }) => {
  if (!savedRecipeData || savedRecipeData.length === 0) {
    return <p>Nemate spremljenih recepata.</p>;
  }

  return (
    <div className="col-md-10 mx-auto">
        <div className="row">
        {savedRecipeData.map((recipe) => (
            <div key={recipe.id} className="col-12 col-md-6 col-lg-3 mb-3">
            <RecipeCard recipe={recipe} onUnsave={(id) => setSavedRecipeData(prev => prev.filter(r => r.id !== id))}/>
            </div>
        ))}
        </div>
    </div>
  );
};

export default SavedRecipes;
