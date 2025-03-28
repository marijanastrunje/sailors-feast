import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipeTags from "./RecipeTags";
import MediaImg from "../../media/MediaImg";
import BookmarkToggle from "../all-pages/Bookmark";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

const RecipeDetails = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/recipe?slug=${slug}&_embed`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setRecipe(data[0]);
      })
      .catch(error => console.error("Error fetching recipe:", error));
  }, [slug]);

  const getIngredientList = () => {
    return Object.entries(recipe.acf?.recipe_ingredients || {})
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

  if (!recipe) return <p className="text-center">Loading...</p>;

  return (
    <section id="recipe" className="container py-5">
      <h1 className="text-center m-1">{recipe.title.rendered}</h1>
      <div className="row">
        {/* Glavni sadržaj */}
        <div className="col-md-10">
          <div className="row">
            <div className="col-md-6">
            <div className="position-relative">
              <MediaImg mediaId={recipe.featured_media} alt={recipe.title.rendered} />
              <BookmarkToggle itemId={recipe.id} className="bookmark-toggle-details" />
            </div>
              <p className="blog-author">
                By <b>{recipe._embedded?.author?.[0]?.name || "Sailor's Feast"}</b> |{" "}
                {new Date(recipe.date).toLocaleDateString()}
              </p>
            </div>
            <div className="col-md-6">
              
        
              <RecipeTags recipe={recipe} />

              {/* Vrijeme pripreme, kuhanja i ukupno vrijeme */}
              <div className="row recipe-info mt-3 text-center">
                <div className="col-4 border-end">
                  <p><strong>Prep Time:</strong></p>
                  <p>{recipe.acf?.recipe_prep_time || 0} mins</p>
                </div>
                <div className="col-4 border-end">
                  <p><strong>Cook Time:</strong></p>
                  <p>{recipe.acf?.recipe_cooking_time || 0} mins</p>
                </div>
                <div className="col-4">
                  <p><strong>Total Time:</strong></p>
                  <p>
                    {(parseInt(recipe.acf?.recipe_prep_time) || 0) +
                      (parseInt(recipe.acf?.recipe_cooking_time) || 0)}{" "}
                    mins
                  </p>
                </div>
              </div>

              <div className="row recipe-meta mt-1 text-center">
                {/* Servings */}
                <div className="col border-end">
                  <p className="mb-1"><strong>Servings</strong></p>
                  <p className="mb-0">{recipe.acf?.recipe_servings || "N/A"} persons</p>
                </div>

                {/* Difficulty */}
                <div className="col border-end">
                  <p className="mb-1"><strong>Difficulty</strong></p>
                  <p className="mb-0">{recipeDifficulty}</p>
                </div>

                {/* Cooking Method */}
                <div className="col">
                  {Array.isArray(recipe.acf?.recipe_method) && recipe.acf.recipe_method.length > 0 && (
                    <>
                      <p className="mb-1"><strong>Method</strong></p>
                      <div className="d-flex justify-content-center gap-2">
                        {recipe.acf.recipe_method.map((method, index) => (
                          <img
                            key={index}
                            src={`/img/recipes/${method}.svg`}
                            width="28"
                            height="28"
                            alt={method}
                            title={method}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>  
          </div>

          <p>{recipe.acf?.recipe_description}</p>

          {/* Sastojci */}
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Ingredients</h4>
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

            <ul className="list-group mt-2">
              {getIngredientList().map(({ key, label }) => (
                <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>{label}</div>
                </li>
              ))}
            </ul>
          </div>


          {/* Upute za pripremu */}
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="mb-0">Instructions</h4>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={copyInstructions}
              >
                Copy
              </button>
            </div>

            <ol className="list-group list-group-numbered">
              {Object.entries(recipe.acf?.recipe_steps || {}).map(([key, value]) =>
                key.includes("text") && value ? (
                  <li key={key} className="list-group-item">{value}</li>
                ) : null
              )}
            </ol>
          </div>
        </div>  
      </div>
      <ScrollToTopButton />
    </section>
  );
};

export default RecipeDetails;
