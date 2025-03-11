import React, { useEffect, useState } from "react";
import './RecipeTags.css'

const RecipeTags = ({ postID }) => {
  const [healthyTags, setHealthyTags] = useState([]);
  const [lunchTags, setLunchTags] = useState([]);
  const [fitTags, setFitTags] = useState([]);
  const [dinnerTags, setDinnerTags] = useState([]);

  useEffect(() => {
    if (!postID) return;

    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/healthy?post=" + postID)
      .then(response => response.json())
      .then(data => setHealthyTags(data));

    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/lunch?post=" + postID)
      .then(response => response.json())
      .then(data => setLunchTags(data));

    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/fit?post=" + postID)
      .then(response => response.json())
      .then(data => setFitTags(data));

    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/dinner?post=" + postID)
      .then(response => response.json())
      .then(data => setDinnerTags(data));
  }, [postID]);

  return (
    <div className="recipe-tags pb-1 d-flex justify-content-center">
      {healthyTags.map(tag => (
        <span key={tag.id} className="healthy mx-1">
          {tag.name}
        </span>
      ))}

      {lunchTags.map(tag => (
        <span key={tag.id} className="lunch mx-1">
          {tag.name}
        </span>
      ))}

      {fitTags.map(tag => (
        <span key={tag.id} className="fit mx-1">
          {tag.name}
        </span>
      ))}

      {dinnerTags.map(tag => (
        <span key={tag.id} className="dinner mx-1">
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default RecipeTags;
