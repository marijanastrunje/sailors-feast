import React, { useEffect, useState, memo, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecipeCard from "../../recipes/recipe-card/RecipeCard";
import RecipeCardSkeleton from "../../recipes/recipe-card/RecipeCardSkeleton"; // Import the skeleton component
import './RecipeBlock.css';

const RecipeBlock = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [visibleIndexes, setVisibleIndexes] = useState({ start: 0, end: 4 });
  
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true); // Set loading to true when fetching starts

    fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://backend.sailorsfeast.com'}/wp-json/wp/v2/recipe?_embed&per_page=10`, { signal })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setRecipes(data);
        setLoading(false); // Set loading to false when data is received
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error("Error fetching recipes:", error);
          setLoading(false); // Also set loading to false on error
        }
      });

    return () => controller.abort();
  }, []);

  const handleBeforeChange = useCallback((oldIndex, newIndex) => {
    // Izračunaj vidljivi raspon baziran na trenutnom slidesToShow
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

  const isCardVisible = useCallback((index) => 
    index >= visibleIndexes.start && index < visibleIndexes.end, 
    [visibleIndexes]
  );
  
  // Renderiranje skeleton kartica tijekom učitavanja
  const renderSkeletons = () => {
    // Kreiraj array od 4 elementa za skeleton kartice
    return [...Array(4)].map((_, index) => (
      <div key={`skeleton-${index}`}>
        <RecipeCardSkeleton />
      </div>
    ));
  };

  // If there are no recipes and not loading, return null
  if (!loading && !recipes.length) return null;

  return (
    <div className="container">
      <div className="row">
        <div className="recepti col-lg-10 mx-auto">
          <Slider {...settings}>
            {loading ? (
              // Prikaži skeleton kartice tijekom učitavanja
              renderSkeletons()
            ) : (
              // Prikaži recepte kad su učitani
              recipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isVisible={isCardVisible(index)}
                />
              ))
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default memo(RecipeBlock);