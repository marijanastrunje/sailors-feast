import React, { useState } from "react";

const IngredientsField = ({ ingredients, setIngredients }) => {
  const [editIndex, setEditIndex] = useState(null); // Drži index trenutno uređenog sastojka

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "g" }]);
    setEditIndex(ingredients.length); // Automatski otvara edit mode za novi sastojak
  };

  const deleteIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null); // Ako brišemo aktivni edit, resetiramo ga
  };

  return (
    <div className="mb-3">
      <label>Ingredients</label>
      {ingredients.map((ing, index) => (
        <div key={index} className="d-flex gap-2">
          <input 
            type="text" 
            placeholder="Name" 
            value={ing.name} 
            onChange={(e) => updateIngredient(index, "name", e.target.value)} 
            disabled={editIndex !== index}
          />
          <input 
            type="number" 
            placeholder="Quantity" 
            value={ing.quantity} 
            onChange={(e) => updateIngredient(index, "quantity", e.target.value)} 
            disabled={editIndex !== index}
          />
          <select 
            value={ing.unit} 
            onChange={(e) => updateIngredient(index, "unit", e.target.value)} 
            disabled={editIndex !== index}
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="dcl">dcl</option>
            <option value="l">l</option>
            <option value="kom">kom</option>
          </select>

          {editIndex === index ? (
            <button type="button" onClick={() => setEditIndex(null)}>✅ Save</button>
          ) : (
            <button type="button" onClick={() => setEditIndex(index)}>✏️ Edit</button>
          )}
          
          <button type="button" onClick={() => deleteIngredient(index)}>❌</button>
        </div>
      ))}
      <button type="button" onClick={addIngredient}>➕ Add Ingredient</button>
    </div>
  );
};

export default IngredientsField;
