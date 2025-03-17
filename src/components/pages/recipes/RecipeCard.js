import React from "react";
import { Link } from "react-router-dom"; 
import RecipeTags from "./RecipeTags";
import MediaImg from "../../media/MediaImg";
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  const iconMap = {
    56: "/img/recipes/hand.svg",
    62: "/img/recipes/oven.svg",
    63: "/img/recipes/stove.svg"
  };

  return (
    <div className="card">
      <div className="recipe-img">
        <Link to={"/recipes/" + recipe.slug}>
          <MediaImg mediaId={recipe.featured_media} alt={recipe.title.rendered} />
        </Link>
      </div>
      <div className="card-body p-2 pt-0">
        <div className="recipe-meta py-1">
          <div className="row">
            <div className="col-8 col-md-8 d-flex">
              <span>
                <img src="/img/recipes/time.svg" width="20px" height="20px" alt="Time" />
              </span>
              <time>{recipe.time} min</time>
            </div>
            <div className="col-4 col-md-4 d-flex justify-content-end">
              {recipe.icon?.map(iconId => 
                iconMap[iconId] ? (
                  <img key={iconId} src={iconMap[iconId]} className="me-1" width="24px" height="24px" alt={"Icon" + iconId} />
                ) : null
              )}
            </div>
          </div>
        </div>
        <div className="recipe-tags pb-1 d-flex justify-content-center">
          <RecipeTags postID={recipe.id} />
        </div>
        <Link to={"/recipes/" + recipe.slug}>
          <h3 className="recipe-title text-center mb-0">{recipe.title?.rendered || "No Title"}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{ __html: recipe.excerpt?.rendered?.slice(0, 40) || "" }} />
      </div>
    </div>
  );
};

export default RecipeCard;
