import React, { useEffect, useState } from "react";

const PostCategory = ({ categoryID }) => {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!categoryID) return;

    fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/categories/${categoryID}`)
      .then(response => response.json())
      .then(data => setCategory(data))
      .catch(error => console.error("Error fetching category:", error));
  }, [categoryID]);

  if (!category) return <p>Loading...</p>;

  return <span className="category">{category.name}</span>;
};

export default PostCategory;
