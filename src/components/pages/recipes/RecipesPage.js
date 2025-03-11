import React from "react";
import RecipeSlider from "./RecipeSlider";

const RecipesPage = () => {

  return (
    <div className="container recipes-page">
      <h1 className="text-center my-4">Our Recipes</h1>
      <RecipeSlider />
    </div>
  );
};

export default RecipesPage;
