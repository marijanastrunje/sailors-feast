import React from "react";
import BoxLayout from "./Box";
import Faq from "../all-pages/Faq";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

const FeastBox = () => {

  return (
    <>
      <BoxLayout
        categoryId={202}
        categoryMapping={{
          203: 93, // subcategory.id : category.id
          204: 39,
          205: 114,
        }}
      />

      <div id="Faq">
          <Faq topicId={196} topic="Food Boxes" />
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default FeastBox;
