import React, { useEffect, useState } from "react";

const categoryCache = {};

const PostCategory = ({ categoryID }) => {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (categoryCache[categoryID]) {
      setCategory(categoryCache[categoryID]);
      return;
    }

    fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/categories/${categoryID}`)
      .then(response => response.json())
      .then((data) => {
        categoryCache[categoryID] = data; 
        setCategory(data);
      })
      .catch(error => console.error("Error fetching category:", error));
  }, [categoryID]);

  if (!category) return null;

  return <span className="category">{category.name}</span>;
};

export default PostCategory;
