import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecipeCard from "../../pages/recipes/RecipeCard";
import './RecipeBlock.css';

const RecipeBlock = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/recipe?_embed&per_page=10`)
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

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

  return (
    <div className="container">
      <div className="row">
        <div className="recepti col-lg-10 mx-auto">
        {recipes.length > 0 && (
          <Slider {...settings}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </Slider>
        )}
        </div>
      </div>
    </div>
  );
};

export default RecipeBlock;
