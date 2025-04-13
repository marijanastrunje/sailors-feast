import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipeTags from "../recipes/recipe-card/RecipeTags";
import MediaImg from "../all-pages/media/MediaImg";
import BookmarkToggle from "../all-pages/Bookmark";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RecipeDetails = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${backendUrl}/wp-json/wp/v2/recipe?slug=${slug}&_embed`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setRecipe(data[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipe:", error);
        setIsLoading(false);
      });
  }, [slug]);

  const getIngredientList = () => {
    if (!recipe || !recipe.acf?.recipe_ingredients) return [];
    
    return Object.entries(recipe.acf.recipe_ingredients)
      .filter(([key, value]) => key.includes("name") && value)
      .map(([key, value]) => {
        const i = key.match(/\d+/)?.[0];
        const quantity = recipe.acf.recipe_ingredients[`ingredient_${i}_quantity`] || "";
        const unit = recipe.acf.recipe_ingredients[`ingredient_${i}_unit`] || "";
        return {
          key,
          label: `${value} ${quantity} ${unit}`.trim()
        };
      });
  };

  const copyInstructions = () => {
    const steps = recipe.acf?.recipe_steps || {};
    const text = Object.entries(steps)
      .filter(([key, value]) => key.includes("text") && value)
      .map(([_, value], i) => `${i + 1}. ${value}`)
      .join("\n");
  
    navigator.clipboard.writeText(text);
  };

  const difficultyTerm = recipe?._embedded?.["wp:term"]
    ?.flat()
    ?.find(term => term.taxonomy === "recipe_difficulty");

  const recipeDifficulty = difficultyTerm?.name || "N/A";
  
  const totalTime = (parseInt(recipe?.acf?.recipe_prep_time) || 0) + 
                    (parseInt(recipe?.acf?.recipe_cooking_time) || 0);

  if (isLoading) {
    return (
      <div className="container py-3">
        <div className="text-center">
          <p>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container py-3">
        <div className="text-center">
          <h3>Recipe not found</h3>
          <p>Sorry, the requested recipe is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-2">
      {/* Recipe Header */}
      <div className="text-center mb-4">
        <h1 className="mb-2">{recipe.title.rendered}</h1>
        <div className="d-flex justify-content-center mb-2">
          <RecipeTags recipe={recipe} />
        </div>
        <p>
          By <b>{recipe._embedded?.author?.[0]?.name || "Sailor's Feast"}</b> | {" "}
          {new Date(recipe.date).toLocaleDateString()}
        </p>
      </div>

      <div className="row mb-4">
        {/* Left Column - Image and Info */}
        <div className="col-md-6 mb-4">
          <div className="position-relative mb-3">
            <MediaImg 
              mediaId={recipe.featured_media} 
              alt={recipe.title.rendered} 
              className="img-fluid rounded"
            />
            <BookmarkToggle itemId={recipe.id} className="bookmark-toggle-details" />
          </div>

          {/* Description */}
          {recipe.acf?.recipe_description && (
            <div>
              <p className="mb-0">{recipe.acf.recipe_description}</p>
            </div>
          )}
        </div>

        

        {/* Right Column - Recipe Details */}
        <div className="col-md-6">
          {/* Time Info Box */}
          <div className="border rounded p-3">
            <h5 className="mb-3">Recipe Information</h5>
            
            {/* Time Info */}
            <div className="row text-center mb-3">
              <div className="col-4 border-end">
                <p className="mb-1 text-secondary">Prep Time</p>
                <p className="fw-bold">{recipe.acf?.recipe_prep_time || 0} mins</p>
              </div>
              <div className="col-4 border-end">
                <p className="mb-1 text-secondary">Cook Time</p>
                <p className="fw-bold">{recipe.acf?.recipe_cooking_time || 0} mins</p>
              </div>
              <div className="col-4">
                <p className="mb-1 text-secondary">Total Time</p>
                <p className="fw-bold">{totalTime} mins</p>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="row text-center">
              <div className="col-4 border-end">
                <p className="mb-1 text-secondary">Servings</p>
                <p className="fw-bold">{recipe.acf?.recipe_servings || "N/A"}</p>
              </div>
              <div className="col-4 border-end">
                <p className="mb-1 text-secondary">Difficulty</p>
                <p className="fw-bold">{recipeDifficulty}</p>
              </div>
              <div className="col-4">
                <p className="mb-1 text-secondary">Method</p>
                {Array.isArray(recipe.acf?.recipe_method) && recipe.acf.recipe_method.length > 0 ? (
                  <div className="d-flex justify-content-center">
                    {recipe.acf.recipe_method.map((method, index) => (
                      <img
                        key={index}
                        src={`/img/recipes/${method}.svg`}
                        width="24"
                        height="24"
                        alt={method}
                        title={method}
                        className="mx-1"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="fw-bold">N/A</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Ingredients */}
        <div className="col-md-6 mb-4">
          <div className="border rounded p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h4 mb-0">Ingredients</h3>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  const text = getIngredientList().map(ing => ing.label).join("\n");
                  navigator.clipboard.writeText(text);
                }}
              >
                Copy all
              </button>
            </div>

            <ul className="list-group list-group-flush">
              {getIngredientList().map(({ key, label }) => (
                <li key={key} className="list-group-item border-0 px-0 py-2">
                  <div>{label}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="col-md-6 mb-4">
          <div className="border rounded p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h4 mb-0">Instructions</h3>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={copyInstructions}
              >
                Copy
              </button>
            </div>

            <ol className="list-group list-group-numbered ps-3">
              {Object.entries(recipe.acf?.recipe_steps || {})
                .filter(([key, value]) => key.includes("text") && value)
                .map(([key, value], index) => (
                  <li key={key} className="py-2">
                    {value}
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default RecipeDetails;