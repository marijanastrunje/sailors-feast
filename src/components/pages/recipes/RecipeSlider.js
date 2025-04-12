import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecipeCard from "./recipe-card/RecipeCard";
import RecipeCardSkeleton from "./recipe-card/RecipeCardSkeleton";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RecipeSlider = ({ categoryId, onLoadingChange }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    if (onLoadingChange) onLoadingChange(true);

    fetch(`${backendUrl || 'https://backend.sailorsfeast.com'}/wp-json/wp/v2/recipe?recipe_categories=${categoryId}&_embed`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (isMounted) {
          setRecipes(data);
          setLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error("Error fetching recipes:", error);
          setLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [categoryId, onLoadingChange]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3.5, slidesToScroll: 2 } },
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2.3, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1.5, slidesToScroll: 1 } },
    ],
  };

  // Renderiranje skeleton kartica tijekom učitavanja
  const renderSkeletons = () => {
    // Kreiraj array od 4 elementa za skeleton kartice
    return [...Array(4)].map((_, index) => (
      <div key={`skeleton-${index}`}>
        <RecipeCardSkeleton />
      </div>
    ));
  };

  return (
    <Slider {...settings}>
      {loading ? (
        // Prikaži skeleton kartice tijekom učitavanja
        renderSkeletons()
      ) : recipes.length > 0 ? (
        // Prikaži recepte kad su učitani
        recipes.map(recipe => (
          <div key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </div>
        ))
      ) : (
        // Poruka ako nema recepata
        <div className="text-center py-4">No recipes found.</div>
      )}
    </Slider>
  );
};

export default RecipeSlider;