import React, { useEffect, useState, memo, useCallback } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecipeCard from "../../recipes/recipe-card/RecipeCard";
import RecipeCardSkeleton from "../../recipes/recipe-card/RecipeCardSkeleton";
import './RecipeBlock.css';

const RecipeBlock = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleIndexes, setVisibleIndexes] = useState({ start: 0, end: 4 });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://backend.sailorsfeast.com'}/wp-json/wp/v2/recipe?_embed&per_page=10`, { signal })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error("Error fetching recipes:", error);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handleBeforeChange = useCallback((oldIndex, newIndex) => {
    const width = window.innerWidth;
    let slidesToShow = 4;

    if (width <= 480) slidesToShow = 1.5;
    else if (width <= 768) slidesToShow = 2.3;
    else if (width <= 992) slidesToShow = 3;
    else if (width <= 1200) slidesToShow = 3.5;

    setVisibleIndexes({
      start: newIndex,
      end: newIndex + Math.ceil(slidesToShow)
    });
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 3,
    beforeChange: handleBeforeChange,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3.5, slidesToScroll: 2 } },
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2.3, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1.5, slidesToScroll: 1 } },
    ],
  };

  const isCardVisible = useCallback(
    (index) => index >= visibleIndexes.start && index < visibleIndexes.end,
    [visibleIndexes]
  );

  const renderSkeletons = () => {
    return [...Array(4)].map((_, index) => (
      <div key={`skeleton-${index}`}>
        <RecipeCardSkeleton />
      </div>
    ));
  };

  if (!loading && !recipes.length) return null;

  return (
    <div className="recipe-slider-wrapper container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/recipes">
              <h2 className="mb-0 text-start">Recipes</h2>
            </Link>
            <Link to="/recipes" className="mt-md-1">View more</Link>
          </div>
          <Slider {...settings}>
            {loading
              ? renderSkeletons()
              : recipes.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isVisible={isCardVisible(index)}
                  />
                ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default memo(RecipeBlock);
