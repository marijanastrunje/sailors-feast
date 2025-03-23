import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecipeCard from "../recipes/RecipeCard";

const RecipeBoxSlider = ({ categoryId, title }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/recipe?recipe_categories=${categoryId}&per_page=5`)
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error("Error fetching recipes:", error));
  }, [categoryId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1, // Prikazuje samo 1 recept u slideru
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 15000, // Automatski mijenja svakih 4 sekunde
  };

  return (
    <div className="recipe-slider mt-4">
      <h4 className="text-center">{title}</h4>
      <Slider {...settings}>
        {recipes.length > 0 ? (
          recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)
        ) : (
          <p className="text-center">No recipes found</p>
        )}
      </Slider>
    </div>
  );
};

export default RecipeBoxSlider;
