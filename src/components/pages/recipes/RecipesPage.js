import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipeSlider from "./RecipeSlider";
import Select from "react-select";

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
  const [cookingTime, setCookingTime] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [cookingMethod, setCookingMethod] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const methodOptions = [
    { value: "stove", label: "Stove", icon: "/img/recipes/stove.svg" },
    { value: "oven", label: "Oven", icon: "/img/recipes/oven.svg" },
    { value: "hand", label: "No cook", icon: "/img/recipes/hand.svg" },
  ];

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

        if (cookingTime) {
          filtered = filtered.filter((r) => {
            const prep = parseInt(r.acf?.recipe_prep_time) || 0;
            const cook = parseInt(r.acf?.recipe_cooking_time) || 0;
            const total = prep + cook;
            if (cookingTime === "under_15") return total < 15;
            if (cookingTime === "under_30") return total < 30;
            if (cookingTime === "under_60") return total < 60;
            if (cookingTime === "over_60") return total >= 60;
            return true;
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
        cookingTime !== "" ||
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
    setCookingTime("");
    setCookingMethod([]);
    setShowFilters(false);
  };

  return (
    <section id="recipes" className="container py-5">
      <h1 className="text-center mb-4">All Recipes</h1>

      {/* Mobile toggle */}
      <div className="d-md-none mb-3">
        <button className="btn btn-outline-primary w-100" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      <div className={`${showFilters ? '' : 'd-none'} d-md-block filter-box p-3 mb-4 border rounded shadow-sm bg-white`}>
        <div className="row row-cols-1 row-cols-md-3 g-3">
          {Object.entries(taxonomyFilters).map(([taxonomy, label]) => (
            <div key={taxonomy} className="col">
              <label className="form-label fw-semibold">{label}</label>
              <Select
                isMulti
                options={terms[taxonomy]?.map((term) => ({ value: term.id, label: term.name }))}
                value={selectedOptions[taxonomy] || []}
                onChange={(selected) => handleMultiSelectChange(taxonomy, selected)}
                placeholder={`Select ${label}`}
              />
            </div>
          ))}
          <div className="col">
            <label className="form-label fw-semibold">Total Time</label>
            <Select
              options={cookingTimeOptions}
              value={cookingTimeOptions.find((opt) => opt.value === cookingTime) || null}
              onChange={(selected) => setCookingTime(selected?.value || "")}
              isClearable
              placeholder="Filter by time"
            />
          </div>
          <div className="col">
            <label className="form-label fw-semibold">Method</label>
            <Select
              isMulti
              options={methodOptions.map(opt => ({
                value: opt.value,
                label: (
                  <div className="d-flex align-items-center gap-2">
                    <img src={opt.icon} width="20" height="20" alt={opt.label} />
                    <span>{opt.label}</span>
                  </div>
                ),
              }))}
              value={methodOptions
                .filter(opt => cookingMethod.includes(opt.value))
                .map(opt => ({
                  value: opt.value,
                  label: (
                    <div className="d-flex align-items-center gap-2">
                      <img src={opt.icon} width="20" height="20" alt={opt.label} />
                      <span>{opt.label}</span>
                    </div>
                  ),
                }))}
              onChange={(selected) => setCookingMethod(selected?.map((opt) => opt.value) || [])}
              placeholder="Filter by method"
            />
          </div>
        </div>

        {(Object.values(filters).some((val) => val?.length > 0) || cookingTime || cookingMethod.length > 0) && (
          <div className="text-end mt-3">
            <button className="btn btn-outline-secondary btn-sm" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {isFiltering ? (
        <div className="col-md-10 mx-auto">
          <div className="row recipes-results">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div key={recipe.id} className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4 p-0">
                  <RecipeCard recipe={recipe} />
                </div>
              ))
            ) : (
              <p className="text-center">No recipes found.</p>
            )}
          </div>
        </div>

      ) : (
        <>
          <h2 className="text-center mb-4">Popular by Category</h2>
          {categories.map((category) => (
            <div key={category.id} className="mb-5 col-md-10 mx-auto">
              <h3 className="text-center">{category.name}</h3>
              <RecipeSlider categoryId={category.id} />
            </div>
          ))}
        </>
      )}
    </section>
  );
};

export default RecipesPage;
