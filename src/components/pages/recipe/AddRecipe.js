import React, { useState, useEffect , useRef} from "react";
import IngredientsField from "./IngredientsField";
import StepsField from "./StepsField";


const RecipeForm = () => {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const [terms, setTerms] = useState({});


  useEffect(() => {
    const taxonomies = ["recipe_type", "recipe_diet", "recipe_main_ingredient", "recipe_difficulty"];
  
    taxonomies.forEach((taxonomy) => {
      fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/${taxonomy}?per_page=100`)
        .then((res) => res.json())
        .then((data) => {
          setTerms((prev) => ({ ...prev, [taxonomy]: data }));
        });
    });
  }, []);
  

  useEffect(() => {
    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/recipe_categories")
      .then(res => res.json())
      .then(data => {
        setCategoryOptions(data);
        if (data.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(data[0].id); // set samo ako već nije odabrana
        }
      });
  }, [selectedCategoryId]);

  const getOrCreateTermId = async (taxonomy, termName, token) => {
    try {
        // 1. Prvo pokušavamo dohvatiti pojam po imenu
        const searchRes = await fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/${taxonomy}?search=${encodeURIComponent(termName)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        const searchData = await searchRes.json();

        if (searchData.length > 0) {
        // Već postoji – vraćamo njegov ID
        return searchData[0].id;
        }

        // 2. Ako ne postoji, kreiramo novi pojam
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
    };


  const handleMethodChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMethod([...method, value]);
    } else {
      setMethod(method.filter((item) => item !== value));
    }
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("User not authenticated");
      return;
    }

    let imageId = "";
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
      const uploadData = await uploadResponse.json();
      console.log("Upload Response:", uploadData);
      imageId = uploadData.id;
    }

    const recipeTypeId = await getOrCreateTermId("recipe_type", type, token);
    const recipeDietId = await getOrCreateTermId("recipe_diet", diet, token);
    const mainIngredientId = await getOrCreateTermId("recipe_main_ingredient", mainIngredient, token);
    const difficultyId = await getOrCreateTermId("recipe_difficulty", difficulty, token);


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
        recipe_ingredients: ingredients.reduce((acc, ing, index) => {
          acc[`ingredient_${index + 1}_name`] = ing.name;
          acc[`ingredient_${index + 1}_quantity`] = ing.quantity;
          acc[`ingredient_${index + 1}_unit`] = ing.unit;
          return acc;
        }, {}),
        recipe_steps: instructions.reduce((acc, step, index) => {
          acc[`step_${index + 1}_text`] = step;
          return acc;
        }, {}),
        recipe_prep_time: prepTime,
        recipe_cooking_time: cookingTime,
        recipe_servings: servings,
        recipe_method: method,
      },
    };

    const response = await fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipeData),
    });

    const responseData = await response.json();
    console.log("Recipe submitted:", responseData);
    alert("Recipe added successfully!");

    setTitle("");
    setDescription("");
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

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <section id="add-recipe" className="container py-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <h1 className="text-center mb-4">Create New Recipe</h1>
          <form onSubmit={handleSubmit}>
  
            {/* Category Select */}
            <div className="mb-3">
                <label>Category</label>
                <select
                    className="form-select"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
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
              <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
  
            {/* Type */}
            <div className="mb-3">
              <label>Type (npr. Juha, Glavno jelo...)</label>
              <input
                type="text"
                className="form-control"
                list="recipe-type-options"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
              <datalist id="recipe-type-options">
                {terms["recipe_type"]?.map((term) => (
                  <option key={term.id} value={term.name} />
                ))}
              </datalist>
            </div>


  
            {/* Diet */}
            <div className="mb-3">
              <label>Diet (npr. Vegetarijansko, Bez glutena...)</label>
              <input
                type="text"
                className="form-control"
                list="recipe-diet-options"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
              />
              <datalist id="recipe-diet-options">
                {terms["recipe_diet"]?.map((term) => (
                  <option key={term.id} value={term.name} />
                ))}
              </datalist>
            </div>

  
            {/* Main Ingredient */}
            <div className="mb-3">
              <label>Main Ingredient (npr. Meso, Povrće...)</label>
              <input
                type="text"
                className="form-control"
                list="recipe-main-ingredient-options"
                value={mainIngredient}
                onChange={(e) => setMainIngredient(e.target.value)}
              />
              <datalist id="recipe-main-ingredient-options">
                {terms["recipe_main_ingredient"]?.map((term) => (
                  <option key={term.id} value={term.name} />
                ))}
              </datalist>
            </div>

  
            {/* Difficulty */}
            <div className="mb-3">
              <label>Difficulty (npr. Lako, Srednje, Teško)</label>
              <input
                type="text"
                className="form-control"
                list="recipe-difficulty-options"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
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
              <input type="number" className="form-control" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
            </div>
  
            {/* Cooking Time */}
            <div className="mb-3">
              <label>Cooking Time (minutes)</label>
              <input type="number" className="form-control" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />
            </div>
  
            {/* Servings */}
            <div className="mb-3">
              <label>Servings</label>
              <input type="number" className="form-control" value={servings} onChange={(e) => setServings(e.target.value)} />
            </div>
  
            {/* Method Checkboxes */}
            <div className="mb-3">
              <label>Method</label>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="oven" id="method-oven" checked={method.includes("oven")} onChange={handleMethodChange} />
                <label className="form-check-label" htmlFor="method-oven">Oven</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="stove" id="method-stove" checked={method.includes("stove")} onChange={handleMethodChange} />
                <label className="form-check-label" htmlFor="method-stove">Stove</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="hand" id="method-hand" checked={method.includes("hand")} onChange={handleMethodChange} />
                <label className="form-check-label" htmlFor="method-hand">Hand</label>
              </div>
            </div>
  
            {/* Image Upload */}
            <div className="mb-3">
              <label>Recipe Image</label>
              <input type="file" className="form-control" onChange={handleImageUpload} ref={imageInputRef} required />
            </div>
  
            {/* Description */}
            <div className="mb-3">
              <label>Description</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={70} />
              <small className="text-muted">{70 - description.length} znakova preostalo</small>
            </div>
          
            <IngredientsField ingredients={ingredients} setIngredients={setIngredients} />
  
            <StepsField instructions={instructions} setInstructions={setInstructions} />
  
            {/* Submit Button */}
            <button type="submit" className="btn">Submit</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RecipeForm;