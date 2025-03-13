import React from "react";
import BoxLayout from "./Box";

const StandardBox = () => {
  return (
    <BoxLayout
      categoryId={108}
      image="/img/box/standard-all-white.png"
      categoryMapping={{
        136: 93, // subcategory.id : category.id
        109: 39,
        113: 114,
      }}
    />
  );
};

export default StandardBox;
