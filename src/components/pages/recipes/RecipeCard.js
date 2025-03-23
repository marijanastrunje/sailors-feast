import React from "react";
import { Link } from "react-router-dom"; 
import RecipeTags from "./RecipeTags";
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  const iconMap = {
    "hand": "/img/recipes/hand.svg",
    "oven": "/img/recipes/oven.svg",
    "stove": "/img/recipes/stove.svg"
  };

  // Izračun ukupnog vremena (priprema + kuhanje)
  const totalTime = 
    (parseInt(recipe.acf?.recipe_prep_time) || 0) + 
    (parseInt(recipe.acf?.recipe_cooking_time) || 0);

  return (
    <div className="card">
      <div className="recipe-img">
        <Link to={"/recipes/" + recipe.slug}>
        <img 
          src={recipe._embedded["wp:featuredmedia"]?.[0]?.source_url || "https://placehold.co/600x400?text=No+Image"} 
          alt={recipe.title?.rendered || "Recipe Image"} 
          className="img-fluid" 
        />
        </Link>
      </div>
      
      <div className="card-body p-1 pt-0">

        <div className="recipe-meta py-1 p-sm-1">
          <div className="row">

            <div className="col-8 col-md-8 d-flex align-items-center">
              <span>
                <img src="/img/recipes/time.svg" width="25px" height="25px" alt="Time" />
              </span>
              <time>{totalTime > 0 ? `${totalTime} min` : "N/A"}</time>
            </div>


            <div className="col-4 col-md-4 d-flex justify-content-end">
              {recipe.acf?.recipe_method?.map(method => 
                iconMap[method] ? (
                  <img key={method} src={iconMap[method]} className="me-1" width="25px" height="25px" alt={method} />
                ) : null
              )}
            </div>
          </div>
        </div>


        <div className="recipe-tags py-1 d-flex justify-content-center">
          <RecipeTags recipe={recipe} />
        </div>


        <Link to={"/recipes/" + recipe.slug}>
          <h3 className="recipe-title text-center mb-0">{recipe.title?.rendered || "No Title"}</h3>
        </Link>

        <p className="recipe-description text-center">{recipe.acf?.recipe_description || ""}</p>
      </div>
      <p className="recipe-author ps-1 mb-0">By <b>{recipe._embedded?.author?.[0]?.name || "Sailor's Feast"}</b></p>
    </div>
  );
};

export default RecipeCard;
