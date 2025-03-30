import React from "react";
import BoxLayout from "./Box";
import Faq from "../all-pages/Faq";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

const HealthyBox = () => {

  return (
    <>
      <BoxLayout
        categoryId={206}
        categoryMapping={{
          207: 93, // subcategory.id : category.id
          208: 39,
          209: 114,
        }}
      />

      <div id="Faq">
          <Faq topicId={196} topic="Food Boxes" />
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default HealthyBox;
