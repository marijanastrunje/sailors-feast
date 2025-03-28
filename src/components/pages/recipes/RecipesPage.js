import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import RecipeCard from "./RecipeCard";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";
import RecipeSlider from "./RecipeSlider";
import Pagination from "../all-pages/Pagination";
import Select from "react-select";
import './Recipe.css'

const taxonomyFilters = {
  recipe_type: "Type",
  recipe_diet: "Diet",
  recipe_main_ingredient: "Main Ingredient",
  recipe_difficulty: "Difficulty",
};

const RecipesPage = () => {


  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({});
  const [terms, setTerms] = useState({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [cookingTime, setCookingTime] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [cookingMethod, setCookingMethod] = useState([]);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showDetailsDropdown, setShowDetailsDropdown] = useState(false);

  const categories = [
    { id: 144, name: "Breakfast" },
    { id: 145, name: "Lunch" },
    { id: 146, name: "Dinner" },
  ];

  const cookingTimeOptions = [
    { value: "under_15", label: "< 15 mins" },
    { value: "under_30", label: "< 30 mins" },
    { value: "under_60", label: "< 60 mins" },
    { value: "over_60", label: "60+ mins" },
  ];

  
  const handleTimeSelect = (value) => {
    setCookingTime(prev =>
      prev.includes(value)
        ? prev.filter(t => t !== value)
        : [...prev, value]
    );
  };
    

  const methodOptions = [
    { value: "stove", label: "Stove", icon: "/img/recipes/stove.svg" },
    { value: "oven", label: "Oven", icon: "/img/recipes/oven.svg" },
    { value: "hand", label: "No cook", icon: "/img/recipes/hand.svg" },
  ];

  const toggleTimeDropdown = () => {
    setShowTimeDropdown(prev => !prev);
    setShowMethodDropdown(false);
    setShowDetailsDropdown(false);
  };
  const toggleMethodDropdown = () => {
    setShowMethodDropdown(prev => !prev);
    setShowTimeDropdown(false);
    setShowDetailsDropdown(false);
  }; 
  const handleMethodSelect = (value) => {
    setCookingMethod(prev => 
      prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
    );
  };
  
  const toggleDetailsDropdown = () => {
    setShowDetailsDropdown(prev => !prev);
    setShowTimeDropdown(false);
    setShowMethodDropdown(false);
  }; 
  
  const timeRef = useRef(null);
  const methodRef = useRef(null);
  const detailsRef = useRef(null);

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
  
  useEffect(() => {
    Object.keys(taxonomyFilters).forEach((taxonomy) => {
      fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/${taxonomy}?per_page=100`)
        .then((res) => res.json())
        .then((data) => {
          setTerms((prev) => ({ ...prev, [taxonomy]: data }));
        });
    });
  }, []);

  useEffect(() => {
    const taxQuery = Object.entries(filters)
      .filter(([_, values]) => values?.length > 0)
      .map(([key, values]) => values.map((val) => `${key}[]=${val}`).join("&"))
      .join("&");

    const url = `https://backend.sailorsfeast.com/wp-json/wp/v2/recipe?_embed&per_page=100${taxQuery ? `&${taxQuery}` : ""}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let filtered = [...data];

        if (cookingTime.length > 0) {
          filtered = filtered.filter((r) => {
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
          filtered = filtered.filter((r) =>
            Array.isArray(r.acf?.recipe_method) &&
            cookingMethod.some((method) => r.acf.recipe_method.includes(method))
          );
        }

        setRecipes(filtered);
      });

      setIsFiltering(
        Object.values(filters).some((val) => val?.length > 0) ||
        cookingTime.length > 0 ||
        cookingMethod.length > 0
      );           
  }, [filters, cookingTime, cookingMethod]);

  const handleMultiSelectChange = (taxonomy, selected) => {
    setSelectedOptions((prev) => ({ ...prev, [taxonomy]: selected }));
    setFilters((prev) => ({ ...prev, [taxonomy]: selected.map((opt) => opt.value) }));
  };

  const resetFilters = () => {
    setFilters({});
    setSelectedOptions({});
    setCookingTime([]);
    setCookingMethod([]);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="recipes" className="container py-2">
      <h1 className="text-center mb-4">All Recipes</h1>

      <div className="container d-flex justify-content-center">

        {/* Vrijeme dropdown */}
        <div ref={timeRef} className="position-relative">
          <div className="position-relative">
            <button
              className={`btn btn-outline-secondary rounded-pill d-flex align-items-center gap-2 ${cookingTime.length > 0 ? "btn-prim text-white" : "btn-outline-secondary"}`}
              onClick={toggleTimeDropdown}
            >
              <img src="/img/recipes/time.svg" alt="Time" width={25} />
              <span className="d-none d-sm-block">Vrijeme</span>
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
              className={`btn rounded-pill d-flex align-items-center gap-2 ${cookingMethod.length > 0 ? "btn-prim text-white" : "btn-outline-secondary"}`}
              onClick={toggleMethodDropdown}
            >
              <img src="/img/recipes/time.svg" alt="Time" width={25} />
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
              className={`btn rounded-pill d-flex align-items-center gap-2 ${Object.values(selectedOptions).some(opts => opts?.length > 0) ? "btn-prim text-white" : "btn-outline-secondary"}`}
              onClick={toggleDetailsDropdown}
            >
              <img src="/img/recipes/time.svg" alt="Details" width={25} />
              <span className="d-none d-sm-block">Detaljno</span>
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
      {(
        Object.entries(selectedOptions).some(([_, opts]) => opts?.length > 0) ||
        cookingTime.length > 0 || 
        cookingMethod.length > 0
      ) && (
        <div className="col-3 offset-1 mb-4">
          <div className="d-flex">
            <h6>Active Filters:</h6>
            {(Object.values(filters).some((val) => val?.length > 0) || cookingTime || cookingMethod.length > 0) && (
              <button className="btn btn-outline-secondary btn-sm ms-3" onClick={resetFilters}>
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
              const label = methodOptions.find((opt) => opt.value === method)?.label;
              return (
                <span key={method} className="badge bg-info d-flex align-items-center">
                  {typeof label === "string" ? label : method}
                  <button
                    type="button"
                    className="btn-close btn-close-white btn-sm ms-2"
                    aria-label="Remove"
                    onClick={() => {
                      setCookingMethod((prev) => prev.filter((m) => m !== method));
                    }}
                    style={{ fontSize: "0.6rem" }}
                  />
                </span>
              );
            })}

          </div>
        </div>
      )}


      {/* Results */}
      {isFiltering ? (
        <div className="col-md-10 mx-auto">
          <div className="row recipes-results">
          {currentRecipes.map((recipe) => (
            <div key={recipe.id} className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4 p-0">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
          {recipes.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(recipes.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
          </div>
        </div>

      ) : (
        <>
          <h2 className="text-center my-3">Popular by Category</h2>
          {categories.map((category) => (
            <div key={category.id} className="mb-5 col-lg-10 mx-auto">
              <h3 className="text-center">{category.name}</h3>
              <RecipeSlider categoryId={category.id} />
            </div>
          ))}
        </>
      )}
      <ScrollToTopButton />
    </section>
  );
};

export default RecipesPage;
