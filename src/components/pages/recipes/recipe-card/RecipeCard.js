import React, { useState, useRef, useEffect } from "react"; 
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import BookmarkToggle from "../../all-pages/Bookmark";
import RecipeTags from "./RecipeTags";
import './RecipeCard.css';

const RecipeCard = ({ recipe, onUnsave }) => {

  const iconMap = {
    "hand": "/img/recipes/hand.svg",
    "oven": "/img/recipes/oven.svg",
    "stove": "/img/recipes/stove.svg"
  };

  const [showTags, setShowTags] = useState(false); // state za prikaz
  const tagsRef = useRef(); // referenca za detekciju klika izvan

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // prag za mobilno
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagsRef.current && !tagsRef.current.contains(event.target)) {
        setShowTags(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

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
          />
        </Link>
        <BookmarkToggle itemId={recipe.id} className="bookmark-toggle-card" onChange={(action) => {if (action === "removed") {onUnsave?.(recipe.id);}}} />

      </div>
      
      <div className="card-body p-1 pt-0">

        <div className="recipe-meta py-1 p-sm-1 pb-0 pb-sm-0">
          <div className="row">

            <div className="col-7 d-flex align-items-center">
              <span>
                <img src="/img/recipes/time.svg" width="25px" height="25px" alt="Time" />
              </span>
              <time>{totalTime > 0 ? `${totalTime} min` : "N/A"}</time>
            </div>

            <div className="col-5 d-flex justify-content-end align-items-center">
              {recipe.acf?.recipe_method?.map(method => 
                iconMap[method] ? (
                  <img key={method} src={iconMap[method]} className="me-1" width="25px" height="25px" alt={method} />
                ) : null
              )}
              <div
                className={`recipe-tags-wrapper position-relative ${!isMobile ? 'hover-enabled' : ''}`}
                ref={tagsRef}
              >
                <span
                  className="info-toggle"
                  title="Pogledaj detalje"
                  onClick={() => isMobile && setShowTags(prev => !prev)}
                >
                  <FontAwesomeIcon icon={faInfo} className="infoIcon" />
                </span>

                {(isMobile ? showTags : true) && (
                  <div className="recipe-tags-hidden">
                    <RecipeTags recipe={recipe} />
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        <Link to={"/recipes/" + recipe.slug}>
          <h3 className="recipe-title text-center my-1">{recipe.title?.rendered || "No Title"}</h3>
        </Link>

        <p className="recipe-description text-center">{recipe.acf?.recipe_description || ""}</p>
      </div>
      <p className="recipe-author ps-1 mb-0">By <b>{recipe._embedded?.author?.[0]?.name || "Sailor's Feast"}</b></p>
    </div>
  );
};

export default RecipeCard;
