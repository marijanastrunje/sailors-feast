import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecipeCard from "./RecipeCard";

const RecipeSlider = () => {

  const [recipes, setRecipes] = useState([]);
   
    useEffect(() => {
    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/posts?categories=65,66,73,74")
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
            })
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    const settings = {
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 3,
      responsive: [
        { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 2 } },
        { breakpoint: 600, settings: { slidesToShow: 3, slidesToScroll: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      ],
    };

    return (
        <>
        <Slider {...settings}>
            {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </Slider>    
        </>
    );
};

export default RecipeSlider;
