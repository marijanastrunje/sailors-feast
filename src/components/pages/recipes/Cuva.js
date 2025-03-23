<div className="preview mt-4 p-3 border rounded">
  <h5>Recipe Preview:</h5>
  <p><strong>Title:</strong> {title}</p>
  <p><strong>Description:</strong> {description}</p>
  <p><strong>Category:</strong> {categoryOptions.find(cat => cat.id === selectedCategoryId)?.name || "N/A"}</p>
  <p><strong>Type:</strong> {type}</p>
  <p><strong>Diet:</strong> {diet}</p>
  <p><strong>Main Ingredient:</strong> {mainIngredient}</p>
  <p><strong>Difficulty:</strong> {difficulty}</p>
  <p><strong>Prep Time:</strong> {prepTime} min</p>
  <p><strong>Cooking Time:</strong> {cookingTime} min</p>
  <p><strong>Servings:</strong> {servings}</p>
  <p><strong>Method:</strong> {method.join(", ") || "None"}</p>
  <h6>Ingredients:</h6>
  <ul>
    {ingredients.map((ing, index) => (
      <li key={index}>{ing.quantity} {ing.unit} {ing.name}</li>
    ))}
  </ul>
  <h6>Instructions:</h6>
  <ol>
    {instructions.map((step, index) => (
      <li key={index}>{step}</li>
    ))}
  </ol>
</div>


