import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSpoon, faSlidersH, faClock } from "@fortawesome/free-solid-svg-icons";
import RecipeCard from "./recipe-card/RecipeCard";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";
import RecipeSlider from "./RecipeSlider";
import Pagination from "../all-pages/Pagination";
import Select from "react-select";
import './RecipesPage.css'

const STORAGE_KEY = 'recipes_page_state';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const taxonomyFilters = {
  recipe_type: "Type",
  recipe_diet: "Diet",
  recipe_main_ingredient: "Main Ingredient",
  recipe_difficulty: "Difficulty",
};

const cookingTimeOptions = [
  { value: "under_15", label: "< 15 mins" },
  { value: "under_30", label: "< 30 mins" },
  { value: "under_60", label: "< 60 mins" },
  { value: "over_60", label: "60+ mins" },
];

const methodOptions = [
  { value: "stove", label: "Stove", icon: "/img/recipes/stove.svg" },
  { value: "oven", label: "Oven", icon: "/img/recipes/oven.svg" },
  { value: "hand", label: "No cook", icon: "/img/recipes/hand.svg" },
];

const categories = [
  { id: 144, name: "Breakfast" },
  { id: 145, name: "Lunch" },
  { id: 146, name: "Dinner" },
];

const RecipesPage = () => {
  // Refs for dropdowns
  const timeRef = useRef(null);
  const methodRef = useRef(null);
  const detailsRef = useRef(null);
  
  // Ref za praćenje trenutne stranice
  const currentPageRef = useRef(1);

  // Load saved state from localStorage
  const loadSavedState = () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return null;
  };

  const initialState = loadSavedState() || {
    filters: {},
    selectedOptions: {},
    cookingTime: [],
    cookingMethod: [],
    currentPage: 1
  };

  // State variables
  const [recipes, setRecipes] = useState([]);
  const [terms, setTerms] = useState({});
  const [filters, setFilters] = useState(initialState.filters);
  const [selectedOptions, setSelectedOptions] = useState(initialState.selectedOptions);
  const [cookingTime, setCookingTime] = useState(initialState.cookingTime);
  const [cookingMethod, setCookingMethod] = useState(initialState.cookingMethod);
  const [currentPage, setCurrentPage] = useState(initialState.currentPage);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showDetailsDropdown, setShowDetailsDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Derived state with useMemo
  const isFiltering = useMemo(() => (
    Object.values(filters).some((val) => val?.length > 0) ||
    cookingTime.length > 0 ||
    cookingMethod.length > 0
  ), [filters, cookingTime, cookingMethod]);

  const itemsPerPage = 12;
  
  const currentRecipes = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return recipes.slice(indexOfFirstItem, indexOfLastItem);
  }, [recipes, currentPage]);

  const totalPages = useMemo(() => Math.ceil(recipes.length / itemsPerPage), [recipes.length]);

  // Ažuriranje ref kad se promijeni stranica
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      filters,
      selectedOptions,
      cookingTime,
      cookingMethod,
      currentPage
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [filters, selectedOptions, cookingTime, cookingMethod, currentPage]);

  // Fetch taxonomy terms once on component mount
  useEffect(() => {
    const fetchTerms = async () => {
      const cachedTerms = localStorage.getItem('recipe_taxonomy_terms');
      
      if (cachedTerms) {
        setTerms(JSON.parse(cachedTerms));
      } else {
        const termsData = {};
        
        for (const taxonomy of Object.keys(taxonomyFilters)) {
          try {
            const response = await fetch(`${backendUrl}/wp-json/wp/v2/${taxonomy}?per_page=100`);
            const data = await response.json();
            termsData[taxonomy] = data;
          } catch (error) {
            console.error(`Error fetching ${taxonomy}:`, error);
            termsData[taxonomy] = [];
          }
        }
        
        setTerms(termsData);
        localStorage.setItem('recipe_taxonomy_terms', JSON.stringify(termsData));
      }
    };

    fetchTerms();
  }, []);

  // Fetch recipes when filters change
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchRecipes = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      
      try {
        const taxQuery = Object.entries(filters)
          .filter(([_, values]) => values?.length > 0)
          .map(([key, values]) => values.map((val) => `${key}[]=${val}`).join("&"))
          .join("&");

        const url = `${backendUrl}/wp-json/wp/v2/recipe?_embed&per_page=100${taxQuery ? `&${taxQuery}` : ""}`;
        
        const response = await fetch(url, { signal });
        let data = await response.json();
        
        // Apply client-side filters
        if (cookingTime.length > 0) {
          data = data.filter((r) => {
            const prep = parseInt(r.acf?.recipe_prep_time) || 0;
            const cook = parseInt(r.acf?.recipe_cooking_time) || 0;
            const total = prep + cook;
        
            return cookingTime.some((time) => {
              if (time === "under_15") return total < 15;
              if (time === "under_30") return total < 30;
              if (time === "under_60") return total < 60;
              if (time === "over_60") return total >= 60;
              return false;
            });
          });
        }
        
        if (cookingMethod.length > 0) {
          data = data.filter((r) =>
            Array.isArray(r.acf?.recipe_method) &&
            cookingMethod.some((method) => r.acf.recipe_method.includes(method))
          );
        }
        
        if (isMounted) {
          setRecipes(data);
          
          // Reset to first page when filters change
          if (currentPageRef.current !== 1) {
            setCurrentPage(1);
          }
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        if (isMounted) {
          setRecipes([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRecipes();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [filters, cookingTime, cookingMethod]); // Removed currentPage dependency

  // Dropdown toggle handlers
  const toggleTimeDropdown = useCallback(() => {
    setShowTimeDropdown(prev => !prev);
    setShowMethodDropdown(false);
    setShowDetailsDropdown(false);
  }, []);
  
  const toggleMethodDropdown = useCallback(() => {
    setShowMethodDropdown(prev => !prev);
    setShowTimeDropdown(false);
    setShowDetailsDropdown(false);
  }, []);
  
  const toggleDetailsDropdown = useCallback(() => {
    setShowDetailsDropdown(prev => !prev);
    setShowTimeDropdown(false);
    setShowMethodDropdown(false);
  }, []);

  // Filter selection handlers
  const handleTimeSelect = useCallback((value) => {
    setCookingTime(prev =>
      prev.includes(value)
        ? prev.filter(t => t !== value)
        : [...prev, value]
    );
  }, []);

  const handleMethodSelect = useCallback((value) => {
    setCookingMethod(prev => 
      prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
    );
  }, []);

  const handleMultiSelectChange = useCallback((taxonomy, selected) => {
    setSelectedOptions(prev => ({ ...prev, [taxonomy]: selected }));
    setFilters(prev => ({ ...prev, [taxonomy]: selected.map(opt => opt.value) }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setSelectedOptions({});
    setCookingTime([]);
    setCookingMethod([]);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        timeRef.current && !timeRef.current.contains(event.target) &&
        methodRef.current && !methodRef.current.contains(event.target) &&
        detailsRef.current && !detailsRef.current.contains(event.target)
      ) {
        setShowTimeDropdown(false);
        setShowMethodDropdown(false);
        setShowDetailsDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render active filter badges
  const renderActiveFilters = useMemo(() => {
    if (!(Object.entries(selectedOptions).some(([_, opts]) => opts?.length > 0) ||
          cookingTime.length > 0 || 
          cookingMethod.length > 0)) {
      return null;
    }

    return (
      <div className="col-10 col-md-8 mx-auto mb-4">
        <div className="d-flex align-items-center justify-content-between p-3">
          <h6>Active Filters:</h6>
          {(Object.values(filters).some((val) => val?.length > 0) || cookingTime.length > 0 || cookingMethod.length > 0) && (
            <button className="btn btn-secondary btn-sm ms-3" onClick={resetFilters}>
              Reset filters
            </button>
          )}
        </div>
        <div className="d-flex flex-wrap gap-2">
          {/* Taxonomies */}
          {Object.entries(selectedOptions).map(([taxonomy, options]) =>
            options.map((item) => (
              <span key={`${taxonomy}-${item.value}`} className="badge bg-primary d-flex align-items-center">
                {item.label}
                <button
                  type="button"
                  className="btn-close btn-close-white btn-sm ms-2"
                  aria-label="Remove"
                  onClick={() =>
                    handleMultiSelectChange(
                      taxonomy,
                      options.filter((i) => i.value !== item.value)
                    )
                  }
                  style={{ fontSize: "0.6rem" }}
                />
              </span>
            ))
          )}

          {/* Cooking Time */}
          {cookingTime.map((time) => (
            <span key={time} className="badge bg-success d-flex align-items-center">
              {cookingTimeOptions.find((opt) => opt.value === time)?.label}
              <button
                type="button"
                className="btn-close btn-close-white btn-sm ms-2"
                aria-label="Remove"
                onClick={() => setCookingTime(prev => prev.filter(t => t !== time))}
                style={{ fontSize: "0.6rem" }}
              />
            </span>
          ))}

          {/* Cooking Methods */}
          {cookingMethod.map((method) => {
            const option = methodOptions.find((opt) => opt.value === method);
            return (
              <span key={method} className="badge bg-info d-flex align-items-center">
                {option?.label || method}
                <button
                  type="button"
                  className="btn-close btn-close-white btn-sm ms-2"
                  aria-label="Remove"
                  onClick={() => setCookingMethod(prev => prev.filter(m => m !== method))}
                  style={{ fontSize: "0.6rem" }}
                />
              </span>
            );
          })}
        </div>
      </div>
    );
  }, [selectedOptions, cookingTime, cookingMethod, filters, resetFilters, handleMultiSelectChange]);

  return (
    <section id="recipes" className="container py-2">
      <h1 className="text-center mb-4">All Recipes</h1>

      <div className="container d-flex justify-content-center">
        {/* Vrijeme dropdown */}
        <div ref={timeRef} className="position-relative">
          <div className="position-relative">
            <button
              className={`btn btn-lg btn-outline-secondary me-2 rounded-pill d-flex align-items-center gap-2 ${cookingTime.length > 0 ? "btn-prim text-white" : "btn-outline-secondary"}`}
              onClick={toggleTimeDropdown}
            >
              <FontAwesomeIcon icon={faClock} />
              <span className="d-none d-sm-block">Time</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transition-icon ${showTimeDropdown ? "rotate" : ""}`}
              />
            </button>

            {showTimeDropdown && (
              <div className="dropdown-menu show p-2 mt-1" style={{ display: "block" }}>
                {cookingTimeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`dropdown-item ${cookingTime.includes(opt.value) ? "active" : ""}`}
                    onClick={() => handleTimeSelect(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>  

        {/* Method */}
        <div ref={methodRef} className="position-relative">
          <div className="position-relative">
            <button
              className={`btn btn-lg rounded-pill me-2 d-flex align-items-center gap-2 ${cookingMethod.length > 0 ? "btn-prim text-white" : "btn-outline-secondary"}`}
              onClick={toggleMethodDropdown}
            >
              <FontAwesomeIcon icon={faSpoon} />
              <span className="d-none d-sm-block">Method</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transition-icon ${showMethodDropdown ? "rotate" : ""}`}
              />
            </button>

            {showMethodDropdown && (
              <div className="dropdown-menu show p-2 mt-1" style={{ display: "block" }}>
                {methodOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`dropdown-item d-flex align-items-center gap-2 ${cookingMethod.includes(opt.value) ? "active" : ""}`}
                    onClick={() => handleMethodSelect(opt.value)}
                  >
                    <img src={opt.icon} alt={opt.label} width={20} height={20} />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div ref={detailsRef} className="position-relative">
          <div className="position-relative">
            <button
              className={`btn btn-lg rounded-pill d-flex align-items-center gap-2 ${Object.values(selectedOptions).some(opts => opts?.length > 0) ? "btn-prim text-white" : "btn-outline-secondary"}`}
              onClick={toggleDetailsDropdown}
            >
              <FontAwesomeIcon icon={faSlidersH} />
              <span className="d-none d-sm-block">Detail</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transition-icon ${showDetailsDropdown ? "rotate" : ""}`}
              />
            </button>

            {showDetailsDropdown && (
              <div className="dropdown-menu show p-3 mt-1" style={{ display: "block", minWidth: "300px" }} onClick={(e) => e.stopPropagation()}>
                {Object.entries(taxonomyFilters).map(([taxonomy, label]) => (
                  <div key={taxonomy} className="col mb-3">
                    <label className="form-label fw-semibold">{label}</label>
                    <Select
                      isMulti
                      isSearchable={false}
                      options={terms[taxonomy]?.map((term) => ({ value: term.id, label: term.name }))}
                      value={selectedOptions[taxonomy] || []}
                      onChange={(selected) => handleMultiSelectChange(taxonomy, selected)}
                      placeholder={`Select ${label}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active filters */}
      {renderActiveFilters}

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Results */}
      {!isLoading && (
        <>
          {isFiltering ? (
            <div className="col-md-10 mx-auto">
              <div className="row recipes-results">
                {currentRecipes.length > 0 ? (
                  <>
                    {currentRecipes.map((recipe) => (
                      <div key={recipe.id} className="col-6 col-md-4 col-lg-3 mb-4 p-0">
                        <RecipeCard recipe={recipe} />
                      </div>
                    ))}
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center my-5">
                    <p>No recipes found matching your filters.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-center pt-3 my-3">Popular by Category</h2>
              {categories.map((category) => (
                <div key={category.id} className="mb-5 col-lg-10 mx-auto">
                  <h3 className="text-center p-3">{category.name}</h3>
                  <RecipeSlider categoryId={category.id} />
                </div>
              ))}
            </>
          )}
        </>
      )}
      <ScrollToTopButton />
    </section>
  );
};

export default RecipesPage;