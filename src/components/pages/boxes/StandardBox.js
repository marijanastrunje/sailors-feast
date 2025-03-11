import React from "react";
import BoxLayout from "./Box";

const StandardBox = () => {
  return (
    <BoxLayout
      categoryId={672}
      image="/img/box/standard-all-white.png"
      categoryMapping={{
        675: 599, // subcategory.id : category.id
        673: 625,
        674: 644,
      }}
    />
  );
};

export default StandardBox;
