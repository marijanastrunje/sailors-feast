import React from "react";
import BoxLayout from "./Box";
import Faq from "../all-pages/Faq";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

const StandardBox = () => {

  return (
    <>
      <BoxLayout
        categoryId={108}
        image="/img/box/standard-all-white.png"
        categoryMapping={{
          136: 93, // subcategory.id : category.id
          109: 39,
          113: 114,
        }}
      />

      <div id="Faq">
          <Faq topicId={196} topic="Food Boxes" />
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default StandardBox;
