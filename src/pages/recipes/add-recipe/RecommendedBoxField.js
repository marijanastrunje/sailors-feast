import React, { useState, useEffect } from 'react';

const RelatedBoxesField = ({ selectedBoxes, setSelectedBoxes }) => {
  const [availableBoxes, setAvailableBoxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Fetch all available boxes from the backend
    setIsLoading(true);
    fetch(`${backendUrl}/wp-json/wp/v2/boxes?per_page=100`)
      .then(res => res.json())
      .then(data => {
        setAvailableBoxes(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching boxes:", error);
        setIsLoading(false);
      });
  }, [backendUrl]);

  // Handle adding a box to the selection
  const handleBoxSelection = (e) => {
    const selectedId = parseInt(e.target.value);
    if (selectedId && !selectedBoxes.includes(selectedId)) {
      setSelectedBoxes([...selectedBoxes, selectedId]);
    }
  };

  // Handle removing a box from the selection
  const handleRemoveBox = (boxId) => {
    setSelectedBoxes(selectedBoxes.filter(id => id !== boxId));
  };

  return (
    <div className="mb-4">
      <h3 className="h5 mb-3">Related Ingredient Boxes</h3>
      
      {/* Display selected boxes */}
      {selectedBoxes.length > 0 && (
        <div className="mb-3">
          <h4 className="h6">Selected Boxes:</h4>
          <ul className="list-group mb-3">
            {selectedBoxes.map(boxId => {
              const box = availableBoxes.find(b => b.id === boxId);
              return box ? (
                <li key={boxId} className="list-group-item d-flex justify-content-between align-items-center">
                  <span dangerouslySetInnerHTML={{ __html: box.title.rendered }} />
                  <button 
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveBox(boxId)}
                  >
                    &times;
                  </button>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}

      {/* Select box dropdown */}
      <div className="mb-3">
        <label htmlFor="boxSelect" className="form-label">Add related box</label>
        {isLoading ? (
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm text-prim me-2" role="status">
              <span className="visually-hidden">Loading boxes...</span>
            </div>
            <span>Loading boxes...</span>
          </div>
        ) : (
          <select 
            className="form-select" 
            id="boxSelect"
            onChange={handleBoxSelection}
            value=""
          >
            <option value="">-- Select a box --</option>
            {availableBoxes.map(box => (
              // Only show boxes that aren't already selected
              !selectedBoxes.includes(box.id) && (
                <option key={box.id} value={box.id}>
                  {box.title.rendered.replace(/<[^>]*>/g, '')}
                </option>
              )
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default RelatedBoxesField;