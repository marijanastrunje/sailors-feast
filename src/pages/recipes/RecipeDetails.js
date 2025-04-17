import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import RecipeTags from "../recipes/recipe-card/RecipeTags";
import MediaImg from "../../components/common/media/MediaImg";
import BookmarkToggle from "../../components/common/Bookmark";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";

import './RecipeDetails.css'

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RecipeDetails = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [servings, setServings] = useState(0);
  const [originalServings, setOriginalServings] = useState(0);
  const [screenWakeLock, setScreenWakeLock] = useState(null);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Reference za praćenje brojača koraka
  const stepNumbersRef = useRef({});

  useEffect(() => {
    setIsLoading(true);
    fetch(`${backendUrl}/wp-json/wp/v2/recipe?slug=${slug}&_embed`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setRecipe(data[0]);
          // Postavimo početnu vrijednost servings
          if (data[0].acf?.recipe_servings) {
            const initialServings = parseInt(data[0].acf.recipe_servings) || 0;
            setServings(initialServings);
            setOriginalServings(initialServings);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipe:", error);
        setIsLoading(false);
      });
  }, [slug]);

  // Funkcija za rukovanje Wake Lock API-jem
  const handleWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        if (wakeLockActive) {
          // Ako je wake lock aktivan, otpustimo ga
          if (screenWakeLock) {
            await screenWakeLock.release();
          }
          setScreenWakeLock(null);
          setWakeLockActive(false);
        } else {
          // Ako nije aktivan, aktivirajmo ga
          const lock = await navigator.wakeLock.request('screen');
          setScreenWakeLock(lock);
          setWakeLockActive(true);
          
          // Dodajemo handler za slučaj da se wake lock otpusti
          lock.addEventListener('release', () => {
            setWakeLockActive(false);
          });
        }
      } catch (err) {
        console.error('Wake Lock API nije podržan ili je greška:', err);
      }
    } else {
      alert('Wake Lock API nije podržan u vašem pregledniku.');
    }
  };

  //clenup za wakeLock
  useEffect(() => {
    return () => {
      if (screenWakeLock) {
        screenWakeLock.release();
      }
    };
  }, [screenWakeLock]);
  

  // Grupiranje sastojaka po sekcijama
  const getIngredientsBySection = () => {
    if (!recipe?.acf?.recipe_ingredients) return {};
    
    const recipeIngredients = recipe.acf.recipe_ingredients;
    const groupedIngredients = {};
    
    // Prolazimo kroz sve ključeve u recipe_ingredients
    const ingredientNameKeys = Object.keys(recipeIngredients).filter(
      key => key.includes('_name') && !key.includes('section') && recipeIngredients[key]
    );
    
    ingredientNameKeys.forEach(nameKey => {
      const match = nameKey.match(/ingredient_(\d+)_name/);
      if (!match) return;
      
      const index = match[1];
      const name = recipeIngredients[nameKey];
      
      // Preskočimo prazne sastojke
      if (!name) return;
      
      const quantity = recipeIngredients[`ingredient_${index}_quantity`] || '';
      const unit = recipeIngredients[`ingredient_${index}_unit`] || '';
      const section = recipeIngredients[`ingredient_${index}_section_name`] || 'Ostali sastojci';
      
      if (!groupedIngredients[section]) {
        groupedIngredients[section] = [];
      }
      
      groupedIngredients[section].push({
        name,
        quantity,
        unit,
        originalQuantity: quantity // Čuvamo originalnu vrijednost
      });
    });
    
    // Prilagodimo količine sastojaka prema broju porcija
    if (originalServings > 0 && servings !== originalServings) {
      const ratio = servings / originalServings;
      Object.keys(groupedIngredients).forEach(section => {
        groupedIngredients[section].forEach(ing => {
          if (ing.quantity && !isNaN(ing.quantity)) {
            ing.quantity = (parseFloat(ing.quantity) * ratio).toFixed(1).replace(/\.0$/, '');
          }
        });
      });
    }
    
    return groupedIngredients;
  };

  // Grupiranje koraka po sekcijama
  const getStepsBySection = () => {
    if (!recipe?.acf?.recipe_steps) return {};
    
    const recipeSteps = recipe.acf.recipe_steps;
    const groupedSteps = {};
    
    // Prolazimo kroz sve ključeve u recipe_steps
    const stepTextKeys = Object.keys(recipeSteps).filter(
      key => key.includes('_text') && recipeSteps[key]
    );
    
    // Resetirajmo brojače koraka za svaku sekciju
    stepNumbersRef.current = {};
    
    stepTextKeys.forEach(textKey => {
      const match = textKey.match(/step_(\d+)_text/);
      if (!match) return;
      
      const index = match[1];
      const text = recipeSteps[textKey];
      
      // Preskočimo prazne korake
      if (!text) return;
      
      const title = recipeSteps[`step_${index}_title`] || '';
      const section = recipeSteps[`step_${index}_section_name`] || 'Ostali koraci';
      
      if (!groupedSteps[section]) {
        groupedSteps[section] = [];
        // Inicijaliziramo brojač koraka za ovu sekciju
        stepNumbersRef.current[section] = 0;
      }
      
      groupedSteps[section].push({
        text,
        title,
        index: parseInt(index)
      });
    });
    
    // Sortiraj korake unutar svake sekcije prema indeksu
    Object.keys(groupedSteps).forEach(section => {
      groupedSteps[section].sort((a, b) => a.index - b.index);
    });
    
    return groupedSteps;
  };

  const copyInstructions = () => {
    const groupedSteps = getStepsBySection();
    let text = "";
    
    // Za svaku sekciju ispisujemo korake
    Object.entries(groupedSteps).forEach(([section, steps]) => {
      // Dodajemo naslov sekcije ako nije "Ostali koraci"
      if (section !== "Ostali koraci") {
        text += `${section.toUpperCase()}:\n`;
      }
      
      // Dodajemo sve korake u sekciji
      steps.forEach((step, i) => {
        text += `${i + 1}. `;
        if (step.title) {
          text += `${step.title}: `;
        }
        text += `${step.text}\n`;
      });
      
      text += "\n";
    });
    
    navigator.clipboard.writeText(text.trim());
  };

  const copyIngredients = () => {
    const groupedIngredients = getIngredientsBySection();
    let text = "";
    
    // Za svaku sekciju ispisujemo sastojke
    Object.entries(groupedIngredients).forEach(([section, ingredients]) => {
      // Dodajemo naslov sekcije ako nije "Ostali sastojci"
      if (section !== "Ostali sastojci") {
        text += `${section.toUpperCase()}:\n`;
      }
      
      // Dodajemo sve sastojke u sekciji
      ingredients.forEach(ing => {
        text += `${ing.name} ${ing.quantity} ${ing.unit}\n`;
      });
      
      text += "\n";
    });
    
    navigator.clipboard.writeText(text.trim());
  };

  // Funkcije za upravljanje brojem porcija
  const decreaseServings = () => {
    if (servings > 1) {
      setServings(servings - 1);
    }
  };

  const increaseServings = () => {
    setServings(servings + 1);
  };

  const difficultyTerm = recipe?._embedded?.["wp:term"]
    ?.flat()
    ?.find(term => term.taxonomy === "recipe_difficulty");

  const recipeDifficulty = difficultyTerm?.name || "N/A";
  
  const totalTime = (parseInt(recipe?.acf?.recipe_prep_time) || 0) + 
                    (parseInt(recipe?.acf?.recipe_cooking_time) || 0);

  if (isLoading) {
    return (
      <div className="container py-3">
        <div className="text-center">
          <div className="spinner-border text-prim" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container py-3">
        <div className="text-center">
          <h3>Recipe not found</h3>
          <p>Sorry, the requested recipe is not available.</p>
        </div>
      </div>
    );
  }

  // Dohvati grupirane sastojke i korake
  const groupedIngredients = getIngredientsBySection();
  const groupedSteps = getStepsBySection();

  return (
    <div className="container py-2">
      {/* Recipe Header */}
      <div className="text-center mb-4">
        <h1 className="mb-2">{recipe.title.rendered}</h1>
        <div className="d-flex justify-content-center mb-2">
          <RecipeTags recipe={recipe} />
        </div>
        <p>
          By <b>{recipe._embedded?.author?.[0]?.name || "Sailor's Feast"}</b> | {" "}
          {new Date(recipe.date).toLocaleDateString()}
        </p>
      </div>

      <div className="row mb-4">
        {/* Left Column - Image and Info */}
        <div className="col-md-6 mb-4">
          <div className="recipe-details-image position-relative mb-3">
            <MediaImg 
              mediaId={recipe.featured_media} 
              alt={recipe.title.rendered} 
              className="img-fluid rounded"
            />
            <BookmarkToggle itemId={recipe.id} className="bookmark-toggle-details" />
          </div>

          {/* Description details */}
          {recipe.acf?.recipe_description_details && (
            <div>
              <p className="mb-0">{recipe.acf.recipe_description_details}</p>
            </div>
          )}
          
          {/* Keep Screen On Button */}
          <div className="d-block d-md-none d-flex justify-content-end mt-3">
            <button 
              className={`btn btn-sm ${wakeLockActive ? 'btn-success' : 'btn-secondary'}`}
              onClick={handleWakeLock}
              title={wakeLockActive ? "Screen will stay on" : "Click to keep screen on"}
              aria-label={wakeLockActive ? "Deactivate keep screen on" : "Activate keep screen on"}
           >
              {wakeLockActive ? "Screen On" : "Keep Screen On"}
            </button>
          </div>
        </div>

        {/* Right Column - Recipe Details */}
        <div className="col-md-6">
          {/* Time Info Box */}
          <div className="border rounded p-3">
            <h5 className="mb-3">Recipe Information</h5>
            
            {/* Time Info */}
            <div className="row text-center mb-3">
              <div className="col-4 border-end">
                <p className="mb-1 text-secondary">Prep Time</p>
                <p className="fw-bold">{recipe.acf?.recipe_prep_time || 0} mins</p>
              </div>
              <div className="col-4 border-end">
                <p className="mb-1 text-secondary">Cook Time</p>
                <p className="fw-bold">{recipe.acf?.recipe_cooking_time || 0} mins</p>
              </div>
              <div className="col-4">
                <p className="mb-1 text-secondary">Total Time</p>
                <p className="fw-bold">{totalTime} mins</p>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="row text-center">
              <div className="col-4 border-end">
                <p className="mb-0 text-secondary">Servings</p>
                <div className="d-flex justify-content-center align-items-center">
                  <button 
                    className="servings-button text-secondary" 
                    onClick={decreaseServings}
                    disabled={servings <= 1}
                  >-
                  </button>
                  <p className="ms-1 fs-5 fw-bold mb-0 mt-1">{servings}</p>
                  <button 
                    className="servings-button text-secondary" 
                    onClick={increaseServings}
                  >+
                  </button>
                </div>
              </div>
              <div className="col-4 border-end">
                <p className="mb-1 text-secondary">Difficulty</p>
                <p className="fw-bold">{recipeDifficulty}</p>
              </div>
              <div className="col-4">
                <p className="mb-1 text-secondary">Method</p>
                {Array.isArray(recipe.acf?.recipe_method) && recipe.acf.recipe_method.length > 0 ? (
                  <div className="d-flex justify-content-center">
                    {recipe.acf.recipe_method.map((method, index) => (
                      <img
                        key={index}
                        src={`/img/recipes/${method}.svg`}
                        width="24"
                        height="24"
                        alt={method}
                        title={method}
                        className="mx-1"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="fw-bold">N/A</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Ingredients */}
        <div className="col-md-6 mb-4">
          <div className="border rounded p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h4 mb-0">Ingredients</h3>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={copyIngredients}
              >
                Copy
              </button>
            </div>

            {/* Prikazi sastojke po sekcijama */}
            {Object.keys(groupedIngredients).length === 0 ? (
              <p>No ingredients available for this recipe.</p>
            ) : (
              Object.entries(groupedIngredients).map(([section, ingredients]) => (
                <div key={section} className="mb-4">
                  {/* Naslov sekcije (samo ako nije "Ostali sastojci" ili ako ima više sekcija) */}
                  {(section !== "Ostali sastojci" || Object.keys(groupedIngredients).length > 1) && (
                    <h4 className="h5 mt-3 border-bottom pb-2">{section}</h4>
                  )}
                  
                  {/* Lista sastojaka u sekciji */}
                  <ul className="list-group list-group-flush">
                    {ingredients.map((ing, idx) => (
                      <li key={idx} className="list-group-item border-0 px-0 py-2">
                        <div>
                          {ing.name} {ing.quantity} {ing.unit}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="col-md-6 mb-4">
          <div className="border rounded p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h4 mb-0">Instructions</h3>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={copyInstructions}
              >
                Copy
              </button>
            </div>

            {/* Prikazi korake po sekcijama */}
            {Object.keys(groupedSteps).length === 0 ? (
              <p>No instructions available for this recipe.</p>
            ) : (
              Object.entries(groupedSteps).map(([section, steps]) => {
                // Resetiraj brojanje koraka za svaku sekciju
                let sectionStepNumber = 1;
                
                return (
                  <div key={section} className="mb-4">
                    {/* Naslov sekcije (samo ako nije "Ostali koraci" ili ako ima više sekcija) */}
                    {(section !== "Ostali koraci" || Object.keys(groupedSteps).length > 1) && (
                      <h4 className="h5 mt-3 border-bottom pb-2">{section}</h4>
                    )}
                    
                    {/* Lista koraka */}
                    <div className="mt-3">
                      {steps.map((step, idx) => {
                        // Koristimo brojanje koraka od 1 za svaku sekciju
                        const currentStepNumber = sectionStepNumber++;
                        
                        return (
                          <div key={idx} className="mb-4">
                            <div className="d-flex">
                              <div className="me-3">
                                <span className="badge bg-secondary rounded">{currentStepNumber}</span>
                              </div>
                              <div>
                                {step.title && (
                                  <h5 className="h6 mb-1 fw-bold">{step.title}</h5>
                                )}
                                <div>
                                  {step.text}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default RecipeDetails;