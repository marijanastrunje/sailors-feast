import React, { useEffect, useState } from "react";
import "./RecipeTags.css";

const RecipeTags = ({ postID }) => {
  const [healthyTags, setHealthyTags] = useState([]);
  const [lunchTags, setLunchTags] = useState([]);
  const [fitTags, setFitTags] = useState([]);
  const [dinnerTags, setDinnerTags] = useState([]);

  useEffect(() => {
    if (!postID) return;

    const tagEndpoints = {
      healthy: setHealthyTags,
      lunch: setLunchTags,
      fit: setFitTags,
      dinner: setDinnerTags,
    };

    Object.entries(tagEndpoints).forEach(([tagType, setTagState]) => {
      fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/${tagType}?post=${postID}`)
        .then(response => response.json())
        .then(data => setTagState(data))
        .catch(error => console.error(`Error fetching ${tagType} tags:`, error));
    });
  }, [postID]);

  return (
    <div className="recipe-tags pb-1 d-flex justify-content-center">
      {healthyTags.map(tag => (
        <span key={tag.id} className="healthy me-1">
          {tag.name}
        </span>
      ))}

      {lunchTags.map(tag => (
        <span key={tag.id} className="lunch me-1">
          {tag.name}
        </span>
      ))}

      {fitTags.map(tag => (
        <span key={tag.id} className="fit me-1">
          {tag.name}
        </span>
      ))}

      {dinnerTags.map(tag => (
        <span key={tag.id} className="dinner">
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default RecipeTags;
