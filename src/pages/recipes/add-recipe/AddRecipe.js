import React, { useState, useEffect, useRef, useCallback } from "react";
import compressImage from "../../../utils/compressImage";
import RelatedBoxesField from "./RecommendedBoxField";

// Component for displaying loading indicator
const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="d-flex align-items-center my-3">
    <div className="spinner-border spinner-border-sm text-prim me-2" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <span>{text}</span>
  </div>
);

// Component for ingredient input with section support
const IngredientsField = ({ ingredients, setIngredients }) => {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");
  const [sectionName, setSectionName] = useState(""); // Field for section

  // List of available measurement units
  const unitOptions = [
    "g", "kg", "ml", "dcl", "l", "pc", "pcs", "tbsp", "spoon", "cup", "pinch", "add to taste", ""
  ];

  const handleAddIngredient = () => {
    if (ingredientName.trim()) {
      setIngredients([
        ...ingredients,
        {
          name: ingredientName,
          quantity: ingredientQuantity,
          unit: ingredientUnit,
          section_name: sectionName // Adding section
        }
      ]);
      setIngredientName("");
      setIngredientQuantity("");
      setIngredientUnit("");
      // We don't reset sectionName so the user can add more ingredients to the same section
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  // Find all unique sections from existing ingredients
  const sections = [...new Set(ingredients.map(ing => ing.section_name).filter(Boolean))];

  return (
    <div className="mb-4">
      <h3 className="h5 mb-3">Ingredients</h3>

      {/* List of all ingredients grouped by sections */}
      {ingredients.length > 0 && (
        <div className="mb-3">
          <h4 className="h6">Added Ingredients:</h4>
          {sections.map(section => (
            <div key={section} className="mb-3">
              <h5 className="h6 text-muted">{section}</h5>
              <ul className="list-group mb-2">
                {ingredients
                  .filter(ing => ing.section_name === section)
                  .map((ing, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {ing.name} {ing.quantity} {ing.unit}
                      <button 
                        type="button" 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleRemoveIngredient(
                          ingredients.findIndex(i => 
                            i.name === ing.name && 
                            i.quantity === ing.quantity && 
                            i.unit === ing.unit && 
                            i.section_name === ing.section_name
                          )
                        )}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {/* Ingredients without section */}
          {ingredients.filter(ing => !ing.section_name).length > 0 && (
            <div className="mb-3">
              <h5 className="h6 text-muted">Other ingredients</h5>
              <ul className="list-group mb-2">
                {ingredients
                  .filter(ing => !ing.section_name)
                  .map((ing, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {ing.name} {ing.quantity} {ing.unit}
                      <button 
                        type="button" 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleRemoveIngredient(
                          ingredients.findIndex(i => 
                            i.name === ing.name && 
                            i.quantity === ing.quantity && 
                            i.unit === ing.unit && 
                            !i.section_name
                          )
                        )}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Form for adding new ingredients */}
      <div className="row g-2">
        <div className="col-12 mb-2">
          <label>Section (e.g. Sponge, Cream, Glaze...)</label>
          <input
            type="text"
            className="form-control"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Leave empty for ingredients without a section"
          />
        </div>
        <div className="col-6">
          <input
            type="text"
            className="form-control"
            placeholder="Ingredient Name"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
          />
        </div>
        <div className="col-3">
          <input
            type="text"
            className="form-control"
            placeholder="Quantity"
            value={ingredientQuantity}
            onChange={(e) => setIngredientQuantity(e.target.value)}
          />
        </div>
        <div className="col-3">
          <select
            className="form-select"
            value={ingredientUnit}
            onChange={(e) => setIngredientUnit(e.target.value)}
          >
            <option value="">-- Unit --</option>
            {unitOptions.map(unit => (
              <option key={unit} value={unit}>
                {unit || "no unit"}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <button type="button" className="btn btn-sm btn-secondary mt-2" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for steps input with section and title support
const StepsField = ({ instructions, setInstructions }) => {
  const [stepText, setStepText] = useState("");
  const [stepTitle, setStepTitle] = useState(""); // Field for step title
  const [sectionName, setSectionName] = useState(""); // Field for section

  const handleAddStep = () => {
    if (stepText.trim()) {
      setInstructions([
        ...instructions,
        {
          text: stepText,
          title: stepTitle,
          section_name: sectionName
        }
      ]);
      setStepText("");
      setStepTitle("");
      // We don't reset sectionName so the user can add more steps to the same section
    }
  };

  const handleRemoveStep = (index) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };

  // Find all unique sections from existing steps
  const sections = [...new Set(instructions.map(step => step.section_name).filter(Boolean))];

  return (
    <div className="mb-4">
      <h3 className="h5 mb-3">Instructions</h3>

      {/* List of all steps grouped by sections */}
      {instructions.length > 0 && (
        <div className="mb-3">
          <h4 className="h6">Added Steps:</h4>
          {sections.map(section => (
            <div key={section} className="mb-3">
              <h5 className="h6 text-muted">{section}</h5>
              <ol className="list-group list-group-numbered mb-2">
                {instructions
                  .filter(step => step.section_name === section)
                  .map((step, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        {step.title && <strong>{step.title}: </strong>}
                        {step.text}
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleRemoveStep(
                          instructions.findIndex(s => 
                            s.text === step.text && 
                            s.title === step.title && 
                            s.section_name === step.section_name
                          )
                        )}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
              </ol>
            </div>
          ))}

          {/* Steps without section */}
          {instructions.filter(step => !step.section_name).length > 0 && (
            <div className="mb-3">
              <h5 className="h6 text-muted">Other steps</h5>
              <ol className="list-group list-group-numbered mb-2">
                {instructions
                  .filter(step => !step.section_name)
                  .map((step, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        {step.title && <strong>{step.title}: </strong>}
                        {step.text}
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleRemoveStep(
                          instructions.findIndex(s => 
                            s.text === step.text && 
                            s.title === step.title && 
                            !s.section_name
                          )
                        )}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Form for adding new steps */}
      <div className="row g-2">
        <div className="col-12 mb-2">
          <label>Section (e.g. Sponge, Cream, Glaze...)</label>
          <input
            type="text"
            className="form-control"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Leave empty for steps without a section"
          />
        </div>
        <div className="col-12 mb-2">
          <label>Step Title (optional)</label>
          <input
            type="text"
            className="form-control"
            value={stepTitle}
            onChange={(e) => setStepTitle(e.target.value)}
            placeholder="Step title (optional)"
          />
        </div>
        <div className="col-12">
          <textarea
            className="form-control"
            placeholder="Step Instructions"
            value={stepText}
            onChange={(e) => setStepText(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        <div className="col-12">
          <button type="button" className="btn btn-sm btn-secondary mt-2" onClick={handleAddStep}>
            Add Step
          </button>
        </div>
      </div>
    </div>
  );
};

const RecipeForm = () => {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionDetails, setDescriptionDetails] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [type, setType] = useState("");
  const [diet, setDiet] = useState("");
  const [mainIngredient, setMainIngredient] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [method, setMethod] = useState([]);
  const [image, setImage] = useState(null);
  const imageInputRef = useRef(null);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  // Add state for related boxes
  const [relatedBoxes, setRelatedBoxes] = useState([]);

  const [terms, setTerms] = useState({});
  
  // Additional states for tracking loading
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTerms, setIsLoadingTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Optimized term fetching
  useEffect(() => {
    const taxonomies = ["recipe_type", "recipe_diet", "recipe_main_ingredient", "recipe_difficulty"];
    setIsLoadingTerms(true);
    
    // Using Promise.all for parallel fetching of all taxonomies
    Promise.all(
      taxonomies.map(taxonomy => 
        fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/${taxonomy}?per_page=100`)
          .then(res => res.json())
          .then(data => ({ taxonomy, data }))
      )
    )
    .then(results => {
      const newTerms = {};
      results.forEach(({ taxonomy, data }) => {
        newTerms[taxonomy] = data;
      });
      setTerms(newTerms);
      setIsLoadingTerms(false);
    })
    .catch(error => {
      console.error("Error fetching taxonomies:", error);
      setIsLoadingTerms(false);
    });
  }, []);
  
  // Optimized category fetching
  useEffect(() => {
    setIsLoadingCategories(true);
    
    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/recipe_categories")
      .then(res => res.json())
      .then(data => {
        setCategoryOptions(data);
        if (data.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(data[0].id);
        }
        setIsLoadingCategories(false);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        setIsLoadingCategories(false);
      });
  }, [selectedCategoryId]);

  const getOrCreateTermId = useCallback(async (taxonomy, termName, token) => {
    if (!termName) return null;
    
    try {
        // 1. First try to fetch the term by name
        const searchRes = await fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/${taxonomy}?search=${encodeURIComponent(termName)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        const searchData = await searchRes.json();

        if (searchData.length > 0) {
        // Already exists - return its ID
        return searchData[0].id;
        }

        // 2. If it doesn't exist, create a new term
        const createRes = await fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/${taxonomy}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: termName }),
        });

        const createData = await createRes.json();
        return createData.id;

    } catch (error) {
        console.error(`Error handling term "${termName}" in ${taxonomy}:`, error);
        return null;
    }
  }, []);

  const handleMethodChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMethod([...method, value]);
    } else {
      setMethod(method.filter((item) => item !== value));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      const compressed = await compressImage(file, 800, 0.7);
      setImage(compressed);
    } catch (error) {
      alert(error.message || "Failed to compress image.");
      imageInputRef.current.value = "";
      setImage(null);
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDescriptionDetails("");
    setSelectedCategoryId(categoryOptions[0]?.id || "");
    setType("");
    setDiet("");
    setMainIngredient("");
    setDifficulty("");
    setPrepTime("");
    setCookingTime("");
    setServings("");
    setMethod([]);
    setImage(null);
    setIngredients([]);
    setInstructions([]);
    setRelatedBoxes([]); // Reset related boxes

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("User not authenticated");
      return;
    }

    // Set loading state
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      let imageId = "";
      
      // 1. Upload image if it exists
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("title", title);

        const uploadResponse = await fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/media", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }
        
        const uploadData = await uploadResponse.json();
        console.log("Upload Response:", uploadData);
        imageId = uploadData.id;
      }

      // 2. Fetch or create all terms in parallel
      const [recipeTypeId, recipeDietId, mainIngredientId, difficultyId] = await Promise.all([
        getOrCreateTermId("recipe_type", type, token),
        getOrCreateTermId("recipe_diet", diet, token),
        getOrCreateTermId("recipe_main_ingredient", mainIngredient, token),
        getOrCreateTermId("recipe_difficulty", difficulty, token)
      ]);

      // 3. Prepare data for ingredients and steps
      const ingredientsData = {};
      ingredients.forEach((ing, index) => {
        const i = index + 1;
        ingredientsData[`ingredient_${i}_name`] = ing.name;
        ingredientsData[`ingredient_${i}_quantity`] = ing.quantity;
        ingredientsData[`ingredient_${i}_unit`] = ing.unit;
        ingredientsData[`ingredient_${i}_section_name`] = ing.section_name || "";
      });

      const stepsData = {};
      instructions.forEach((step, index) => {
        const i = index + 1;
        stepsData[`step_${i}_text`] = step.text;
        stepsData[`step_${i}_title`] = step.title || "";
        stepsData[`step_${i}_section_name`] = step.section_name || "";
      });

      // 4. Prepare recipe data
      const recipeData = {
        title,
        status: "pending",
        featured_media: imageId,
        recipe_categories: [selectedCategoryId],
        recipe_type: recipeTypeId ? [recipeTypeId] : [],
        recipe_diet: recipeDietId ? [recipeDietId] : [],
        recipe_main_ingredient: mainIngredientId ? [mainIngredientId] : [],
        recipe_difficulty: difficultyId ? [difficultyId] : [],

        acf: {
          recipe_description: description,
          recipe_description_details: descriptionDetails,
          recipe_ingredients: ingredientsData, 
          recipe_steps: stepsData,         
          recipe_prep_time: prepTime,
          recipe_cooking_time: cookingTime,
          recipe_servings: servings,
          recipe_method: method,
          recipe_related_boxes: relatedBoxes, // Add related boxes
        },
      };

      // 5. Send recipe to backend
      const response = await fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit recipe");
      }

      const responseData = await response.json();
      console.log("Recipe submitted:", responseData);
      
      // Show success message and reset form
      setSuccessMessage("Recipe added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error submitting recipe:", error);
      alert("Error submitting recipe: " + error.message);
    } finally {
      // End loading state
      setIsSubmitting(false);
    }
  };

  // Is loading icon displayed
  const isLoading = isLoadingCategories || isLoadingTerms;

  return (
    <section id="add-recipe" className="container py-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <h1 className="text-center mb-4">Create New Recipe</h1>
          
          {isLoading ? (
            <LoadingSpinner text="Loading form data..." />
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Category Select */}
              <div className="mb-3">
                  <label>Category</label>
                  <select
                      className="form-select"
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
                      disabled={isSubmitting}
                  >
                      {categoryOptions.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                          {cat.name}
                      </option>
                      ))}
                  </select>
              </div>

              {/* Title */}
              <div className="mb-3">
                <label>Recipe Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  disabled={isSubmitting}
                /> 
              </div>
    
              {/* Type */}
              <div className="mb-3">
                <label>Type (e.g. Soup, Main dish...)</label>
                <input
                  type="text"
                  className="form-control"
                  list="recipe-type-options"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={isSubmitting}
                />
                <datalist id="recipe-type-options">
                  {terms["recipe_type"]?.map((term) => (
                    <option key={term.id} value={term.name} />
                  ))}
                </datalist>
              </div>

              {/* Diet */}
              <div className="mb-3">
                <label>Diet (e.g. Vegetarian, Gluten-free...)</label>
                <input
                  type="text"
                  className="form-control"
                  list="recipe-diet-options"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  disabled={isSubmitting}
                />
                <datalist id="recipe-diet-options">
                  {terms["recipe_diet"]?.map((term) => (
                    <option key={term.id} value={term.name} />
                  ))}
                </datalist>
              </div>
    
              {/* Main Ingredient */}
              <div className="mb-3">
                <label>Main Ingredient (e.g. Meat, Vegetables...)</label>
                <input
                  type="text"
                  className="form-control"
                  list="recipe-main-ingredient-options"
                  value={mainIngredient}
                  onChange={(e) => setMainIngredient(e.target.value)}
                  disabled={isSubmitting}
                />
                <datalist id="recipe-main-ingredient-options">
                  {terms["recipe_main_ingredient"]?.map((term) => (
                    <option key={term.id} value={term.name} />
                  ))}
                </datalist>
              </div>
    
              {/* Difficulty */}
              <div className="mb-3">
                <label>Difficulty (e.g. Easy, Medium, Hard)</label>
                <input
                  type="text"
                  className="form-control"
                  list="recipe-difficulty-options"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={isSubmitting}
                />
                <datalist id="recipe-difficulty-options">
                  {terms["recipe_difficulty"]?.map((term) => (
                    <option key={term.id} value={term.name} />
                  ))}
                </datalist>
              </div>
    
              {/* Prep Time */}
              <div className="mb-3">
                <label>Preparation Time (minutes)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={prepTime} 
                  onChange={(e) => setPrepTime(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
    
              {/* Cooking Time */}
              <div className="mb-3">
                <label>Cooking Time (minutes)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={cookingTime} 
                  onChange={(e) => setCookingTime(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
    
              {/* Servings */}
              <div className="mb-3">
                <label>Servings</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={servings} 
                  onChange={(e) => setServings(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
    
              {/* Method Checkboxes */}
              <div className="mb-3">
                <label>Method</label>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value="oven" 
                    id="method-oven" 
                    checked={method.includes("oven")} 
                    onChange={handleMethodChange}
                    disabled={isSubmitting}
                  />
                  <label className="form-check-label" htmlFor="method-oven">Oven</label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value="stove" 
                    id="method-stove" 
                    checked={method.includes("stove")} 
                    onChange={handleMethodChange}
                    disabled={isSubmitting}
                  />
                  <label className="form-check-label" htmlFor="method-stove">Stove</label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value="hand" 
                    id="method-hand" 
                    checked={method.includes("hand")} 
                    onChange={handleMethodChange}
                    disabled={isSubmitting}
                  />
                  <label className="form-check-label" htmlFor="method-hand">Hand</label>
                </div>
              </div>
    
              {/* Image Upload */}
              <div className="mb-3">
                <label>Recipe Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={handleImageUpload} 
                  ref={imageInputRef} 
                  required
                  disabled={isSubmitting}
                />
              </div>
    
              {/* Description */}
              <div className="mb-3">
                <label>Description</label>
                <textarea 
                  className="form-control" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required 
                  maxLength={68}
                  disabled={isSubmitting}
                />
                <small className="text-muted">{68 - description.length} characters remaining</small>
              </div>

              {/* Description details */}
              <div className="mb-3">
                <label>Description details</label>
                <textarea 
                  className="form-control" 
                  value={descriptionDetails} 
                  onChange={(e) => setDescriptionDetails(e.target.value)} 
                  required 
                  disabled={isSubmitting}
                />
              </div>
            
              {!isSubmitting && (
                <>
                  <IngredientsField ingredients={ingredients} setIngredients={setIngredients} />
                  <StepsField instructions={instructions} setInstructions={setInstructions} />
                  
                  {/* Add the Related Boxes Field */}
                  <RelatedBoxesField selectedBoxes={relatedBoxes} setSelectedBoxes={setRelatedBoxes} />
                </>
              )}
              
              {/* Success Message - positioned above submit button */}
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
                  {successMessage}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setSuccessMessage("")}
                    aria-label="Close"
                  ></button>
                </div>
              )}
    
              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-prim w-100" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading Recipe...
                  </>
                ) : "Submit Recipe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecipeForm;