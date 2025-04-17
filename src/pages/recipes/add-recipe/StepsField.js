import React, { useState } from "react";

const StepsField = ({ instructions, setInstructions }) => {
  const [editIndex, setEditIndex] = useState(null); // Drži index trenutno uređenog koraka

  const updateStep = (index, value) => {
    const updatedSteps = [...instructions];
    updatedSteps[index] = value;
    setInstructions(updatedSteps);
  };

  const addStep = () => {
    setInstructions([...instructions, ""]);
    setEditIndex(instructions.length); // Automatski otvara edit mode za novi korak
  };

  const deleteStep = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null); // Ako brišemo aktivni edit, resetiramo ga
  };

  return (
    <div className="mb-3">
      <label>Instructions</label>
      {instructions.map((step, index) => (
        <div key={index} className="d-flex gap-2">
          <textarea
            className="form-control"
            value={step}
            onChange={(e) => updateStep(index, e.target.value)}
            disabled={editIndex !== index} // Onemogućuje uređivanje dok nije u Edit Mode-u
          />
          
          {editIndex === index ? (
            <button type="button" onClick={() => setEditIndex(null)}>✅ Save</button>
          ) : (
            <button type="button" onClick={() => setEditIndex(index)}>✏️ Edit</button>
          )}
          
          <button type="button" onClick={() => deleteStep(index)}>❌</button>
        </div>
      ))}
      <button type="button" onClick={addStep}>➕ Add Step</button>
    </div>
  );
};

export default StepsField;
